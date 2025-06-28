# app/graphql/types/plan_detail_input_type.rb
module Types
    class PlanDetailInputType < Types::BaseInputObject
      graphql_name 'PlanDetailInput'

      argument :id, ID, required: true
      argument :plan_id, ID, required: false
      argument :step_number, Integer, required: false
      argument :step_name, String, required: false
      argument :step_description, String, required: false
      argument :start_datetime, GraphQL::Types::ISO8601DateTime, required: false
      argument :end_datetime, GraphQL::Types::ISO8601DateTime, required: false
      argument :budget, Float, required: false
      argument :spot_id, Integer, required: false
      argument :comment, String, required: false
      argument :notes, String, required: false
    end
  end
