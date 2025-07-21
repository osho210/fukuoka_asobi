# frozen_string_literal: true

module Types
  module Input
    class SpotMagazineAttributes < Types::BaseInputObject
      description "Attributes for creating or updating a spot magazine"
      argument :id, ID, required: false
      argument :magazine_id, ID, required: true
      argument :publication_feature, String, required: false
      argument :page_number, Integer, required: false
      argument :notes, String, required: false
      argument :_destroy, Boolean, required: false
    end
  end
end
