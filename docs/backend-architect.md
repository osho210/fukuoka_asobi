## 1. 目的

本設計書は、DevOps × AI Agent Hackathon におけるバックエンドアプリケーションのアーキテクチャ方針を定義する。

本システムでは、GitHub / Slack / Backlog / Google Calendar などの外部サービスから開発活動データを取得し、プロジェクトの状態・リスク・チーム負荷を分析する。さらに、AI Agent を用いてプロジェクト改善のためのインサイトを生成する。

そのため、外部サービスやDB、AI APIなどの技術的詳細に業務ロジックが依存しない構造を目指す。

本アーキテクチャでは、クリーンアーキテクチャの考え方を採用し、以下を実現する。

- 業務ルールを外部技術から分離する
- 外部サービスの変更に強い構造にする
- UseCase単位で処理を整理する
- テストしやすい構造にする
- AI Agent / 外部API / DBの実装を差し替えやすくする

---

## 2. 採用アーキテクチャ

本システムでは、クリーンアーキテクチャをベースに以下の4層で構成する。

```
interfaces
  ↓
application
  ↓
domain

infrastructure
  ↓
application ports / domain
```

各層の責務は以下とする。

| 層 | 役割 |
| --- | --- |
| domain | 業務ルール、Entity、Value Object、Policy、Domain Error を定義する |
| application | UseCase、Port、UseCase用DTOを定義する |
| infrastructure | DB、Prisma、外部API、AI APIなど技術的詳細を実装する |
| interfaces | Controller、Request DTO、Response DTO、Presenterを定義する |
| shared | 複数層・複数機能で共通利用する補助機能を配置する |

---

## 3. 依存関係の方針

### 3.1 基本方針

依存は、外側から内側へ向ける。

```
interfaces → application → domain
infrastructure → application ports / domain
```

逆方向の依存は禁止する。

つまり、以下のような依存は避ける。

```
domain → application
domain → infrastructure
domain → interfaces
application → infrastructure
application → interfaces
```

---

### 3.2 依存の考え方

処理の流れと依存の向きは必ずしも一致しない。

例えば、プロジェクト作成処理の実行順は以下になる。

```
Controller
  ↓
UseCase
  ↓
Repository Port
  ↓
Prisma Repository
  ↓
DB
```

しかし、コード上の依存は以下のようにする。

```
Controller → UseCase
UseCase → Repository Port
Prisma Repository → Repository Port
```

UseCase は Prisma や DB を直接知らない。

UseCase は `ProjectRepositoryPort` のような抽象にのみ依存する。

---

## 4. ディレクトリ構成

本システムでは、以下のディレクトリ構成を採用する。

```
db/
  schema.prisma
  migrations/
  seed.ts
  factories/

src/
  application/
    use-cases/
      projects/
        create-project.usecase.ts
        get-project.usecase.ts
      activities/
        collect-activities.usecase.ts
      analytics/
        analyze-project-health.usecase.ts
      ai-agents/
        generate-project-insight.usecase.ts

    ports/
      repositories/
        project.repository.port.ts
        activity.repository.port.ts
        insight.repository.port.ts

      external/
        github-client.port.ts
        slack-client.port.ts
        backlog-client.port.ts
        calendar-client.port.ts
        ai-agent.port.ts

    dto/
      projects/
        create-project.input.ts
        project.output.ts
      analytics/
        project-health.output.ts

  domain/
    entities/
      project.entity.ts
      activity.entity.ts
      insight.entity.ts
      project-health-score.entity.ts

    value-objects/
      project-id.vo.ts
      activity-source.vo.ts
      activity-type.vo.ts
      score.vo.ts
      period.vo.ts

    services/
      activity-normalizer.service.ts

    policies/
      delay-risk.policy.ts
      workload-risk.policy.ts
      quality-risk.policy.ts

    errors/
      invalid-project-name.error.ts
      invalid-score.error.ts
      unsupported-activity-source.error.ts

  infrastructure/
    repositories/
      prisma-project.repository.ts
      prisma-activity.repository.ts
      prisma-insight.repository.ts

    external/
      github/
        github-api.client.ts
        github.mapper.ts
      slack/
        slack-api.client.ts
        slack.mapper.ts
      backlog/
        backlog-api.client.ts
        backlog.mapper.ts
      calendar/
        google-calendar.client.ts
        calendar.mapper.ts

    ai/
      gemini-agent.client.ts
      gemini.mapper.ts

    mappers/
      project.mapper.ts
      activity.mapper.ts
      insight.mapper.ts

    prisma/
      prisma.module.ts
      prisma.service.ts
      extensions/
        query-logging.extension.ts

    config/
      env.ts

  interfaces/
    controllers/
      projects.controller.ts
      activities.controller.ts
      analytics.controller.ts
      ai-agents.controller.ts

    dto/
      projects/
        create-project.request.dto.ts
        project.response.dto.ts
      analytics/
        project-health.response.dto.ts
      ai-agents/
        generate-insight.request.dto.ts
        insight.response.dto.ts

    presenters/
      project.presenter.ts
      activity.presenter.ts
      insight.presenter.ts

  shared/
    filters/
      http-exception.filter.ts
      domain-exception.filter.ts

    middleware/
      request-logging.middleware.ts

    types/
      nullable.type.ts
      result.type.ts

    utils/
      functions/
        assert-never.ts
        date.ts
      constants/
        error-code.ts

    test-helper/
      main.ts
```

