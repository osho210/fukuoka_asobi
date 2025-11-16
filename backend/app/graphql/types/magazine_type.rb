# frozen_string_literal: true

module Types
  class MagazineType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :release_date, GraphQL::Types::ISO8601Date, null: false
    field :sales_info, String, null: true
    field :sales_url, String, null: true
    field :publisher, String, null: true
    field :issue_number, String, null: true
    field :cover_image_url, String, null: true
    field :description, String, null: true
    field :status, String, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
