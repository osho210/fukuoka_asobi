# frozen_string_literal: true

module Mutations
    class CreateStation < BaseMutation
        argument :name, String, required: true
        argument :description, String, required: false
        argument :train_line, Types::TrainLineEnumType, required: false
        argument :active, Boolean, required: false, default_value: true

        field :station, Types::StationType, null: true
        field :errors,  [String],           null: false

        def resolve(name:, description: nil, active: true, train_line: nil)
        station = Station.new(name: name, description: description, active: active, train_line: train_line)
        if station.save
            { station: station, errors: [] }
        else
            { station: nil,  errors: station.errors.full_messages }
        end
        end
    end
end