---

# 5. 各ディレクトリの責務

## 5.1 db

```
db/
  schema.prisma
  migrations/
  seed.ts
  factories/
```

DB定義、マイグレーション、seed、テストデータ生成を管理する。

### 配置するもの

- Prisma schema
- migration file
- seed script
- factory

### 配置しないもの

- 業務ロジック
- UseCase
- Controller
- 外部API連携処理

---

## 5.2 application

```
src/application/
  use-cases/
  ports/
  dto/
```

Application層は、アプリケーション固有の処理手順を表す。

主な責務は以下。

- UseCaseの定義
- UseCaseが必要とするPortの定義
- UseCase専用のInput / Output DTOの定義
- EntityやPolicyを利用した処理の組み立て
- Repository Portを経由したデータ取得・保存
- 外部API Portを経由した外部連携

Application層は、Prisma、HTTP、GraphQL、Slack SDK、GitHub SDK、Gemini APIなどを直接知らない。

---

### 5.2.1 use-cases

```
application/use-cases/
```

UseCaseは、ユーザーやシステムが行いたい操作を表す。

例：

```
create-project.usecase.ts
get-project.usecase.ts
collect-activities.usecase.ts
analyze-project-health.usecase.ts
generate-project-insight.usecase.ts
```

UseCaseは「テーブル単位」ではなく「操作単位」で分ける。

良い例：

```
CreateProjectUseCase
CollectActivitiesUseCase
AnalyzeProjectHealthUseCase
GenerateProjectInsightUseCase
```

避けたい例：

```
ProjectService
ActivityService
CommonService
```

理由は、巨大なServiceに業務処理が集まりやすくなるため。

---

### 5.2.2 ports

```
application/ports/
  repositories/
  external/
```

Portは、UseCaseが外部に求める入出力の抽象を定義する。

Repositoryや外部APIのinterfaceをここに置く。

### repositories

```
application/ports/repositories/
```

DBへの保存・取得に関する抽象を定義する。

例：

```
exportinterfaceProjectRepositoryPort {
  findById(id:ProjectId):Promise<Project|null>;
  save(project:Project):Promise<void>;
}
```

UseCaseはこのPortに依存し、Prisma実装には依存しない。

### external

```
application/ports/external/
```

外部サービスとの連携に関する抽象を定義する。

例：

```
github-client.port.ts
slack-client.port.ts
backlog-client.port.ts
calendar-client.port.ts
ai-agent.port.ts
```

GitHub / Slack / Backlog / Calendar / AI Agent などの具体的なAPI仕様は、Application層に持ち込まない。

---

### 5.2.3 dto

```
application/dto/
```

UseCase専用のInput / Outputを定義する。

