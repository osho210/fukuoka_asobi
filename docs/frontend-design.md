## 1. 目的

本設計書は、DevOps × AI Agent Hackathon におけるフロントエンドアプリケーションの設計方針を定義する。

本プロダクトでは、GitHub / Slack / Backlog / Google Calendar などの活動データを可視化し、プロジェクト健全性・遅延リスク・負荷状況・AIインサイトをユーザーに分かりやすく提示する。

そのため、フロントエンドでは以下を重視する。

```
- UIとロジックの分離
- API通信処理の分離
- Server State と UI State の分離
- ダッシュボードUIの拡張性
- Storybookで確認しやすいUI構造
- Hackathonで実装し切れる現実的な設計
```

---

# 2. 採用アーキテクチャ

本フロントエンドでは、以下の設計方針を採用する。

```
Container / Presentational Pattern
+ Feature-based Directory
+ TanStack Query
+ Service Layer
+ Presenter / ViewModel
```

特に中心となるのは、**Container / Presentational Pattern** である。

---

# 3. 基本方針

## 3.1 Container / Presentational Pattern

```
Container
- データ取得
- 状態管理
- イベント処理
- hookの呼び出し
- presenterによるViewModel変換
- Presentational Componentへのprops受け渡し

Presentational Component
- propsを受け取ってUIを描画する
- API通信を知らない
- TanStack Queryを知らない
- Serviceを直接呼ばない
- 状態管理ロジックを持たない
```

呼び出し構造は以下とする。

```
page.tsx
  ↓
container
  ↓
hook
  ↓
service
  ↓
http-client
  ↓
backend api
```

表示データの流れは以下とする。

```
backend response
  ↓
hook
  ↓
container
  ↓
presenter
  ↓
presentational component
```

---

# 4. ディレクトリ構成

```
src/
  app/
    dashboard/
      page.tsx
    projects/
      page.tsx
      [projectId]/
        page.tsx
    ai-insights/
      page.tsx

  features/
    projects/
      containers/
        project-list.container.tsx
        project-detail.container.tsx
        create-project-form.container.tsx

      components/
        project-list.tsx
        project-card.tsx
        project-detail.tsx
        create-project-form.tsx

      hooks/
        use-projects.ts
        use-project.ts
        use-create-project.ts

      services/
        project.service.ts

      presenters/
        project.presenter.ts

      types/
        project.types.ts

      schemas/
        create-project.schema.ts

    activities/
      containers/
        activity-timeline.container.tsx
        collect-activities-button.container.tsx

      components/
        activity-timeline.tsx
        activity-item.tsx
        activity-source-badge.tsx
        collect-activities-button.tsx

      hooks/
        use-activities.ts
        use-collect-activities.ts

      services/
        activity.service.ts

      presenters/
        activity-timeline.presenter.ts

      types/
        activity.types.ts

    analytics/
      containers/
        project-health-dashboard.container.tsx
        project-health-filter.container.tsx

      components/
        project-health-dashboard.tsx
        project-health-filter.tsx
        health-score-card.tsx
        risk-summary-card.tsx
        delay-risk-panel.tsx
        workload-chart.tsx
        quality-risk-panel.tsx

      hooks/
        use-project-health.ts
        use-analyze-project-health.ts

      services/
        analytics.service.ts

      presenters/
        project-health-dashboard.presenter.ts

      types/
        analytics.types.ts

    ai-insights/
      containers/
        insight-panel.container.tsx
        generate-insight.container.tsx

      components/
        insight-panel.tsx
        insight-list.tsx
        insight-card.tsx
        generate-insight-button.tsx

      hooks/
        use-insights.ts
        use-generate-insight.ts

      services/
        ai-insight.service.ts

      presenters/
        insight-panel.presenter.ts

      types/
        insight.types.ts

  shared/
    api/
      http-client.ts
      api-error.ts

    ui/
      button.tsx
      card.tsx
      badge.tsx
      spinner.tsx
      empty-state.tsx
      error-state.tsx

    hooks/
      use-disclosure.ts
      use-debounce.ts

    lib/
      date.ts
      format.ts
      cn.ts

    constants/
      routes.ts
      query-keys.ts

    types/
      nullable.ts
      result.ts
```

