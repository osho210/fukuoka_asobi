class PasswordMailer < ApplicationMailer
  # パスワードリセットメールの送信
  def reset_password_email(user, raw_token)
    @user = user
    # Docker環境を考慮したフロントエンドURL
    frontend_url = if Rails.env.development?
                     ENV['FRONTEND_URL'] || 'http://localhost:8200'
                   else
                     ENV['FRONTEND_URL'] || 'http://localhost:3000'
                   end
    @reset_url = "#{frontend_url}/reset-password?token=#{raw_token}"
    @expiration_time = 2.hours.from_now.in_time_zone('Asia/Tokyo').strftime('%Y年%m月%d日 %H:%M')

    mail(
      to: @user.email,
      subject: '【福岡遊び】パスワード再設定のご案内'
    )
  end
end