ControllerのRequest DTOとは分ける。

```
interfaces/dto = HTTP/API都合のDTO
application/dto = UseCase都合のDTO
```

例：

```
create-project.request.dto.ts
  ↓ Controllerで変換
create-project.input.ts
  ↓ UseCaseに渡す
project.output.ts
  ↓ Presenterで変換
project.response.dto.ts
```

---

## 5.3 domain

```
src/domain/
  entities/
  value-objects/
  services/
  policies/
  errors/
```

Domain層は、業務ルールを表現する中心の層である。

Domain層は、外部技術に依存しない。

### Domain層が知らないもの

- NestJS
- Prisma
- MySQL
- HTTP Request / Response
- GraphQL
- GitHub API
- Slack API
- Gemini API
- 環境変数
- Controller
- Repository実装

---

## 5.3.1 entities

```
domain/entities/
```

Entityは、業務上の概念を表すオブジェクトである。

例：

```
Project
Activity
Insight
ProjectHealthScore
```

Entityには、常に守るべき業務ルール、不変条件を持たせる。

例：

```
Project
- プロジェクト名は空にできない
- プロジェクトは識別子を持つ

Activity
- ActivitySource は対応済みの種類のみ
- ActivityType は対応済みの種類のみ

ProjectHealthScore
- Score は 0〜100 の範囲である
```

Entityに置くべきものは、特定の操作だけでなく、そのEntityが存在する限り常に守るべきルールである。

---

## 5.3.2 value-objects

```
domain/value-objects/
```

Value Objectは、業務上の意味を持つ値を表す。

ただの `string` / `number` / `Date` として扱わず、専用の型として表現する。

例：

```
ProjectId
ActivitySource
ActivityType
Score
Period
```

Value Objectの役割は以下。

- 値に業務上の意味を持たせる
- 値の制約を閉じ込める
- 不正な値をアプリ内部に入れない

例：

```
exportclassScore {
private constructor(privatereadonlyvalue:number) {}

static create(value:number):Score {
if (value<0||value>100) {
thrownewInvalidScoreError();
    }

returnnewScore(value);
  }

  getValue():number {
returnthis.value;
  }
}
```

---

## 5.3.3 services

```
domain/services/
```

Domain Serviceは、Entity単体には置きにくい業務処理を定義する。

例：

```
activity-normalizer.service.ts
```

今回のシステムでは、GitHub / Slack / Backlog / Calendar など異なる外部データを、共通のActivityとして扱う必要がある。

そのため、外部サービス由来の活動データをドメイン上のActivityに正規化する責務を持つServiceを配置する。

ただし、Domain Serviceに外部APIの呼び出しやDBアクセスは書かない。

---

## 5.3.4 policies

```
domain/policies/
```

Policyは、業務判断のルールを表す。

例：

```
delay-risk.policy.ts
workload-risk.policy.ts
quality-risk.policy.ts
```

Policyには、以下のような判定ロジックを置く。

- 遅延リスクが高いか
- 作業負荷が偏っているか
- 品質リスクが高いか
- スコアが危険水準か

Policyは、UseCaseから呼び出される。

UseCaseは処理の流れを担当し、Policyは業務判断を担当する。

---

## 5.3.5 errors

```
domain/errors/
```

Domain Errorは、業務ルール違反を表す。

例：

```
invalid-project-name.error.ts
invalid-score.error.ts
unsupported-activity-source.error.ts
```

Domain層では、HTTPステータスコードを扱わない。

悪い例：

```
thrownewHttpException('Invalid score',400);
```

良い例：

```
thrownewInvalidScoreError();
```

HTTPレスポンスへの変換は、`interfaces` または `shared/filters` で行う。

---

## 5.4 infrastructure

```
src/infrastructure/
  repositories/
  external/
  ai/
  mappers/
  prisma/
  config/
```

Infrastructure層は、外部技術の具体的な実装を担当する。

主な責務は以下。

- Prisma Repositoryの実装
- 外部API Clientの実装
- AI API Clientの実装
- DB RecordとDomain Entityの変換
- 環境変数の読み込み
- PrismaServiceの提供
- Query loggingなどの技術的処理

