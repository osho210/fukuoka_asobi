# frozen_string_literal: true

module Mutations
    class UpdateStation < BaseMutation
        argument :id, ID, required: true
        argument :name, String, required: false
        argument :description, String, required: false
        argument :train_line, Types::TrainLineEnumType, required: false
        argument :active, Boolean, required: false

        field :station, Types::StationType, null: true
        field :errors, [String], null: false

        def resolve(id:, name: nil, description: nil, active: nil, train_line: nil)
            # 管理者権限チェック
            unless context[:current_user]&.admin?
            #     return { station: nil, errors: ["管理者権限が必要です"] }
            # end

            station = Station.find_by(id: id)
            return { station: nil, errors: ["指定された駅が見つかりません"] } unless station

            station.name = name if name
            station.description = description if description
            station.active = active unless active.nil?
            station.train_line = train_line if train_line

            if station.save
                { station: station, errors: [] }
            else
                { station: nil, errors: station.errors.full_messages }
            end
        end
    end
end
