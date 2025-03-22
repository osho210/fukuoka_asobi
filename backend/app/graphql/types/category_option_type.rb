# frozen_string_literal: true

module Types
  class CategoryOptionType < Types::BaseObject
    field :id, String, null: false
    field :label, String, null: false
  end
end
