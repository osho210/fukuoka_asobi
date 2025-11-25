# frozen_string_literal: true

module Stripe
  class WebhookHandler
    def initialize(payload, signature)
      @payload = payload
      @signature = signature
    end

    def process
      event = verify_webhook_signature
      return false unless event

      case event.type
      when 'checkout.session.completed'
        handle_checkout_completed(event)
      when 'invoice.payment_succeeded'
        handle_payment_succeeded(event)
      when 'invoice.payment_failed'
        handle_payment_failed(event)
      when 'customer.subscription.deleted'
        handle_subscription_deleted(event)
      when 'customer.subscription.updated'
        handle_subscription_updated(event)
      else
        Rails.logger.info "Unhandled event type: #{event.type}"
      end

      true
    rescue StandardError => e
      Rails.logger.error "Webhook processing error: #{e.message}"
      false
    end

    private

    def verify_webhook_signature
      endpoint_secret = ENV['STRIPE_WEBHOOK_SECRET'] ||
                        Rails.application.credentials.dig(:stripe, :webhook_secret)

      ::Stripe::Webhook.construct_event(
        @payload,
        @signature,
        endpoint_secret
      )
    rescue JSON::ParserError, ::Stripe::SignatureVerificationError => e
      Rails.logger.error "Webhook signature verification failed: #{e.message}"
      nil
    end

    # Checkoutセッション完了時の処理
    def handle_checkout_completed(event)
      session = event.data.object
      user_id = session.metadata.user_id

      user = User.find_by(id: user_id)
      return unless user

      # サブスクリプション情報を更新
      user.update(
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        subscription_status: 'active',
        is_paid_member: true,
        paid_start_date: Date.today,
        paid_end_date: Date.today >> 1 # 1ヶ月後
      )

      Rails.logger.info "Checkout completed for user #{user.id}"
    end

    # 支払い成功時の処理
    def handle_payment_succeeded(event)
      invoice = event.data.object
      subscription_id = invoice.subscription
      customer_id = invoice.customer

      user = User.find_by(stripe_customer_id: customer_id)
      return unless user

      # 決済履歴を記録
      PaymentTransaction.create!(
        user: user,
        stripe_payment_intent_id: invoice.payment_intent,
        amount: invoice.amount_paid / 100.0, # セントから円に変換
        currency: invoice.currency,
        status: 'succeeded',
        paid_at: Time.at(invoice.created),
        metadata: {
          invoice_id: invoice.id,
          subscription_id: subscription_id
        }.to_json
      )

      # サブスクリプション期間を更新
      if subscription_id
        subscription = ::Stripe::Subscription.retrieve(subscription_id)
        user.update(
          paid_end_date: Time.at(subscription.current_period_end).to_date
        )
      end

      Rails.logger.info "Payment succeeded for user #{user.id}"
    end

    # 支払い失敗時の処理
    def handle_payment_failed(event)
      invoice = event.data.object
      customer_id = invoice.customer

      user = User.find_by(stripe_customer_id: customer_id)
      return unless user

      # 決済履歴を記録
      PaymentTransaction.create!(
        user: user,
        stripe_payment_intent_id: invoice.payment_intent,
        amount: invoice.amount_due / 100.0,
        currency: invoice.currency,
        status: 'failed',
        paid_at: Time.at(invoice.created),
        metadata: {
          invoice_id: invoice.id,
          error_message: invoice.last_finalization_error&.message
        }.to_json
      )

      # サブスクリプション状態を更新
      user.update(subscription_status: 'past_due')

      Rails.logger.warn "Payment failed for user #{user.id}"
    end

    # サブスクリプション削除時の処理
    def handle_subscription_deleted(event)
      subscription = event.data.object
      customer_id = subscription.customer

      user = User.find_by(stripe_customer_id: customer_id)
      return unless user

      user.update(
        subscription_status: 'canceled',
        is_paid_member: false,
        stripe_subscription_id: nil
      )

      Rails.logger.info "Subscription deleted for user #{user.id}"
    end

    # サブスクリプション更新時の処理
    def handle_subscription_updated(event)
      subscription = event.data.object
      customer_id = subscription.customer

      user = User.find_by(stripe_customer_id: customer_id)
      return unless user

      status = subscription.status
      current_period_end = Time.at(subscription.current_period_end).to_date

      user.update(
        subscription_status: status,
        is_paid_member: %w[active trialing].include?(status),
        paid_end_date: current_period_end
      )

      Rails.logger.info "Subscription updated for user #{user.id}: #{status}"
    end
  end
end
