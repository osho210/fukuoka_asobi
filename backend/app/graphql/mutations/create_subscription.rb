# frozen_string_literal: true

module Mutations
  class CreateSubscription < BaseMutation
    description "サブスクリプションのCheckoutセッションを作成"

    argument :success_url, String, required: true
    argument :cancel_url, String, required: true

    field :session_id, String, null: true
    field :errors, [String], null: false

    def resolve(success_url:, cancel_url:)
      user = context[:current_user]

      unless user
        return {
          session_id: nil,
          errors: ['ログインが必要です']
        }
      end

      service = ::Stripe::SubscriptionService.new(user)
      session = service.create_checkout_session(
        success_url: success_url,
        cancel_url: cancel_url
      )

      {
        session_id: session.id,
        errors: []
      }
    rescue ::Stripe::StripeError => e
      {
        session_id: nil,
        errors: ["決済処理でエラーが発生しました: #{e.message}"]
      }
    rescue StandardError => e
      {
        session_id: nil,
        errors: ["エラーが発生しました: #{e.message}"]
      }
    end
  end
end
