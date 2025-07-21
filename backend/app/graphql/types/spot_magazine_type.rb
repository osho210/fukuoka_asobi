# frozen_string_literal: true

module Types
  class SpotMagazineType < Types::BaseObject
    field :id, ID, null: true
    field :spot_id, Integer, null: false
    field :magazine_id, Integer, null: false
    field :publication_feature, String, null: true
    field :page_number, Integer, null: true
    field :notes, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    # Magazine relation
    field :magazine, Types::MagazineType, null: false
  end
end
