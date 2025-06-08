# app/graphql/mutations/delete_spot.rb
# frozen_string_literal: true

module Mutations
  class DeleteSpot < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors,  [String], null: false

    def resolve(**args)
      id = args.delete(:id)

      spot = Spot.find_by(id: id)
      unless spot
        return { success: false, errors: ["指定されたスポットが見つかりません"] }
      end

      if spot.update(is_closed: true)
        { success: true, errors: [] }
      else
        { success: false, errors: spot.errors.full_messages }
      end
    end
  end
end
