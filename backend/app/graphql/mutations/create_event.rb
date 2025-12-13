# frozen_string_literal: true

module Mutations
    class CreateEvent < BaseMutation
        argument :title, String, required: false
        argument :description, String, required: false
        argument :start_datetime, GraphQL::Types::ISO8601DateTime, required: false
        argument :end_datetime, GraphQL::Types::ISO8601DateTime, required: false
        argument :location, String, required: false
        argument :recurring_rule, String, required: false
        argument :event_category_id, ID, required: false
        argument :price, String, required: false
        argument :organizer, String, required: false
        argument :contact_email, String, required: false
        argument :contact_phone, String, required: false
        argument :capacity, Integer, required: false
        argument :is_online, Boolean, required: false
        argument :source_url, String, required: false
        argument :banner_image, String, required: false
        argument :status, Types::StatusEnumType, required: false

        field :event, Types::EventType, null: false
        field :errors, [String], null: false

        def resolve(**args)
            # 管理者権限チェック
            unless context[:current_user]&.admin?
              return { event: nil, errors: ["管理者権限が必要です"] }
              end

            input = args.compact

            event = Event.new(input)

            if event.save
                { event: event, errors: [] }
            else
                { event: nil, errors: event.errors.full_messages }
            end
        rescue ActiveRecord::RecordInvalid => e
            raise GraphQL::ExecutionError, e.record.errors.full_messages.join(', ')
        end
    end
end