---

### 5.4.1 repositories

```
infrastructure/repositories/
```

Application層で定義したRepository Portの実装を配置する。

例：

```
prisma-project.repository.ts
prisma-activity.repository.ts
prisma-insight.repository.ts
```

例：

```
exportclassPrismaProjectRepositoryimplementsProjectRepositoryPort {
  constructor(privatereadonlyprisma:PrismaService) {}

async findById(id:ProjectId):Promise<Project|null> {
constrecord=awaitthis.prisma.project.findUnique({
      where: { id:id.getValue() },
    });

if (!record)returnnull;

returnProjectMapper.toDomain(record);
  }
}
```

Prisma Repositoryは、PrismaのModelをそのままUseCaseへ返してはいけない。

必ずMapperを通してDomain Entityへ変換する。

---

### 5.4.2 external

```
infrastructure/external/
```

GitHub / Slack / Backlog / Google Calendar などの外部API連携を実装する。

例：

```
github/
  github-api.client.ts
  github.mapper.ts
slack/
  slack-api.client.ts
  slack.mapper.ts
backlog/
  backlog-api.client.ts
  backlog.mapper.ts
calendar/
  google-calendar.client.ts
  calendar.mapper.ts
```

外部APIのレスポンス形式は、Application層やDomain層に漏らさない。

外部APIのレスポンスはMapperで変換する。

---

### 5.4.3 ai

```
infrastructure/ai/
```

AI Agent / Gemini / Vertex AI などの具体的な呼び出しを実装する。

例：

```
gemini-agent.client.ts
gemini.mapper.ts
```

Application層は `AiAgentPort` に依存する。

GeminiのSDKやAPI仕様には依存しない。

---

### 5.4.4 mappers

```
infrastructure/mappers/
```

DB Record、外部API Response、AI ResponseなどをDomain EntityやApplication Outputへ変換する。

例：

```
project.mapper.ts
activity.mapper.ts
insight.mapper.ts
```

Mapperの責務は、外側のデータ形式を内側のデータ形式に変換することである。

---

### 5.4.5 prisma

```
infrastructure/prisma/
```

アプリケーションからPrismaを利用するための実装を配置する。

```
prisma.module.ts
prisma.service.ts
extensions/
  query-logging.extension.ts
```

Prismaのschemaやmigrationは `db/` 配下で管理する。

`src/infrastructure/prisma` には、NestJSアプリケーション内でPrismaを利用するための実装のみを置く。

---

### 5.4.6 config

```
infrastructure/config/
```

環境変数や外部設定の読み込みを担当する。

例：

```
env.ts
```

Domain層やApplication層で直接 `process.env` を参照しない。

---

## 5.5 interfaces

```
src/interfaces/
  controllers/
  dto/
  presenters/
```

Interfaces層は、外部からの入力と外部への出力を担当する。

主な責務は以下。

- HTTP Controller
- Request DTO
- Response DTO
- Presenter
- 入力値の形式チェック
- UseCase Inputへの変換
- UseCase OutputからResponseへの変換

---

### 5.5.1 controllers

```
interfaces/controllers/
```

ControllerはHTTPリクエストを受け取り、UseCaseを呼び出す。

Controllerの責務は薄く保つ。

Controllerに業務ロジックを書かない。

Controllerの主な責務は以下。

- Request DTOを受け取る
- 認証情報やパラメータを取得する
- UseCase Inputに変換する
- UseCaseを実行する
- Presenterを通してResponse DTOに変換する

---

### 5.5.2 dto

```
interfaces/dto/
```

Request DTO / Response DTOを配置する。

Request DTOでは、外部入力としての形式チェックを行う。

例：

- 必須チェック
- 型チェック
- 文字数チェック
- 日付形式チェック

ただし、業務ルールはDTOに書きすぎない。

例：

```
DTOに置く
- projectName が文字列か
- projectName が必須か
- periodStart が日付形式か

Domain / Policyに置く
- Score が 0〜100 か
- ActivitySource が対応済みか
- 遅延リスクが高いか
```