---

# 5. 各ディレクトリの責務

## 5.1 app

Next.js App Router のルーティングを担当する。

```
app/
  dashboard/
    page.tsx
  projects/
    page.tsx
    [projectId]/
      page.tsx
  ai-insights/
    page.tsx
```

`page.tsx` は、原則としてContainerを呼び出すだけにする。

```
import {ProjectHealthDashboardContainer }from'@/features/analytics/containers/project-health-dashboard.container';

exportdefaultfunctionDashboardPage() {
return<ProjectHealthDashboardContainer/>;
}
```

`page.tsx` に以下は書かない。

```
- API通信
- useQuery
- useMutation
- 複雑な状態管理
- UI表示用のデータ整形
- 業務判断ロジック
```

---

## 5.2 features

機能単位の実装を配置する。

```
features/
  projects/
  activities/
  analytics/
  ai-insights/
```

各featureは、以下の構成を基本とする。

```
containers/
components/
hooks/
services/
presenters/
types/
schemas/
```

---

## 5.3 containers

Container Componentを配置する。

```
features/analytics/containers/
  project-health-dashboard.container.tsx
```

Containerの責務は以下。

```
- hookを呼び出す
- loading / error / empty 状態を扱う
- イベントハンドラを定義する
- mutation実行後の処理をまとめる
- presenterでViewModelへ変換する
- Presentational Componentへpropsを渡す
```

例：

```
'use client';

import {ProjectHealthDashboard }from'../components/project-health-dashboard';
import {useProjectHealth }from'../hooks/use-project-health';
import {useAnalyzeProjectHealth }from'../hooks/use-analyze-project-health';
import {toProjectHealthDashboardViewModel }from'../presenters/project-health-dashboard.presenter';

typeProps= {
  projectId:string;
};

exportfunctionProjectHealthDashboardContainer({ projectId }:Props) {
const { data, isLoading, error, refetch }=useProjectHealth(projectId);
constanalyzeMutation=useAnalyzeProjectHealth();

consthandleAnalyze=async () => {
awaitanalyzeMutation.mutateAsync({ projectId });
awaitrefetch();
  };

if (isLoading) {
return<ProjectHealthDashboardloading/>;
  }

if (error||!data) {
return (
<ProjectHealthDashboard
errorMessage="プロジェクトの分析情報を取得できませんでした"
onRetry={() =>refetch()}
/>
    );
  }

consthealth=toProjectHealthDashboardViewModel(data);

return (
<ProjectHealthDashboard
health={health}
analyzing={analyzeMutation.isPending}
onAnalyze={handleAnalyze}
/>
  );
}
```

Containerに書いてよいもの。

```
- hook呼び出し
- presenter呼び出し
- useStateによる局所的なUI状態
- イベントハンドラ
- Presentationalへのprops組み立て
```

Containerに書かないもの。

```
- fetch / axios の直接呼び出し
- 複雑なUI描画
- APIレスポンス形式に依存した表示ロジックの散在
- 汎用UI部品
```

---

## 5.4 components

Presentational Componentを配置する。

```
features/analytics/components/
  project-health-dashboard.tsx
  health-score-card.tsx
  risk-summary-card.tsx
```

Presentational Componentの責務は以下。

```
- propsを受け取る
- UIを描画する
- 必要に応じてユーザー操作をcallback propsで通知する
```

Presentational Componentは以下を知らない。

```
- TanStack Query
- Service
- API endpoint
- Backend responseの生データ
- Zustand
- useRouter
- useSearchParams
```

例：

