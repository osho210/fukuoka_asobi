# app/graphql/mutations/create_purpose.rb
# frozen_string_literal: true

module Mutations
  class CreatePurpose < BaseMutation
    # -------- 変更 ----------
    argument :purpose_name, String, required: true
    # ------------------------

    field :purpose, Types::PurposeType, null: true
    field :errors,  [String],           null: false

    def resolve(purpose_name:)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { purpose: nil, errors: ["管理者権限が必要です"] }
      end

      purpose = Purpose.new(purpose_name: purpose_name)

      if purpose.save
        { purpose: purpose, errors: [] }
      else
        { purpose: nil, errors: purpose.errors.full_messages }
      end
    end
  end
end
