# frozen_string_literal: true

module Mutations
  class DeleteStation < BaseMutation
    argument :id, ID, required: true

    field :success, Boolean, null: false
    field :errors,  [String], null: false

    def resolve(id:)
      # TODO: 管理者アカウント作成時に復活させる
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { success: false, errors: ["管理者権限が必要です"] }
      end

      station = Station.find_by(id: id)
      return { success: false, errors: ["指定された駅が見つかりません"] } unless station

      if station.update!(active: false)
        { success: true, errors: [] }
      else
        { success: false, errors: station.errors.full_messages }
      end
    end
  end
end
