# UPDATE_PLAY_PLANミューテーション拡張仕様書

## 概要

`UPDATE_PLAY_PLAN`ミューテーションを拡張し、プラン本体とプラン詳細を同時に更新できるようにしました。

## 背景

従来は、プラン本体の更新と詳細の更新に別々のミューテーション（`UPDATE_PLAY_PLAN`と`UPDATE_PLAN_DETAILS`）を使用する必要がありました。これにより、フロントエンド側で2回のAPIコールが必要となり、UX/パフォーマンスの低下につながっていました。

## 実装内容

### バックエンド側の変更

1. `UPDATE_PLAY_PLAN`ミューテーションに`plan_details`引数を追加
   - `PlanDetailInput`クラスを追加して、プラン詳細の入力形式を定義
   - 既存の引数はそのまま維持

2. トランザクション処理の追加
   - プラン本体とプラン詳細の更新を一括で行うトランザクション処理を実装
   - エラー発生時は全ての変更をロールバック

3. 検証ロジックの追加
   - 時間の整合性チェック（開始時間と終了時間の関係）
   - ステップ間の時間的整合性チェック
   - 総予算の自動計算機能

4. 出力フィールドの拡張
   - `plan_details`フィールドを追加して、更新後のプラン詳細を返却

### フロントエンド側の変更

1. GraphQLクエリの更新
   - `UPDATE_PLAY_PLAN`ミューテーションに`planDetails`引数を追加
   - レスポンスに`planDetails`フィールドを追加

2. 新しいミューテーション`UPDATE_PLAY_PLAN_WITH_DETAILS`の追加
   - プラン本体とプラン詳細を同時に更新するための専用ミューテーション
   - 既存の`UPDATE_PLAY_PLAN`との互換性を維持

3. ユーティリティ関数の追加
   - `updatePlayPlanWithDetails`関数を追加して、プラン本体とプラン詳細を同時に更新するAPIを簡単に呼び出せるようにした

## 使用例

### バックエンド（GraphQL）

```graphql
mutation UpdatePlayPlanWithDetails($input: UpdatePlayPlanInput!) {
  updatePlayPlan(input: $input) {
    playPlan {
      id
      planName
      description
      status
      tripType
      totalBudget
      location
      startDatetime
      endDatetime
      imageUrl
      tags
      recommendedFors {
        id
        name
      }
    }
    planDetails {
      id
      planId
      stepNumber
      stepName
      stepDescription
      startDatetime
      endDatetime
      budget
      comment
      notes
      spot {
        id
        spotName
      }
    }
    errors
  }
}
```

### フロントエンド（TypeScript）

```typescript
// プラン本体とプラン詳細を同時に更新
const updatePlanWithDetails = async () => {
  try {
    const result = await updatePlayPlanWithDetails(
      "1", // プランID
      {
        planName: "更新されたプラン名",
        description: "更新された説明",
        status: "published",
        tripType: "day_trip",
        totalBudget: 10000,
        location: "福岡市",
        startDatetime: "2025-07-01T10:00:00Z",
        endDatetime: "2025-07-01T18:00:00Z",
        imageUrl: "https://example.com/image.jpg",
        tags: "夏,海,グルメ",
        recommendedForIds: ["1", "2", "3"]
      },
      [
        {
          id: "1",
          stepNumber: 1,
          stepName: "ステップ1",
          stepDescription: "ステップ1の説明",
          startDatetime: "2025-07-01T10:00:00Z",
          endDatetime: "2025-07-01T12:00:00Z",
          budget: 3000,
          spotId: 1,
          comment: "コメント",
          notes: "メモ"
        },
        {
          id: "2",
          stepNumber: 2,
          stepName: "ステップ2",
          stepDescription: "ステップ2の説明",
          startDatetime: "2025-07-01T13:00:00Z",
          endDatetime: "2025-07-01T15:00:00Z",
          budget: 5000,
          spotId: 2,
          comment: "コメント2",
          notes: "メモ2"
        }
      ]
    );

    console.log("更新結果:", result);
  } catch (error) {
    console.error("更新エラー:", error);
  }
};
```

## メリット

1. **UX/パフォーマンスの向上**
   - 1回のAPIコールでプラン本体とプラン詳細を同時に更新できる
   - フロントエンド側の実装が簡素化される

2. **データの整合性向上**
   - トランザクション処理により、プラン本体とプラン詳細の更新が原子的に行われる
   - エラー発生時は全ての変更がロールバックされる

3. **拡張性**
   - 既存の`UPDATE_PLAN_DETAILS`ミューテーションとの互換性を維持
   - 将来的な機能拡張にも対応しやすい設計

## 注意点

1. プラン詳細の更新時には、必ず各詳細の`id`を指定する必要がある
2. 時間の整合性チェックにより、不正な時間設定はエラーとなる
3. プラン詳細の予算を更新すると、プラン本体の総予算も自動的に更新される（ただし、総予算が明示的に指定された場合は優先される）

## 今後の課題

1. プラン詳細の新規作成・削除機能の追加
2. 移動詳細（travel_details）の同時更新機能の追加
3. バッチ処理による大量データの効率的な更新機能の検討
