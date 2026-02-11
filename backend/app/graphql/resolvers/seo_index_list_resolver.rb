module Resolvers
  class SeoIndexListResolver < Resolvers::BaseResolver
    type [Types::SeoIndexRowType], null: false

    argument :type, String, required: false, description: "フィルタ対象のレコード種別 (spot | plan)"
    argument :is_indexable, Boolean, required: false, description: "is_indexableでフィルタ"
    argument :status, String, required: false, description: "ステータスでフィルタ"

    def resolve(type: nil, is_indexable: nil, status: nil)
      records = []

      # spots を取得
      if type.nil? || type == "spot"
        spots = Spot.all
        spots = spots.where(is_indexable: is_indexable) unless is_indexable.nil?
        # spots はステータスの代わりに is_public を使う
        spots = spots.where(is_public: map_status_to_public(status)) unless status.nil?
        
        records += spots.order(updated_at: :desc).map do |spot|
          {
            id: spot.id,
            title: spot.spot_name,
            type: "spot",
            status: spot.is_public ? "published" : "draft",
            is_indexable: spot.is_indexable,
            url: "#{frontend_base_url}/spots/#{spot.id}",
            updated_at: spot.updated_at
          }
        end
      end

      # play_plans を取得
      if type.nil? || type == "plan"
        plans = PlayPlan.all
        plans = plans.where(is_indexable: is_indexable) unless is_indexable.nil?
        plans = plans.where(status: map_status_to_enum(status)) unless status.nil?
        
        records += plans.order(updated_at: :desc).map do |plan|
          {
            id: plan.id,
            title: plan.plan_name,
            type: "plan",
            status: plan.status,
            is_indexable: plan.is_indexable,
            url: "#{frontend_base_url}/play_plans/#{plan.id}",
            updated_at: plan.updated_at
          }
        end
      end

      # updated_at でソート
      records.sort_by { |r| r[:updated_at] }.reverse
    end

    private

    def frontend_base_url
      # 環境変数から取得、デフォルトはローカル開発用
      ENV.fetch("FRONTEND_URL", "http://localhost:8200")
    end

    def map_status_to_public(status)
      case status
      when "published"
        true
      when "draft"
        false
      else
        nil
      end
    end

    def map_status_to_enum(status)
      case status
      when "published"
        :published
      when "draft"
        :draft
      when "archived"
        :archived
      else
        nil
      end
    end
  end
end
