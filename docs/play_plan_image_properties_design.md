# PlayPlan画像プロパティ機能設計書

## 1. 要件定義

### 1.1 目的（ゴール）
1つのプランに紐づく画像について、表示可否・表示順・コメントを投稿者（管理UI）で設定できるようにする。

公開ページでは、設定に従って最大N枚（現状3枚）を並び順で表示し、任意でコメントも併記する。

既存の Active Storage 運用は維持し、プラン×添付ごとにメタ情報を持てるようにする。

### 1.2 前提（As-Is）
- PlayPlan は has_many_attached :images（Active Storage）
- GraphQL の imageUrls は添付のURL配列（先頭3件を表示）
- 並び・表示可否・コメントの概念はない（＝クライアント依存／先頭勝ち）

### 1.3 あるべき姿（To-Be）
**管理UI：**
- 画像一覧に対して「表示する/しない」のトグル、ドラッグ&ドロップで並び替え、コメント入力ができる
- 選択上限（例：3枚）を超えないバリデーション

**API/サーバ：**
- 画像（添付）ごとのメタ情報（表示可否・順序・コメント）を永続化
- GraphQL 経由で取得・更新できる

**公開UI：**
- isSelected=true を position 昇順で最大N枚表示。必要なら figcaption 的にコメントを表示

## 2. データベース設計

### 2.1 新規テーブル: play_plan_image_properties

| Column Name | Data Type | Description | Constraints |
|-------------|-----------|-------------|-------------|
| id | INT | Primary Key | Auto Increment |
| play_plan_id | INT | Foreign Key to play_plans.id | NOT NULL |
| attachment_id | INT | Foreign Key to active_storage_attachments.id | NOT NULL |
| is_selected | BOOLEAN | 表示対象かどうか | DEFAULT false, INDEX |
| position | INTEGER | 表示順 | DEFAULT 0, INDEX |
| comment | TEXT | コメント | NULL許可 |
| created_at | DATETIME | 作成日時 | |
| updated_at | DATETIME | 更新日時 | |

**インデックス：**
- `play_plan_id, attachment_id` の複合ユニークインデックス
- `is_selected` にインデックス
- `position` にインデックス

### 2.2 モデル関連付け

**PlayPlan モデル:**
```ruby
has_many :image_properties, -> { order(position: :asc) },
         class_name: 'PlayPlanImageProperty', dependent: :destroy
has_many_attached :images # 既存

# 定数
MAX_SELECTED_IMAGES = 3
```

**PlayPlanImageProperty モデル:**
```ruby
belongs_to :play_plan
belongs_to :attachment, class_name: 'ActiveStorage::Attachment'
validates :attachment_id, uniqueness: { scope: :play_plan_id }
```

**ActiveStorage::Attachment モデル（拡張）:**
```ruby
has_one :play_plan_image_property, dependent: :destroy
```

## 3. API設計（GraphQL）

### 3.1 新規Type定義

**ImagePropertyType:**
```ruby
module Types
  class ImagePropertyType < Types::BaseObject
    description "画像とそのプロパティ"

    field :attachment_id, ID, null: false, description: "ActiveStorage::AttachmentのID"
    field :url, String, null: false, description: "画像のURL"
    field :is_selected, Boolean, null: false, description: "表示対象かどうか"
    field :position, Integer, null: false, description: "表示順"
    field :comment, String, null: true, description: "コメント"
  end
end
```

**ImagePropertyInputType:**
```ruby
module Mutations
  module Inputs
    class ImagePropertyInputType < Types::BaseInputObject
      description "画像プロパティの入力"

      argument :attachment_id, ID, required: true
      argument :is_selected, Boolean, required: true
      argument :position, Integer, required: true
      argument :comment, String, required: false
    end
  end
end
```

### 3.2 PlayPlanType の変更

**変更前:**
```ruby
field :image_urls, [Types::ImageType], null: true, description: "プランに紐づく画像のURLリスト"
```

**変更後:**
```ruby
field :image_properties, [Types::ImagePropertyType], null: true, description: "プランに紐づく画像とそのプロパティ"
```

**リゾルバ実装:**
```ruby
def image_properties
  # N+1問題を回避するため事前読み込み
  properties = object.image_properties.index_by(&:attachment_id)
  images = object.images.order('active_storage_attachments.created_at ASC')

  images.map.with_index do |image, index|
    prop = properties[image.id]
    {
      attachment_id: image.id,
      url: Rails.application.routes.url_helpers.url_for(image),
      is_selected: prop&.is_selected || false,
      position: prop&.position || index,
      comment: prop&.comment
    }
  end.sort_by { |p| p[:position] }
end
```

### 3.3 Mutation の変更

**CreateOrUpdatePlayPlanWithDetails に追加:**
```ruby
argument :image_properties, [Mutations::Inputs::ImagePropertyInputType],
         required: false, description: "画像プロパティリスト"
```

