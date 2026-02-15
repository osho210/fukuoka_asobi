# frozen_string_literal: true

module Mutations
  class CreateDmTemplate < BaseMutation
    argument :name, String, required: true
    argument :version, String, required: true
    argument :content, String, required: true
    argument :description, String, required: false
    argument :is_active, Boolean, required: false

    field :dm_template, Types::DmTemplateType, null: true
    field :errors, [String], null: false

    def resolve(name:, version:, content:, description: nil, is_active: true)
      dm_template = DmTemplate.new(
        name: name,
        version: version,
        content: content,
        description: description,
        is_active: is_active
      )

      if dm_template.save
        { dm_template: dm_template, errors: [] }
      else
        { dm_template: nil, errors: dm_template.errors.full_messages }
      end
    end
  end
end
