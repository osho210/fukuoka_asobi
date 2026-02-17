# frozen_string_literal: true

module Types
  class DmTemplateType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :version, String, null: false
    field :content, String, null: false
    field :description, String, null: true
    field :is_active, Boolean, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    field :available_variables, [String], null: false
    def available_variables
      object.available_variables
    end
  end
end
