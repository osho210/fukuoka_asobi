# frozen_string_literal: true

module Types
  class ConsentRequestType < Types::BaseObject
    field :id, ID, null: false
    field :spot_id, Integer, null: false
    field :spot, Types::SpotType, null: false
    field :consenter_type, Types::ConsenterTypeEnum, null: false
    field :consenter_display_name, String, null: false
    field :contact_hint, String, null: true
    field :status, Types::ConsentRequestStatusEnum, null: false
    field :token, String, null: false
    field :expires_at, GraphQL::Types::ISO8601DateTime, null: true
    field :message_template, String, null: true
    field :instagram_post_url, String, null: true
    field :created_by, Integer, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :consent_agreement, Types::ConsentAgreementType, null: true
    field :form_url, String, null: false

    def form_url
      # フロントエンドのベースURLを環境変数から取得
      base_url = ENV.fetch('FRONTEND_URL', 'http://localhost:8200')
      "#{base_url}/consent/#{object.token}"
    end
  end
end