```
typeProps= {
  loading?:boolean;
  errorMessage?:string;
  analyzing?:boolean;
  health?: {
    scoreLabel:string;
    scoreValue:number;
    riskLevelLabel:string;
    delayRiskLabel:string;
    workloadRiskLabel:string;
    qualityRiskLabel:string;
  };
  onAnalyze?: () =>void;
  onRetry?: () =>void;
};

exportfunctionProjectHealthDashboard({
  loading,
  errorMessage,
  analyzing,
  health,
  onAnalyze,
  onRetry,
}:Props) {
if (loading) {
return<div>読み込み中...</div>;
  }

if (errorMessage) {
return (
<div>
<p>{errorMessage}</p>
        {onRetry&&<buttononClick={onRetry}>再読み込み</button>}
</div>
    );
  }

if (!health) {
return<div>分析データがありません</div>;
  }

return (
<section>
<div>
<h1>プロジェクト健全性</h1>
<buttononClick={onAnalyze}disabled={analyzing}>
          {analyzing?'分析中...':'再分析する'}
</button>
</div>

<div>{health.scoreLabel}</div>
<div>{health.riskLevelLabel}</div>
<div>{health.delayRiskLabel}</div>
<div>{health.workloadRiskLabel}</div>
<div>{health.qualityRiskLabel}</div>
</section>
  );
}
```

---

## 5.5 hooks

TanStack Query / Mutation をラップするhookを配置する。

```
features/analytics/hooks/
  use-project-health.ts
  use-analyze-project-health.ts
```

hookの責務は以下。

```
- useQuery
- useMutation
- queryKey管理
- loading / error / refetch
- cache管理
- mutation後のinvalidate
```

例：

```
import {useQuery }from'@tanstack/react-query';
import {AnalyticsService }from'../services/analytics.service';
import {QueryKeys }from'@/shared/constants/query-keys';

exportconstuseProjectHealth= (projectId:string) => {
returnuseQuery({
    queryKey:QueryKeys.projectHealth(projectId),
    queryFn: () =>AnalyticsService.getProjectHealth(projectId),
  });
};
```

mutation例：

```
import {useMutation,useQueryClient }from'@tanstack/react-query';
import {AnalyticsService }from'../services/analytics.service';
import {QueryKeys }from'@/shared/constants/query-keys';

exportconstuseAnalyzeProjectHealth= () => {
constqueryClient=useQueryClient();

returnuseMutation({
    mutationFn:AnalyticsService.analyzeProjectHealth,
    onSuccess: (_,variables) => {
queryClient.invalidateQueries({
        queryKey:QueryKeys.projectHealth(variables.projectId),
      });
    },
  });
};
```

---

## 5.6 services

Backend APIとの通信処理を配置する。

```
features/analytics/services/
  analytics.service.ts
```

Serviceの責務は以下。

```
- HTTP methodの指定
- endpointの指定
- request bodyの組み立て
- response typeの定義
```

Serviceには以下を書かない。

```
- UI状態管理
- TanStack Query
- ViewModel変換
- 表示用文言の変換
- フォームバリデーション
```

例：

```
import {HttpClient }from'@/shared/api/http-client';
importtype {
AnalyzeProjectHealthInput,
ProjectHealth,
}from'../types/analytics.types';

exportconstAnalyticsService= {
  getProjectHealth:async (projectId:string):Promise<ProjectHealth> => {
returnHttpClient.get(`/projects/${projectId}/health`);
  },

  analyzeProjectHealth:async (
input:AnalyzeProjectHealthInput,
  ):Promise<ProjectHealth> => {
returnHttpClient.post(`/projects/${input.projectId}/health/analyze`,input);
  },
};
```

---

## 5.7 presenters

APIレスポンスやfeatureの型を、UI表示用のViewModelへ変換する。

```
features/analytics/presenters/
  project-health-dashboard.presenter.ts
```

Presenterの責務は以下。

```
- 表示用ラベルへの変換
- 日付表示形式の変換
- status / riskLevel などの表示文言変換
- Componentが扱いやすい形への整形
```

例：

