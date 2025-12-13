# app/graphql/mutations/update_purpose.rb
# frozen_string_literal: true

module Mutations
  class UpdatePurpose < BaseMutation
    # ---------- 変更 ----------
    argument :id,           ID,     required: true
    argument :purpose_name, String, required: false
    # --------------------------

    field :purpose, Types::PurposeType, null: true
    field :errors,  [String],           null: false

    def resolve(id:, purpose_name: nil)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { purpose: nil, errors: ["管理者権限が必要です"] }
        end

      purpose = Purpose.find_by(id: id)
      return { purpose: nil, errors: ["指定された目的が見つかりません"] } unless purpose

      attrs = {}
      attrs[:purpose_name] = purpose_name if purpose_name.present?

      if purpose.update(attrs)
        { purpose: purpose, errors: [] }
      else
        { purpose: nil, errors: purpose.errors.full_messages }
      end
    end
  end
end
