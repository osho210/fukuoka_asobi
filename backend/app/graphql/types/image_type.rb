# frozen_string_literal: true

module Types
  class ImageType < Types::BaseObject
    field :id, ID, null: false
    field :url, String, null: false

    def id
      object[:id]
    end

    def url
      object[:url]
    end
  end
end
