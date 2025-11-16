module Types
  class GeneratedPlanType < Types::BaseObject
    field :id, ID, null: false
    field :plan_name, String, null: false
    field :description, String, null: true
    field :total_budget, Float, null: true
    field :start_time, String, null: false
    field :end_time, String, null: false
    field :plan_details, [Types::PlanDetailType], null: false
    field :travel_route, Types::TravelRouteType, null: false
  end
end
