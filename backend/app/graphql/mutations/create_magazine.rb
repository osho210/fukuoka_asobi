# frozen_string_literal: true

module Mutations
  class CreateMagazine < BaseMutation
    argument :name, String, required: true
    argument :release_date, GraphQL::Types::ISO8601Date, required: false
    argument :sales_info, String, required: false
    argument :sales_url, String, required: false
    argument :publisher, String, required: false
    argument :issue_number, String, required: false
    argument :cover_image_url, String, required: false
    argument :description, String, required: false
    argument :status, Types::MagazineStatusEnumType, required: true

    field :magazine, Types::MagazineType, null: true
    field :errors, [String], null: false

    def resolve(**args)
      # TODO: 管理者権限チェック
      unless context[:current_user]&.admin?
      #   return { magazine: nil, errors: ['管理者権限が必要です'] }
      # end

      magazine = Magazine.new(args)

      if magazine.save
        { magazine: magazine, errors: [] }
      else
        { magazine: nil, errors: magazine.errors.full_messages }
      end
    end
  end
end
