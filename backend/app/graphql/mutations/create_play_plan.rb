module Mutations
  class CreatePlayPlan < BaseMutation
    # 入力フィールド
    argument :plan_name, String, required: true
    argument :description, String, required: false
    argument :status, Types::StatusEnumType, required: true
    argument :trip_type, Types::TripTypeEnum, required: true
    argument :total_budget, Float, required: false
    argument :location, String, required: false
    argument :start_datetime, GraphQL::Types::ISO8601DateTime, required: false
    argument :end_datetime, GraphQL::Types::ISO8601DateTime, required: false
    argument :image_url, String, required: false
    argument :images, [String], required: false
    argument :tags, String, required: false
    argument :recommend_users, [ID], required: false

    # 出力フィールド
    field :play_plan, Types::PlayPlanType, null: true
    field :errors, [String], null: false

    def resolve(
      plan_name:,
      description: nil,
      status:,
      trip_type:,
      total_budget: nil,
      location: nil,
      start_datetime: nil,
      end_datetime: nil,
      image_url: nil,
      images: nil,
      tags: nil,
      recommend_users: []
    )
      # 現在のユーザーを取得
      user = context[:current_user]

      # プランの作成
      play_plan = PlayPlan.new(
        user_id: user&.id,
        plan_name: plan_name,
        description: description,
        status: status,
        trip_type: trip_type,
        total_budget: total_budget,
        location: location,
        start_datetime: start_datetime,
        end_datetime: end_datetime,
        image_url: image_url,
        tags: tags
      )

      # おすすめ対象の関連付け
      if recommend_users.present?
        recommend_users.each do |id|
          recommended_for = RecommendedFor.find_by(id: id)
          play_plan.recommended_fors << recommended_for if recommended_for
        end
      end

      if play_plan.save
        # 画像の処理
        if images.present?
          images.each do |base64_image|
            # Base64画像をデコードしてActiveStorageに保存
            decoded_image = Base64.decode64(base64_image.split(',').last)
            play_plan.images.attach(
              io: StringIO.new(decoded_image),
              filename: "play_plan_#{play_plan.id}_#{Time.current.to_i}.jpg",
              content_type: 'image/jpeg'
            )
          end
        end

        {
          play_plan: play_plan,
          errors: []
        }
      else
        {
          play_plan: nil,
          errors: play_plan.errors.full_messages
        }
      end
    end
  end
end
