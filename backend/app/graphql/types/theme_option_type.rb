# frozen_string_literal: true

module Types
  class ThemeOptionType < Types::BaseObject
    field :id, String, null: false
    field :label, String, null: false
  end
end
