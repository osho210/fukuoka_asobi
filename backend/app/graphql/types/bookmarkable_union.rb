# frozen_string_literal: true

module Types
  class BookmarkableUnion < Types::BaseUnion
    description "ブックマーク可能なオブジェクトの型"

    possible_types Types::PlayPlanType

    def self.resolve_type(object, _context)
      case object
      when PlayPlan
        Types::PlayPlanType
      else
        raise "予期しないオブジェクトタイプです: #{object}"
      end
    end
  end
end
