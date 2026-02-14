module Types
  class PlayPlanType < Types::BaseObject
    field :id, Integer, null: false

    field :user_id, Integer, null: true
    field :user, Types::UserType, null: true
    def user
      object.user
    end
    field :plan_name, String, null: false
    field :catch_copy, String, null: false
    field :subtitle, String, null: false
    field :lead_text, String, null: false
    field :plan_id, Integer, null: false
    field :start_time, String, null: false
    field :end_time, String, null: false
    field :description, String, null: false
    field :departure, String, null: false
    field :departure_time, String, null: false
    field :travel_method_to_first_spot, String, null: false
    field :travel_time_to_first_spot, Integer, null: false
    field :status, Types::StatusEnumType, null: false
    field :favorite_count, Integer, null: false
    field :rating, Float, null: false
    field :review_count, Integer, null: false
    field :image_url, String, null: true
    field :image_urls, [Types::ImageType], null: false, description: "プランに紐づく画像のURLリスト"
    field :image_properties, [Types::ImagePropertyType], null: false, description: "プランに紐づく画像とそのプロパティ"
    field :tags, String, null: false
    field :location, String, null: false
    field :published_at, GraphQL::Types::ISO8601DateTime, null: true
    field :trip_type, Types::TripTypeEnum, null: false
    field :total_budget, Float, null: false
    field :planner_title, String, null: false
    field :planner_description, String, null: false
    field :is_recommended, Boolean, null: false, description: "編集部おすすめフラグ"
    field :is_public, Boolean, null: false, description: "公開フラグ"
    field :is_indexable, Boolean, null: false, description: "検索エンジンにインデックスさせるか"
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # 関連するプラン詳細を取得
    field :plan_details, [Types::PlanDetailType], null: true
    def plan_details
      object.plan_details.ordered
    end

    # おすすめ対象を取得
    field :recommended_fors, [Types::RecommendedForType], null: false

    # おすすめ対象の文字列表現を取得
    field :recommend_users, [String], null: true

    # 現在のユーザーがお気に入り登録しているかどうか
    field :is_favorite, Boolean, null: false
    def is_favorite
      current_user = context[:current_user]
      return false unless current_user

      current_user.favorites.exists?(play_plan_id: object.id)
    end

    # お気に入り数を取得
    def favorite_count
      object.favorites.count
    end

    # 内部的に日付を保持してしまうため、表示用にフォーマットする
    def start_time
      object.start_time&.strftime("%H:%M")
    end

    # 内部的に日付を保持してしまうため、表示用にフォーマットする
    def end_time
      object.end_time&.strftime("%H:%M")
    end

    # 内部的に日付を保持してしまうため、表示用にフォーマットする
    def departure_time
      object.departure_time&.strftime("%H:%M")
    end

    # 画像URLリストを取得
    def image_urls
      object.images.map do |image|
        {
          id: image.id,
          url: convert_storage_url(image.url)
        }
      end
    end

    # 画像プロパティリストを取得
    def image_properties
      # N+1問題を回避するため事前読み込み
      properties = object.image_properties.index_by(&:attachment_id)
      images = object.images.order('active_storage_attachments.created_at ASC')

      images.map.with_index do |image, index|
        prop = properties[image.id]
        {
          attachment_id: image.id,
          url: convert_storage_url(image.url),
          is_selected: prop&.is_selected || false,
          position: prop&.position || index,
          comment: prop&.comment
        }
      end
      # 画面上に表示する画像のみを返却する
      .select { |p| p[:is_selected] }
      .sort_by { |p| p[:position] }
    end
  end
end
