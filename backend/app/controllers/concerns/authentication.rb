# frozen_string_literal: true

module Authentication
  extend ActiveSupport::Concern

  # ユーザーIDをCookieに設定
  def set_user_cookie(user)
    cookies.encrypted[:fukuoka_asobi_user_id] = {
      value: user.id,
      httponly: true,
      secure: Rails.env.production?,
      same_site: :lax,
      path: '/',
      expires: 7.days.from_now
    }
  end

  # ユーザーCookieを削除
  def clear_user_cookie
    cookies.delete(:fukuoka_asobi_user_id, path: '/')
  end

  # Cookieからユーザーを取得
  def current_user_from_cookie
    user_id = cookies.encrypted[:fukuoka_asobi_user_id]
    User.find_by(id: user_id) if user_id
  end
end
