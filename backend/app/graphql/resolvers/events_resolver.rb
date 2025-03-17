module Resolvers
  class EventsResolver < Resolvers::BaseResolver
    type [Types::EventType], null: false

    argument :category_id, ID, required: false
    argument :status, String, required: false
    argument :is_online, Boolean, required: false
    argument :upcoming, Boolean, required: false
    argument :limit, Integer, required: false

    def resolve(category_id: nil, status: nil, is_online: nil, upcoming: nil, limit: nil)
      events = Event.all

      # カテゴリでフィルタリング
      events = events.where(event_category_id: category_id) if category_id.present?

      # ステータスでフィルタリング
      events = events.where(status: status) if status.present?

      # オンラインイベントでフィルタリング
      events = events.where(is_online: is_online) unless is_online.nil?

      # 今後のイベントでフィルタリング
      events = events.upcoming if upcoming.present? && upcoming

      # 過去のイベントでフィルタリング
      events = events.past if upcoming.present? && !upcoming

      # 公開済みのイベントのみ表示（デフォルト）
      events = events.published unless status.present?

      # 件数制限
      events = events.limit(limit) if limit.present?

      events
    end
  end
end
