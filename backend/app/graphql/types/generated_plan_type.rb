module Types
  class GeneratedPlanType < Types::BaseObject
    field :id, ID, null: false
    field :plan_name, String, null: false
    field :description, String, null: true
    field :total_budget, Float, null: true
    field :start_datetime, GraphQL::Types::ISO8601DateTime, null: true
    field :end_datetime, GraphQL::Types::ISO8601DateTime, null: true
    field :plan_details, [Types::PlanDetailType], null: false
    field :travel_route, Types::TravelRouteType, null: false
  end
end