## 4. ビジネスルール/バリデーション

1. **選択上限：** 既定3枚（PlayPlan::MAX_SELECTED_IMAGES で定数化）
2. **position：** 0以上の整数、重複は許容（並びは安定ソート）
3. **添付削除時：** 対応するプロパティも削除（FK + dependent: :destroy）
4. **互換表示：** プロパティ未設定なら is_selected=false/position=0/comment=nil と見做し、旧仕様（先頭3枚）でフォールバック可能
5. **権限：** 画像プロパティ更新は投稿者本人＋管理者のみ許可
6. **所有権チェック：** 他人のプラン／添付の attachmentId を指定しても更新できないよう検証

## 5. 画面要件

### 5.1 管理UI（投稿者）
- **一覧表示：** サムネイル／表示トグル／並び替えハンドル／コメント入力
- **並び替え：** ドラッグ&ドロップで position を更新
- **上限チェック：** 選択数が上限超なら保存を禁止（エラートースト）
- **保存：** 画像プロパティ配列を mutation に送信（差分ではなく全体送信で整合性担保）

### 5.2 公開UI（閲覧者）
- isSelected=true を position 昇順で最大N枚表示
- コメントがあれば画像下に小さく表示（任意）
- 画像が0枚ならコンポーネント非表示

## 6. データフロー

### 6.1 管理UIでの編集フロー
1. 管理UIで編集 → 画像ごとの isSelected/position/comment をローカル状態に保持
2. 保存ボタン → GraphQL 変異に配列で送信
3. サーバ：play_plan_image_properties を attachment 単位で upsert。選択上限を検証
4. クライアント：更新後に詳細を再フェッチ（キャッシュ更新）→ 公開UIは新設定で描画

### 6.2 サービスクラスでの処理フロー
```ruby
# PlayPlanWithDetailsService内
if @params[:image_properties].present?
  # 上限チェック
  selected_count = @params[:image_properties].count { |p| p[:is_selected] }
  if selected_count > PlayPlan::MAX_SELECTED_IMAGES
    @play_plan.errors.add(:base, "選択できる画像は#{PlayPlan::MAX_SELECTED_IMAGES}枚までです。")
    raise ActiveRecord::Rollback
  end

  # プロパティの一括更新
  @params[:image_properties].each do |prop_input|
    attachment = @play_plan.images.find_by(id: prop_input[:attachment_id])
    next unless attachment

    property = PlayPlanImageProperty.find_or_initialize_by(
      play_plan_id: @play_plan.id,
      attachment_id: attachment.id
    )
    property.update!(
      is_selected: prop_input[:is_selected],
      position: prop_input[:position],
      comment: prop_input[:comment]
    )
  end
end
```

## 7. エラーハンドリング/例外

1. **画像が1枚も選択されていない：** 許容（カード非表示）
2. **存在しない attachmentId：** 422 で弾く（サービス内で find_by を使用し、存在しない場合はスキップ）
3. **選択上限超過：** バリデーションエラーで 400/422
4. **競合（同時編集）：** 後勝ち（必要に応じて楽観的ロック導入検討）

## 8. 段階的導入計画

### Phase 1: バックエンド基盤
1. DBマイグレーション実行
2. モデル関連付け追加
3. GraphQL Type/Input 定義

### Phase 2: API実装
1. PlayPlanType の image_properties フィールド追加
2. CreateOrUpdatePlayPlanWithDetails の引数追加
3. PlayPlanWithDetailsService の修正

### Phase 3: フロントエンド実装
1. 管理UI の画像プロパティ編集機能
2. 公開UI の表示ロジック修正

### Phase 4: 旧API廃止
1. image_urls フィールドの廃止（全UI移行後）

## 9. パフォーマンス考慮

1. **N+1問題回避：** image_properties を includes で事前読み込み
2. **インデックス活用：** position, is_selected にインデックス設定
3. **URL生成最適化：** 現行どおり（MinIO→公開URL置換）を維持

## 10. セキュリティ

1. **権限チェック：** 投稿者本人＋管理者のみ更新可能
2. **所有権検証：** play_plan_id と attachment_id の関連性を確認
3. **入力値検証：** position は非負整数、comment は適切な長さ制限

## 11. テスト方針

### 11.1 モデルテスト
- PlayPlanImageProperty のバリデーション
- 関連付けの動作確認
- dependent: :destroy の動作確認

### 11.2 GraphQLテスト
- ImagePropertyType のフィールド返却
- CreateOrUpdatePlayPlanWithDetails の引数処理
- エラーケースの処理

### 11.3 サービステスト
- 画像プロパティ更新ロジック
- 上限チェック
- 権限チェック

### 11.4 統合テスト
- 管理UI → API → DB の一連の流れ
- 公開UI での表示確認
