# app/graphql/mutations/update_spot_ambiance.rb
# frozen_string_literal: true

module Mutations
  class UpdateSpotAmbiance < BaseMutation
    # ------- 変更 -------
    argument :id,            ID,     required: true
    argument :ambiance_name, String, required: false
    # --------------------

    field :spot_ambiance, Types::SpotAmbianceType, null: true
    field :errors,        [String],                null: false

    def resolve(id:, ambiance_name: nil)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { spot_ambiance: nil, errors: ["管理者権限が必要です"] }
        end

      spot_ambiance = SpotAmbiance.find_by(id: id)
      return { spot_ambiance: nil, errors: ["指定された雰囲気が見つかりません"] } unless spot_ambiance

      attrs = {}
      attrs[:ambiance_name] = ambiance_name if ambiance_name.present?

      if spot_ambiance.update(attrs)
        { spot_ambiance: spot_ambiance, errors: [] }
      else
        { spot_ambiance: nil, errors: spot_ambiance.errors.full_messages }
      end
    end
  end
end
