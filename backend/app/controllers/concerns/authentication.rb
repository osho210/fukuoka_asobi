# frozen_string_literal: true

module Authentication
  extend ActiveSupport::Concern

  # JWTトークンをCookieに設定
  def set_auth_cookie(token)
    cookie_options = {
      value: token,
      expires: 6.months.from_now,
      httponly: true,
      secure: Rails.env.production?,
      same_site: :lax,
      path: '/'
    }
    cookies.encrypted[:fukuoka_asobi_auth_token] = cookie_options
  end

  # 認証Cookieを削除
  def clear_user_cookie
    cookies.delete(:fukuoka_asobi_auth_token, path: '/')
  end

  # Cookieからユーザーを取得（JWTトークンをデコード）
  def current_user_from_cookie
    token = cookies.encrypted[:fukuoka_asobi_auth_token]

    # トークンが存在しない場合はnilを返す
    return nil unless token

    begin
      # JWTトークンをデコード
      decoded_token = JWT.decode(
        token,
        Rails.application.credentials.dig(:devise, :jwt_secret_key),
        true,
        { algorithm: 'HS256' }
      )

      # ペイロードからユーザーIDとJTIを取得
      payload = decoded_token.first
      user_id = payload['sub']
      jti = payload['jti']

      # ユーザーを取得し、JTIが一致するか確認
      user = User.find_by(id: user_id)
      return nil unless user
      return nil unless user.jti == jti

      user
    rescue JWT::DecodeError, JWT::ExpiredSignature => e
      Rails.logger.warn "トークン認証でエラーが発生しました error: #{e.message}"
      nil
    end
  end

  # トークンを生成
  def generate_auth_token(user)
    payload = {
      sub: user.id,
      jti: user.jti,
      scp: 'user',
      exp: 6.months.from_now.to_i
    }

    secret_key = Rails.application.credentials.dig(:devise, :jwt_secret_key)
    unless secret_key
      raise "JWT secret key is not configured. Please set :devise, :jwt_secret_key in your credentials."
    end
    JWT.encode(payload, secret_key)
  end
end
