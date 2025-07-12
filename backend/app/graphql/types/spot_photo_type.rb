module Types
  class SpotPhotoType < Types::BaseObject
    field :id, ID, null: false
    field :photo_reference, String, null: false
    field :width, Integer, null: true
    field :height, Integer, null: true
    field :html_attributions, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
