module Types
  class EventType < Types::BaseObject
    field :id, ID, null: false
    field :title, String, null: false
    field :description, String, null: false
    field :location, String, null: false
    field :latitude, Float, null: true
    field :longitude, Float, null: true
    field :start_datetime, GraphQL::Types::ISO8601DateTime, null: false
    field :end_datetime, GraphQL::Types::ISO8601DateTime, null: false
    field :recurring_rule, String, null: true
    field :event_category, Types::EventCategoryType, null: false
    field :event_category_id, Integer, null: false
    field :price, String, null: true
    field :organizer, String, null: true
    field :contact_email, String, null: true
    field :contact_phone, String, null: true
    field :capacity, Integer, null: true
    field :status, Types::StatusEnumType, null: true
    field :is_online, Boolean, null: false
    field :source_url, String, null: true
    field :banner_image, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

  end
end
