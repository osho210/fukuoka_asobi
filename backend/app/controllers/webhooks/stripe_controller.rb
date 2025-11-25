# frozen_string_literal: true

module Webhooks
  class StripeController < ApplicationController
    skip_before_action :verify_authenticity_token
    skip_before_action :authenticate_user!

    def create
      payload = request.body.read
      signature = request.env['HTTP_STRIPE_SIGNATURE']

      handler = ::Stripe::WebhookHandler.new(payload, signature)

      if handler.process
        render json: { status: '成功' }, status: :ok
      else
        render json: { error: 'Webhook processing failed' }, status: :bad_request
      end
    end
  end
end
