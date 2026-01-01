# frozen_string_literal: true

module Types
  class BucketListItemReferenceInputType < BaseInputObject
    argument :id, ID, required: false, description: "ID"
    argument :title, String, required: false, description: "参考資料のタイトル"
    argument :url, String, required: true, description: "URL"
    argument :reference_type, String, required: true, description: "参考資料の種別"
    argument :sort_order, Integer, required: true, description: "並び順"
    argument :_destroy, Boolean, required: false, description: "削除フラグ"
  end
end
