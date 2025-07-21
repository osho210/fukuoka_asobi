# frozen_string_literal: true

module Types
  class SpotMagazineType < Types::BaseObject
    field :spot, Types::SpotType, null: false
    field :magazine, Types::MagazineType, null: false
    field :publication_feature, String, null: true
    field :page_number, Integer, null: true
    field :notes, String, null: true
  end
end