---

### 5.5.3 presenters

```
interfaces/presenters/
```

Presenterは、UseCase OutputをAPIレスポンス用の形式に変換する。

UseCaseやDomainに表示都合を持ち込まないために配置する。

例：

```
project.presenter.ts
activity.presenter.ts
insight.presenter.ts
```

Presenterでは、以下のような変換を行う。

- 日付の表示形式変換
- statusを表示用labelへ変換
- Entity / Output を Response DTO へ変換
- APIレスポンス形式への整形

---

## 5.6 shared

```
src/shared/
  filters/
  middleware/
  types/
  utils/
  test-helper/
```

Shared層には、複数箇所で共通利用する処理を配置する。

ただし、Sharedに業務ロジックを置かない。

---

### 5.6.1 filters

```
shared/filters/
```

例外をHTTPレスポンスへ変換する。

例：

```
http-exception.filter.ts
domain-exception.filter.ts
```

Domain ErrorをHTTPステータスやエラーコードに変換する責務を持つ。

---

### 5.6.2 middleware

```
shared/middleware/
```

HTTPリクエストに対する共通前処理を配置する。

例：

```
request-logging.middleware.ts
```

Prismaのクエリ後処理やクエリログは、`infrastructure/prisma/extensions` に置く。

---

### 5.6.3 types

```
shared/types/
```

複数箇所で利用する共通型を配置する。

例：

```
nullable.type.ts
result.type.ts
```

ただし、ドメイン固有の型は `domain/value-objects` や `domain/entities` に置く。

---

### 5.6.4 utils

```
shared/utils/
```

汎用関数や定数を配置する。

例：

```
assert-never.ts
date.ts
error-code.ts
```

ただし、業務判断をutilsに置かない。

避けたい例：

```
utils/is-delay-risk.ts
utils/calculate-health-score.ts
```

このような業務判断は、`domain/policies` に置く。

---

# 6. DTO / Input / Output の設計方針

本システムでは、DTOを以下のように分ける。

```
interfaces/dto
  - Request DTO
  - Response DTO

application/dto
  - UseCase Input
  - UseCase Output
```

## 6.1 Request DTO

外部から渡ってきた値の形式チェックを行う。

例：

```
exportclassCreateProjectRequestDto {
@IsString()
@IsNotEmpty()
  name:string;
}
```

## 6.2 UseCase Input

UseCaseが必要とする入力を表す。

HTTPやGraphQLなどの外部都合に依存しない。

例：

```
exporttypeCreateProjectInput= {
  name:string;
};
```

## 6.3 UseCase Output

UseCaseの実行結果を表す。

Response DTOとは分離する。

例：

```
exporttypeProjectOutput= {
  id:string;
  name:string;
};
```

## 6.4 Response DTO

APIレスポンスとして返す形式を表す。

例：

```
exporttypeProjectResponseDto= {
  id:string;
  name:string;
};
```

## 7. Entity / Value Object / Policy の設計方針

## 7.1 Entity

Entityは、業務上の概念を表す。

Entityには、常に守るべき不変条件を持たせる。

例：

```
Project
- IDを持つ
- ProjectNameを持つ

ProjectHealthScore
- Scoreを持つ
- RiskLevelを持つ
```

---

## 7.2 Value Object

Value Objectは、業務上の意味を持つ値を表す。

例：

```
ProjectId
ActivitySource
ActivityType
Score
Period
```

Value Objectに置くべきもの。

```
- 値そのものの制約
- 値の正規化
- 値同士の比較
```

---

## 7.3 Policy

Policyは、業務判断を表す。

例：

```
delay-risk.policy.ts
workload-risk.policy.ts
quality-risk.policy.ts
```

Policyに置くべきもの。

```
- 遅延リスク判定
- 負荷偏り判定
- 品質リスク判定
- スコアリング判断
```

---

# 8. Repository / Port の設計方針

Repository Portは `application/ports/repositories` に配置する。

Repository実装は `infrastructure/repositories` に配置する。

