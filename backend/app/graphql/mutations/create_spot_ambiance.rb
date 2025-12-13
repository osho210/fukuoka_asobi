# app/graphql/mutations/create_spot_ambiance.rb
# frozen_string_literal: true

module Mutations
  class CreateSpotAmbiance < BaseMutation
    # --------- 変更点 ---------
    argument :ambiance_name, String, required: true
    # --------------------------

    field :spot_ambiance, Types::SpotAmbianceType, null: true
    field :errors,        [String],                null: false

    def resolve(ambiance_name:)
      # 管理者権限チェック
      unless context[:current_user]&.admin?
        return { spot_ambiance: nil, errors: ["管理者権限が必要です"] }
        end

      spot_ambiance = SpotAmbiance.new(ambiance_name: ambiance_name)

      if spot_ambiance.save
        { spot_ambiance: spot_ambiance, errors: [] }
      else
        { spot_ambiance: nil, errors: spot_ambiance.errors.full_messages }
      end
    end
  end
end
