module Resolvers
  class SearchPlansResolver < Resolvers::BaseResolver
    type [Types::PlayPlanType], null: false
    description "検索条件に基づいてプランを検索"

    argument :areas, [ID], required: false, description: "エリアID"
    argument :date, String, required: false, description: "日付（YYYY-MM-DD形式）"
    argument :gender_info, Types::GenderInputType, required: false, description: "性別と人数"
    argument :budget, Types::BudgetInputType, required: false, description: "予算範囲"
    argument :custom_options, Types::CustomOptionsInputType, required: false, description: "カスタムオプション"

    def resolve(areas: nil, date: nil, gender_info: nil, budget: nil, custom_options: nil)
      # 基本クエリ
      query = PlayPlan.where(status: 'public')

      # エリアによるフィルタリング
      if areas.present?
        area_ids = areas.map(&:to_i)
        query = query.joins(plan_details: :spot)
                     .where(spots: { area_id: area_ids })
                     .distinct
      end

      # 日付によるフィルタリング
      if date.present?
        date_obj = Date.parse(date)
        query = query.where("DATE(start_datetime) <= ? AND DATE(end_datetime) >= ?", date_obj, date_obj)
      end

      # 予算によるフィルタリング
      if budget.present?
        query = query.where("total_budget >= ? AND total_budget <= ?", budget.min, budget.max)
      end

      # カスタムオプションによるフィルタリング
      if custom_options.present?
        # 移動手段によるフィルタリング
        if custom_options.transportation_method.present?
          query = query.joins(:travel_details)
                       .where(travel_details: { travel_method: custom_options.transportation_method })
                       .distinct
        end

        # テーマによるフィルタリング
        if custom_options.theme.present?
          query = query.where(theme: custom_options.theme)
        end

        # 雨天対応によるフィルタリング
        if custom_options.rainy_day_option.present? && custom_options.rainy_day_option
          query = query.joins(plan_details: :spot)
                       .where(spots: { is_rainy_ok: true })
                       .distinct
        end

        # イベント含むによるフィルタリング
        if custom_options.include_events.present? && custom_options.include_events
          query = query.joins("INNER JOIN events ON DATE(events.start_datetime) <= DATE(play_plans.end_datetime) AND DATE(events.end_datetime) >= DATE(play_plans.start_datetime)")
                       .distinct
        end

        # スポット数によるフィルタリング
        if custom_options.spot_count.present?
          query = query.joins(:plan_details)
                       .group("play_plans.id")
                       .having("COUNT(plan_details.id) = ?", custom_options.spot_count)
        end

        # カテゴリーによるフィルタリング
        if custom_options.categories.present?
          query = query.joins(plan_details: { spot: :categories })
                       .where(categories: { name: custom_options.categories })
                       .distinct
        end
      end

      # 結果を返す
      query.limit(20)
    end
  end
end
