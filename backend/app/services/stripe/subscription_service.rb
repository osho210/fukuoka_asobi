# frozen_string_literal: true

module Stripe
  class SubscriptionService
    MONTHLY_PRICE_ID = ENV['STRIPE_MONTHLY_PRICE_ID'] ||
                       Rails.application.credentials.dig(:stripe, :monthly_price_id)

    def initialize(user)
      @user = user
    end

    # Checkoutセッションを作成
    def create_checkout_session(success_url:, cancel_url:)
      # Stripeカスタマーが存在しない場合は作成
      customer = ensure_stripe_customer

      session = ::Stripe::Checkout::Session.create(
        customer: customer.id,
        mode: 'subscription',
        line_items: [{
          price: MONTHLY_PRICE_ID,
          quantity: 1
        }],
        success_url: success_url,
        cancel_url: cancel_url,
        metadata: {
          user_id: @user.id
        }
      )

      session
    rescue ::Stripe::StripeError => e
      Rails.logger.error "Stripe checkout session creation failed: #{e.message}"
      raise
    end

    # サブスクリプションをキャンセル
    def cancel_subscription
      return false unless @user.stripe_subscription_id

      subscription = ::Stripe::Subscription.update(
        @user.stripe_subscription_id,
        cancel_at_period_end: true
      )

      # ユーザー情報を更新
      @user.update(
        subscription_status: 'canceling'
      )

      subscription
    rescue ::Stripe::StripeError => e
      Rails.logger.error "Stripe subscription cancellation failed: #{e.message}"
      raise
    end

    # サブスクリプションを即座にキャンセル
    def cancel_subscription_immediately
      return false unless @user.stripe_subscription_id

      subscription = ::Stripe::Subscription.delete(@user.stripe_subscription_id)

      # ユーザー情報を更新
      @user.update(
        subscription_status: 'canceled',
        is_paid_member: false,
        paid_end_date: Date.today
      )

      subscription
    rescue ::Stripe::StripeError => e
      Rails.logger.error "Stripe subscription immediate cancellation failed: #{e.message}"
      raise
    end

    # サブスクリプション情報を取得
    def retrieve_subscription
      return nil unless @user.stripe_subscription_id

      ::Stripe::Subscription.retrieve(@user.stripe_subscription_id)
    rescue ::Stripe::StripeError => e
      Rails.logger.error "Stripe subscription retrieval failed: #{e.message}"
      nil
    end

    # サブスクリプション状態を同期
    def sync_subscription_status
      subscription = retrieve_subscription
      return unless subscription

      status = subscription.status
      current_period_end = Time.at(subscription.current_period_end).to_date

      @user.update(
        subscription_status: status,
        is_paid_member: %w[active trialing].include?(status),
        paid_end_date: current_period_end
      )
    end

    private

    # Stripeカスタマーを確保（存在しない場合は作成）
    def ensure_stripe_customer
      if @user.stripe_customer_id.present?
        ::Stripe::Customer.retrieve(@user.stripe_customer_id)
      else
        customer = ::Stripe::Customer.create(
          email: @user.email,
          name: @user.username,
          metadata: {
            user_id: @user.id
          }
        )

        @user.update(stripe_customer_id: customer.id)
        customer
      end
    rescue ::Stripe::StripeError => e
      Rails.logger.error "Stripe customer creation/retrieval failed: #{e.message}"
      raise
    end
  end
end
