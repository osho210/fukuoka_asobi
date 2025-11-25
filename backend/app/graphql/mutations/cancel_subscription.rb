# frozen_string_literal: true

module Mutations
  class CancelSubscription < BaseMutation
    description "サブスクリプションをキャンセル"

    argument :immediately, Boolean, required: false, default_value: false

    field :success, Boolean, null: false
    field :message, String, null: true
    field :errors, [String], null: false

    def resolve(immediately: false)
      user = context[:current_user]

      unless user
        return {
          success: false,
          message: nil,
          errors: ['ログインが必要です']
        }
      end

      unless user.stripe_subscription_id
        return {
          success: false,
          message: nil,
          errors: ['有効なサブスクリプションがありません']
        }
      end

      service = ::Stripe::SubscriptionService.new(user)

      if immediately
        service.cancel_subscription_immediately
        message = 'サブスクリプションを即座にキャンセルしました'
      else
        service.cancel_subscription
        message = '現在の期間終了時にサブスクリプションがキャンセルされます'
      end

      {
        success: true,
        message: message,
        errors: []
      }
    rescue ::Stripe::StripeError => e
      {
        success: false,
        message: nil,
        errors: ["決済処理でエラーが発生しました: #{e.message}"]
      }
    rescue StandardError => e
      {
        success: false,
        message: nil,
        errors: ["エラーが発生しました: #{e.message}"]
      }
    end
  end
end
