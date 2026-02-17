# frozen_string_literal: true

module Mutations
  class UpdateDmTemplate < BaseMutation
    argument :id, ID, required: true
    argument :name, String, required: false
    argument :version, String, required: false
    argument :content, String, required: false
    argument :description, String, required: false
    argument :is_active, Boolean, required: false

    field :dm_template, Types::DmTemplateType, null: true
    field :errors, [String], null: false

    def resolve(id:, **attributes)
      dm_template = DmTemplate.find_by(id: id)

      unless dm_template
        return { dm_template: nil, errors: ['DMテンプレートが見つかりません'] }
      end

      if dm_template.update(attributes.compact)
        { dm_template: dm_template, errors: [] }
      else
        { dm_template: nil, errors: dm_template.errors.full_messages }
      end
    end
  end
end