## 8.1 Repository Port

UseCaseが必要とするデータ取得・保存の約束を定義する。

```
exportinterfaceProjectRepositoryPort {
  findById(id:ProjectId):Promise<Project|null>;
  save(project:Project):Promise<void>;
}
```

## 8.2 Repository Implementation

Prismaを用いた具体実装を行う。

```
exportclassPrismaProjectRepositoryimplementsProjectRepositoryPort {
async findById(id:ProjectId):Promise<Project|null> {
// Prismaで取得
// MapperでDomain Entityへ変換
  }
}
```

## 8.3 設計ルール

Repository PortにPrismaの型を含めない。

避けたい例：

```
findMany(where: Prisma.ProjectWhereInput):Promise<Project[]>;
```

良い例：

```
findById(id: ProjectId):Promise<Project|null>;
findByPeriod(period: Period):Promise<Project[]>;
```

---

# 9. 外部API連携の設計方針

GitHub / Slack / Backlog / Google Calendar などの外部APIは、Application層に直接持ち込まない。

Application層ではPortを定義する。

```
application/ports/external/
  github-client.port.ts
  slack-client.port.ts
  backlog-client.port.ts
  calendar-client.port.ts
```

Infrastructure層で具体実装を行う。

```
infrastructure/external/github/github-api.client.ts
infrastructure/external/slack/slack-api.client.ts
```

これにより、将来的に以下のような変更が発生してもApplication層への影響を抑えられる。

```
GitHub → GitLab
Slack → Teams
Backlog → Jira
Gemini → OpenAI / Claude
```

---

# 10. AI Agent の設計方針

AI Agentは外部サービスとして扱う。

Application層では `AiAgentPort` に依存する。

```
application/ports/external/ai-agent.port.ts
```

Gemini / Vertex AI の具体実装はInfrastructure層に置く。

```
infrastructure/ai/gemini-agent.client.ts
```

UseCaseは、AI APIの具体的な呼び出し方式を知らない。

例：

```
GenerateProjectInsightUseCase
  ↓
AiAgentPort
  ↓
GeminiAgentClient
```

AIへのプロンプト生成やレスポンス変換は、必要に応じて以下へ配置する。

```
infrastructure/ai/gemini.mapper.ts
application/use-cases/ai-agents/
```

業務判断としてのインサイト分類や重要度判定は、Domain Policyへ寄せる。

---

# 11. エラー設計方針

## 11.1 Domain Error

業務ルール違反はDomain Errorとして定義する。

例：

```
InvalidProjectNameError
InvalidScoreError
UnsupportedActivitySourceError
```

Domain ErrorはHTTPを知らない。

## 11.2 Exception Filter

Domain ErrorをHTTPレスポンスへ変換する処理はFilterで行う。

```
shared/filters/domain-exception.filter.ts
```

例：

```
InvalidScoreError
  ↓
HTTP 400 Bad Request
  ↓
{
  "code": "INVALID_SCORE",
  "message": "スコアは0〜100の範囲で指定してください"
}
```

---

# 12. 処理フロー例

## 12.1 プロジェクト作成

```
interfaces/controllers/projects.controller.ts
  ↓
interfaces/dto/projects/create-project.request.dto.ts
  ↓
application/dto/projects/create-project.input.ts
  ↓
application/use-cases/projects/create-project.usecase.ts
  ↓
domain/entities/project.entity.ts
  ↓
application/ports/repositories/project.repository.port.ts
  ↓
infrastructure/repositories/prisma-project.repository.ts
  ↓
infrastructure/mappers/project.mapper.ts
  ↓
db
```

---

## 12.2 アクティビティ収集

```
interfaces/controllers/activities.controller.ts
  ↓
application/use-cases/activities/collect-activities.usecase.ts
  ↓
application/ports/external/github-client.port.ts
  ↓
infrastructure/external/github/github-api.client.ts
  ↓
infrastructure/external/github/github.mapper.ts
  ↓
domain/services/activity-normalizer.service.ts
  ↓
domain/entities/activity.entity.ts
  ↓
application/ports/repositories/activity.repository.port.ts
  ↓
infrastructure/repositories/prisma-activity.repository.ts
```

