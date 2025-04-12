module Api
  class PasswordsController < ApplicationController
    # CSRF保護をスキップ（APIモードのため）
    # TODO: CSRF保護を有効にする場合は、APIトークンを使用して認証を行うことを検討
    skip_before_action :verify_authenticity_token

    # パスワードリセットリクエスト
    def forgot
      # リクエストパラメータを取得
      email_param = params[:email]

      # パラメータがネストされている場合の対応
      if email_param.blank? && params[:password].present? && params[:password][:email].present?
        email_param = params[:password][:email]
      end

      # メールアドレスが提供されていない場合
      if email_param.blank?
        return render json: {
          success: false,
          message: 'メールアドレスを入力してください'
        }, status: :unprocessable_entity
      end

      # ユーザーを検索
      user = User.find_by(email: email_param.downcase)

      # セキュリティのため、ユーザーが存在しない場合でも同じメッセージを返す
      if user.present?
        # トークンを生成して保存（生のトークンが返される）
        raw_token = user.generate_password_token!
        # メール送信（letter_opener_webで表示）
        PasswordMailer.reset_password_email(user, raw_token).deliver_now
        # 開発環境ではログ出力
        if Rails.env.development?
          Rails.logger.info "開発環境: パスワードリセットメールが送信されました。トークン: #{raw_token}"
        end
      else
        Rails.logger.info "#{email_param}は存在しません。パスワードリセットメールは送信されませんでした。"
      end


      # TODO: 将来的にはレスポンスのメッセージを制御しても良いかも
      # 常に成功レスポンスを返す（セキュリティ対策）
      render json: {
        success: true,
        message: 'パスワード再設定用のメールを送信しました。メールに記載されたリンクからパスワードを再設定してください'
      }
    end

    # パスワードリセット実行
    def reset
      # リクエストパラメータを取得
      token_param = params[:token]
      password_param = params[:password]
      password_confirmation_param = params[:password_confirmation]

      # パラメータがネストされている場合の対応
      if token_param.blank? && params[:password].present? && params[:password][:token].present?
        token_param = params[:password][:token]
      end

      # パスワードがオブジェクトの場合（ネストされたパラメータ）
      if password_param.is_a?(Hash) && password_param[:password].present?
        password_param = password_param[:password]
      end

      if password_confirmation_param.blank? && params[:password].is_a?(Hash) && params[:password][:password_confirmation].present?
        password_confirmation_param = params[:password][:password_confirmation]
      end

      # トークンが提供されていない場合
      if token_param.blank?
        return render json: {
          success: false,
          message: '無効なリクエストです'
        }, status: :unprocessable_entity
      end

      # パスワードが提供されていない場合
      if password_param.blank?
        return render json: {
          success: false,
          message: '新しいパスワードを入力してください'
        }, status: :unprocessable_entity
      end

      # 入力されたパスワードに差異がある場合
      if password_param != password_confirmation_param
        return render json: {
          success: false,
          message: 'パスワードと確認用パスワードが一致しません'
        }, status: :unprocessable_entity
      end

      # トークンでユーザーを検索（直接トークンで検索）
      user = User.find_by(reset_password_token: token_param)

      # ユーザーが見つからない、またはトークンが期限切れの場合
      if user.nil? || !user.password_token_valid?
        return render json: {
          success: false,
          message: 'リンクが無効か期限切れです。再度パスワードリセットをリクエストしてください'
        }, status: :unprocessable_entity
      end

      # パスワードを更新
      if user.reset_password!(password_param)
        render json: {
          success: true,
          message: 'パスワードが正常に更新されました'
        }
      else
        render json: {
          success: false,
          message: 'パスワードの更新に失敗しました',
          errors: user.errors.full_messages
        }, status: :unprocessable_entity
      end
    end
  end
end
