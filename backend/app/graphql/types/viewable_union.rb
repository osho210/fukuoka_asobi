# frozen_string_literal: true

module Types
  class ViewableUnion < Types::BaseUnion
    description "閲覧履歴で記録可能なオブジェクトの型"

    possible_types Types::NewsType, Types::MagazineType, Types::PlayPlanType

    def self.resolve_type(object, _context)
      case object
      when News
        Types::NewsType
      when Magazine
        Types::MagazineType
      when PlayPlan
        Types::PlayPlanType
      else
        raise "予期しないオブジェクトタイプです: #{object}"
      end
    end
  end
end