---

## 12.3 プロジェクト健全性分析

```
interfaces/controllers/analytics.controller.ts
  ↓
application/use-cases/analytics/analyze-project-health.usecase.ts
  ↓
application/ports/repositories/activity.repository.port.ts
  ↓
domain/policies/delay-risk.policy.ts
  ↓
domain/policies/workload-risk.policy.ts
  ↓
domain/policies/quality-risk.policy.ts
  ↓
domain/entities/project-health-score.entity.ts
  ↓
application/dto/analytics/project-health.output.ts
  ↓
interfaces/presenters/activity.presenter.ts
  ↓
interfaces/dto/analytics/project-health.response.dto.ts
```

---

## 12.4 AIインサイト生成

```
interfaces/controllers/ai-agents.controller.ts
  ↓
interfaces/dto/ai-agents/generate-insight.request.dto.ts
  ↓
application/use-cases/ai-agents/generate-project-insight.usecase.ts
  ↓
application/ports/external/ai-agent.port.ts
  ↓
infrastructure/ai/gemini-agent.client.ts
  ↓
infrastructure/ai/gemini.mapper.ts
  ↓
domain/entities/insight.entity.ts
  ↓
application/ports/repositories/insight.repository.port.ts
  ↓
infrastructure/repositories/prisma-insight.repository.ts
```

---

# 13. 実装ルール

## 13.1 Controllerに業務ロジックを書かない

Controllerは入力を受け取り、UseCaseを呼び出すだけにする。

## 13.2 UseCaseにPrismaを書かない

UseCaseはRepository Portに依存する。

## 13.3 Domainに外部技術を入れない

DomainはPrisma、NestJS、HTTP、外部APIを知らない。

## 13.4 Mapperで外側の型を内側の型へ変換する

Prisma Modelや外部API ResponseをそのままDomainに渡さない。

## 13.5 sharedに業務ロジックを置かない

業務判断はDomainに置く。

## 13.6 DTOとUseCase Inputを分ける

Request DTOをUseCaseへ直接渡さない。

---

# 14. 本アーキテクチャのメリット

## 14.1 外部サービスの変更に強い

GitHub / Slack / Backlog / Calendar / AI API の具体実装はInfrastructure層に閉じ込めるため、外部サービス変更時の影響を抑えられる。

## 14.2 テストしやすい

UseCaseはPortに依存するため、DBや外部APIを使わずにテストできる。

```
UseCase + FakeRepository + FakeAiAgent
```

でテスト可能。

## 14.3 業務ルールが見えやすい

Entity、Value Object、Policyに業務ルールを集約するため、プロジェクト分析の判断基準がコード上で見えやすくなる。

## 14.4 AI Agentの差し替えがしやすい

UseCaseは `AiAgentPort` に依存するため、Geminiから別のAIモデルへ変更する場合でも、Application層への影響を抑えられる。

## 14.5 Hackathon後も拡張しやすい

初期はGitHub / Slack / Backlog / Calendar を対象にするが、将来的に Jira / GitLab / Teams / Notion などを追加しやすい。

---

# 15. 注意点

## 15.1 過剰設計に注意する

Hackathonでは実装スピードも重要である。

そのため、最初からすべてを厳密に作り込みすぎない。

初期実装では以下を優先する。

```
- UseCase
- Port
- Infrastructure実装
- Entity
- 最低限のValue Object
- 最低限のPolicy
```

Presenterや細かいOutput DTOは、必要に応じて追加する。

---

## 15.2 Value Objectを作りすぎない

すべての値をValue Objectにすると実装コストが高くなる。

初期は以下に絞る。

```
ProjectId
ActivitySource
ActivityType
Score
Period
```

---

## 15.3 sharedを便利箱にしない

`shared/utils` に業務ロジックを入れない。

判断基準は以下。

```
どの業務でも使う純粋な補助関数
→ shared/utils

プロジェクト分析やリスク判定に関係する判断
→ domain/policies
```

---

