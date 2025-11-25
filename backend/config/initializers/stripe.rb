# frozen_string_literal: true

# Stripe API設定
Rails.application.config.after_initialize do
  # 環境変数またはcredentialsからStripe APIキーを取得
  stripe_secret_key = ENV['STRIPE_SECRET_KEY'] || 
                      Rails.application.credentials.dig(:stripe, :secret_key)
  
  if stripe_secret_key.present?
    Stripe.api_key = stripe_secret_key
    Rails.logger.info "Stripe initialized with API key"
  else
    Rails.logger.warn "Stripe API key not configured"
  end
end
