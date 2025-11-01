module Mutations
  module Inputs
    class ImagePropertyInputType < Types::BaseInputObject
      description "画像プロパティの入力"

      argument :attachment_id, ID, required: true
      argument :is_selected, Boolean, required: true
      argument :position, Integer, required: true
      argument :comment, String, required: false
    end
  end
end