# 16. まとめ

本アーキテクチャでは、クリーンアーキテクチャを採用し、以下の方針で設計する。

```
domain
- 業務ルールを表現する

application
- UseCaseとPortを定義する

infrastructure
- DB、外部API、AI APIの具体実装を担当する

interfaces
- Controller、DTO、Presenterを担当する

shared
- 共通処理を担当する
```

最も重要な設計方針は以下である。

```
UseCaseはDBや外部APIの具体実装を知らない
Domainは技術的詳細を知らない
InfrastructureがApplication Portを実装する
Interfacesは外部入力をApplicationに渡す
```

この構造により、外部サービスやAI APIの変更に強く、テストしやすく、業務ルールを中心に保ったバックエンド設計を実現する。

- メモ

    採用するアーキテクト・・・クリーンアーキテクチャ

    依存性は外から中に行く必要がある

    DB → リポジトリ → サービス → useCase → Controller

    アプリケーションの本質的な価値を提供するオブジェクトは軽微な変更を受けてはいけない。依存される側に設計する必要がある。

    まとめると

    クリーンアーキテクチャは、ビジネスルールを中心に置き、DBやフレームワークなどの技術的詳細を外側に追い出すことで、変更に強くテストしやすい構造を作る設計方針。

    Entity・・・業務ルール寄りの入力制御に利用する
    (例) 過去日時には予約できない

    dto・・・基本的に入力として成立しているか

    serviceにも複数種類がある

    ### UseCase

    これはアプリケーションの操作を表します。

    ```
    CreateReservationUseCase
    PublishArticleUseCase
    CreateConsentRequestUseCase
    UpdateUserProfileUseCase
    ```

    ### Domain Service

    これは「Entity単体に置きにくい業務判断」を表します。

    ```
    ReservationAvailabilityService
    InventoryAllocationService
    ArticlePublicationPolicy
    ConsentUsagePolicy
    ```

    ```jsx
    - db/                        テーブルスキーマとマイグレーションファイルを管理
      - migrations/              マイグレーションファイル
    - src/
        - application/           クリーンアーキテクチャで言うApplication Business Rules  ソフトウェアが何ができるのかを表現
          - use-cases/           インターフェースで定義したメソッドから呼ばれ、何を実現したいのかのユースケースを表現
        - domain/                クリーンアーキテクチャで言うEnterprise Business Rules  ビジネスロジックを表現するための機能が集まる
          - repositories/        データベースアクセスに関する処理を行い、use-cases・servicesから呼ばれる
          - services/            ドメインサービス。ユースケースに乗せるべきではないビジネスロジック部分を担保
        - infrastructure/        クリーンアーキテクチャで言う Frameworks & Drivers。ビジネスロジック以外のもの
          - decorators/          デコレータ
          - metadata/　　　　        　 権限などに関するデコレータを定義
          - guards/              ログイン関係のガード
          - ioc/                 各種module
          - plugins/             ログ出力などのプラグイン
          - strategies/　　　　　　guardsから呼び出されるストラテジー
          - webhook/             slack webhookに関する処理
        - interfaces/            クリーンアーキテクチャで言う Interface Adapters。入力、永続化、表示を担当するオブジェクトが所属
          - batches/             バッチ処理の入り口を定義
          - controllers/         frontendから呼び出されるコントローラーを定義
          - dto/                 input、output
        - types/                 複数箇所で呼び出す型を定義
      - shared                 モジュールで共通で使用するもの
        - filters/             エラーのフィルタリング処理
        - middleware/          クエリ発行後に呼ばれるミドルウェア
        - prisma/              Prismaにより出力されたファイルやFactory・seed関連
          - factories/         テストやseedで事前データを作成する際に使用するfactory
          - migrations/        マイグレーションファイル
        - types/                 複数箇所で呼び出す型を定義
        - utils/                 いろいろな箇所で呼ばれる便利なもの
          - functions/           メソッドを定義
          - statics/             定数を定義
          - test-helper/         テストで呼ばれるヘルパーを定義
      - main.ts                エントリーポイント
    ```