# frozen_string_literal: true

module Types
  class BucketListItemBelongingInputType < BaseInputObject
    argument :id, ID, required: false, description: "ID"
    argument :name, String, required: true, description: "持ち物の名前"
    argument :note, String, required: false, description: "備考"
    argument :sort_order, Integer, required: true, description: "並び順"
    argument :_destroy, Boolean, required: false, description: "削除フラグ"
  end
end