```
importtype {ProjectHealth }from'../types/analytics.types';

exporttypeProjectHealthDashboardViewModel= {
  scoreLabel:string;
  scoreValue:number;
  riskLevelLabel:string;
  delayRiskLabel:string;
  workloadRiskLabel:string;
  qualityRiskLabel:string;
};

exportconsttoProjectHealthDashboardViewModel= (
health:ProjectHealth,
):ProjectHealthDashboardViewModel => {
return {
    scoreLabel:`${health.score}点`,
    scoreValue:health.score,
    riskLevelLabel:toRiskLevelLabel(health.riskLevel),
    delayRiskLabel:toRiskLabel(health.delayRisk),
    workloadRiskLabel:toRiskLabel(health.workloadRisk),
    qualityRiskLabel:toRiskLabel(health.qualityRisk),
  };
};

consttoRiskLevelLabel= (riskLevel:string):string => {
switch (riskLevel) {
case'HIGH':
return'高リスク';
case'MIDDLE':
return'中リスク';
case'LOW':
return'低リスク';
default:
return'未判定';
  }
};

consttoRiskLabel= (value:string):string => {
returnvalue||'未判定';
};
```

---

## 5.8 types

Feature内で利用する型を配置する。

```
features/analytics/types/
  analytics.types.ts
```

例：

```
exporttypeProjectHealth= {
  projectId:string;
  score:number;
  riskLevel:'HIGH'|'MIDDLE'|'LOW';
  delayRisk:string;
  workloadRisk:string;
  qualityRisk:string;
};

exporttypeAnalyzeProjectHealthInput= {
  projectId:string;
};
```

---

## 5.9 schemas

フォームバリデーション用のschemaを配置する。

```
features/projects/schemas/
  create-project.schema.ts
```

zodを利用する想定。

```
import {z }from'zod';

exportconstcreateProjectSchema=z.object({
  name:z.string().min(1,'プロジェクト名を入力してください').max(100),
});

exporttypeCreateProjectFormValues=z.infer<typeofcreateProjectSchema>;
```

フロントのschemaは、あくまで入力補助であり、最終的なバリデーションはバックエンドでも必ず実施する。

---

# 6. shared

共通部品を配置する。

```
shared/
  api/
  ui/
  hooks/
  lib/
  constants/
  types/
```

## 6.1 shared/api

HTTP通信の共通基盤を配置する。

```
shared/api/
  http-client.ts
  api-error.ts
```

例：

```
exportconstHttpClient= {
  get:async<T>(url:string):Promise<T> => {
constresponse=awaitfetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`);

if (!response.ok) {
thrownewError('API request failed');
    }

returnresponse.json();
  },

  post:async<T>(url:string,body:unknown):Promise<T> => {
constresponse=awaitfetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${url}`, {
      method:'POST',
      headers: {
'Content-Type':'application/json',
      },
      body:JSON.stringify(body),
    });

if (!response.ok) {
thrownewError('API request failed');
    }

returnresponse.json();
  },
};
```

---

## 6.2 shared/ui

汎用UIコンポーネントを配置する。

```
shared/ui/
  button.tsx
  card.tsx
  badge.tsx
  spinner.tsx
  empty-state.tsx
  error-state.tsx
```

ここに置いてよいもの。

```
- Button
- Card
- Badge
- Modal
- Spinner
- EmptyState
- ErrorState
```

ここに置かないもの。

```
- ProjectCard
- InsightCard
- ActivityTimeline
- HealthScoreCard
```

プロダクト固有のUIは `features/*/components` に置く。

---

## 6.3 shared/hooks

汎用hookを配置する。

```
shared/hooks/
  use-disclosure.ts
  use-debounce.ts
```

Feature固有のAPI取得hookは置かない。

避ける例：

```
shared/hooks/use-projects.ts
shared/hooks/use-insights.ts
```

---

## 6.4 shared/lib

汎用関数を配置する。

```
shared/lib/
  date.ts
  format.ts
  cn.ts
```

業務判断ロジックは置かない。

避ける例：

```
shared/lib/calculate-project-health.ts
shared/lib/judge-delay-risk.ts
```

---

## 6.5 shared/constants

共通定数を配置する。

```
shared/constants/
  routes.ts
  query-keys.ts
```

例：

```
exportconstQueryKeys= {
  projects: ['projects']asconst,
  project: (projectId:string) => ['projects',projectId]asconst,
  projectHealth: (projectId:string) =>
    ['projects',projectId,'health']asconst,
};
```

---

# 7. 状態管理方針

## 7.1 Server State

Backend API由来のデータは、TanStack Queryで管理する。

対象例：

```
- projects
- activities
- project health
- insights
- analytics result
```

TanStack Queryで扱うもの。

```
- loading
- error
- data
- refetch
- cache
- stale time
- mutation
- invalidate
```

---

## 7.2 UI State

UIだけで完結する状態は、`useState` または Zustand で管理する。

対象例：

```
- sidebar open
- selected period
- selected project id
- filter condition
- modal open
- dashboard view mode
```

初期は `useState` を優先する。

複数画面・複数featureをまたぐ状態になった場合のみ Zustand を検討する。

---

## 7.3 Zustandに入れないもの

以下はZustandに入れない。

```
- project list
- activity list
- project health
- insight list
- analytics result
```

これらはServer Stateであり、TanStack Queryで管理する。

---

# 8. 命名規則

## 8.1 ファイル名・ディレクトリ名

通常のファイル名・ディレクトリ名は kebab-case に統一する。

```
project-health-dashboard.container.tsx
use-project-health.ts
analytics.service.ts
project.types.ts
create-project.schema.ts
```

---

## 8.2 React Component関数名

React Component関数名は PascalCase にする。

```
exportfunctionProjectHealthDashboard() {}
exportfunctionHealthScoreCard() {}
```

---

## 8.3 hook関数名

hook関数名は camelCase かつ `useXxx` にする。

```
exportconstuseProjectHealth= () => {};
exportconstuseAnalyzeProjectHealth= () => {};
```

---

## 8.4 app配下の命名

URLになる静的セグメントは kebab-case とする。

```
app/
  ai-insights/
    page.tsx
```

動的セグメントは実装都合を優先し、camelCaseを許容する。

```
app/
  projects/
    [projectId]/
      page.tsx
```

理由は、コード上で扱いやすいため。

```
typeProps= {
  params: {
    projectId:string;
  };
};
```

---

# 9. ファイル命名ルール

```
Container
- xxx.container.tsx

Presentational Component
- xxx.tsx

Hook
- use-xxx.ts

Service
- xxx.service.ts

Presenter
- xxx.presenter.ts

Types
- xxx.types.ts

Schema
- xxx.schema.ts
```

例：

```
project-health-dashboard.container.tsx
project-health-dashboard.tsx
use-project-health.ts
analytics.service.ts
project-health-dashboard.presenter.ts
analytics.types.ts
create-project.schema.ts
```

---

# 10. Container / Hook / Service の関係

標準ルートは以下。

```
Container
  ↓
Hook
  ↓
Service
  ↓
HttpClient
  ↓
Backend API
```

Containerは原則としてServiceを直接呼ばない。

画面表示に関わるAPI通信はHook経由にする。

理由は、Hookが以下を担当するため。

```
- loading
- error
- refetch
- cache
- mutation
- invalidate
```

ただし、以下のような単発処理はContainerからServiceを直接呼んでもよい。

```
- CSVダウンロード
- 外部サービス疎通確認
- 一時的なプレビュー生成
- キャッシュ不要の単発処理
```

---

# 11. 実装ルール

## 11.1 page.tsx

```
- Containerを呼ぶだけにする
- API通信を書かない
- useQueryを書かない
- 複雑な状態管理を書かない
```

---

## 11.2 Container

```
- hookを呼ぶ
- presenterを呼ぶ
- イベントハンドラを定義する
- Presentational Componentへpropsを渡す
- 複雑なUIは書かない
```

---

## 11.3 Presentational Component

```
- propsを受け取って描画する
- APIを呼ばない
- serviceを呼ばない
- TanStack Queryを使わない
- Zustandを直接使わない
```

---

## 11.4 Hook

```
- TanStack Queryを扱う
- Serviceを呼ぶ
- queryKeyを管理する
- mutation後のinvalidateを行う
```

---

## 11.5 Service

```
- HTTP通信のみを担当する
- UI状態を持たない
- presenterを呼ばない
- hookを呼ばない
```

---

## 11.6 Presenter

```
- APIレスポンスをViewModelに変換する
- 表示用ラベルを作る
- 日付・ステータス・リスクレベルなどを表示用に変換する
- API通信はしない
```

---

# 12. 画面実装例

## 12.1 Dashboard

```
app/dashboard/page.tsx
  ↓
features/analytics/containers/project-health-dashboard.container.tsx
  ↓
features/analytics/hooks/use-project-health.ts
  ↓
features/analytics/services/analytics.service.ts
  ↓
shared/api/http-client.ts
```

表示は以下。

```
analytics.service.ts
  ↓
use-project-health.ts
  ↓
project-health-dashboard.container.tsx
  ↓
project-health-dashboard.presenter.ts
  ↓
project-health-dashboard.tsx
  ↓
health-score-card.tsx
```

---

# 13. Storybook方針

Storybookには、基本的にPresentational Componentを登録する。

対象例：

```
- project-card.tsx
- activity-timeline.tsx
- health-score-card.tsx
- risk-summary-card.tsx
- insight-card.tsx
- generate-insight-button.tsx
```

ContainerはAPIやhookに依存するため、基本的にはStorybook対象にしない。

必要な場合はmockを用意する。

Presentational Componentはpropsだけで描画できるため、Storybookと相性が良い。

---

# 14. この設計のメリット

## 14.1 UIとロジックを分離できる

Containerがロジックを持ち、Presentational ComponentはUIのみを担当するため、見通しが良くなる。

## 14.2 API変更に強い

API通信はServiceに閉じ込め、表示用変換はPresenterに閉じ込める。

そのため、Backend Responseが変更されても修正箇所を限定しやすい。

## 14.3 Server Stateを管理しやすい

TanStack QueryをHookに閉じ込めることで、loading / error / cache / refetch / mutationを統一的に扱える。

## 14.4 UI開発しやすい

Presentational Componentはpropsだけで描画できるため、Storybookで確認しやすい。

## 14.5 Hackathon後も拡張しやすい

Feature単位で閉じているため、後から以下の機能を追加しやすい。

```
- GitHub分析
- Slack負荷分析
- Backlog進捗分析
- Google Calendar会議分析
- AI改善提案
```

---

# 15. 注意点

## 15.1 分けすぎない

小さいUIまでContainerとPresentationalに分けると、ファイル数が増えすぎる。

基準は以下。

```
API通信・状態管理・イベント処理がある
→ Containerを作る

propsを表示するだけ
→ Presentational Component

単純な汎用UI
→ shared/ui
```

---

## 15.2 sharedを便利箱にしない

`shared` には汎用的なものだけを置く。

プロダクト固有のものは `features` に置く。

---

## 15.3 Serviceに業務ロジックを入れない

ServiceはHTTP通信のみ。

表示変換はPresenter、状態管理はHook、UIはComponentに分離する。

---

# 16. まとめ

本フロントエンドでは、以下の設計を採用する。

```
Container / Presentational Pattern
+ Feature-based Directory
+ TanStack Query
+ Service Layer
+ Presenter / ViewModel
```

最も重要なルールは以下。

```
page.tsx は Container を呼ぶだけ
Container は hook と presenter を使う
Hook は TanStack Query と Service を扱う
Service は API通信のみを扱う
Presenter は ViewModel変換を扱う
Presentational Component は props を描画するだけ
```

この構造により、UIとロジックを分離しつつ、ダッシュボード・分析・AIインサイトなどの複雑な画面を拡張しやすい形で実装できる。

参考にした記事

- https://zenn.dev/morinokami/books/learning-patterns-1/viewer/introduction