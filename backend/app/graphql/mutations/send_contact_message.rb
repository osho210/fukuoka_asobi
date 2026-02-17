# frozen_string_literal: true

module Mutations
  class SendContactMessage < BaseMutation
    description "お問い合わせメッセージを送信します"

    # 入力フィールド
    argument :name, String, required: true
    argument :email, String, required: true
    argument :subject, String, required: true
    argument :category, String, required: true
    argument :message, String, required: true
    argument :privacy_accepted, Boolean, required: true

    # 出力フィールド
    field :success, Boolean, null: false
    field :errors, [String], null: false

    def resolve(name:, email:, subject:, category:, message:, privacy_accepted:)
      # バリデーション
      errors = []

      # 必須チェック
      errors << "お名前を入力してください。" if name.blank?
      errors << "メールアドレスを入力してください。" if email.blank?
      errors << "件名を入力してください。" if subject.blank?
      errors << "お問い合わせ種別を選択してください。" if category.blank?
      errors << "お問い合わせ内容を入力してください。" if message.blank?

      # プライバシーポリシー同意チェック
      unless privacy_accepted
        errors << "プライバシーポリシーに同意してください。"
      end

      # メールアドレス形式チェック
      unless email.blank? || email.match?(/\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i)
        errors << "メールアドレスの形式が正しくありません。"
      end

      # 文字数制限
      if name.present? && name.length > 100
        errors << "お名前は100文字以内で入力してください。"
      end
      if subject.present? && subject.length > 200
        errors << "件名は200文字以内で入力してください。"
      end
      if message.present? && message.length > 5000
        errors << "お問い合わせ内容は5000文字以内で入力してください。"
      end

      # カテゴリーの妥当性チェック
      valid_categories = %w[general business media error other]
      unless valid_categories.include?(category)
        errors << "お問い合わせ種別が正しくありません。"
      end

      # エラーがある場合は早期リターン
      return { success: false, errors: errors } if errors.any?

      # メール送信処理
      begin
        # 管理者宛メール送信
        ContactMailer.admin_notification(
          name: name,
          email: email,
          subject: subject,
          category: category_label(category),
          message: message
        ).deliver_now

        # 自動返信メール送信（環境変数で制御）
        if ENV.fetch("CONTACT_AUTO_REPLY_ENABLED", "true") == "true"
          ContactMailer.auto_reply(
            name: name,
            email: email,
            subject: subject
          ).deliver_now
        end

        { success: true, errors: [] }
      rescue StandardError => e
        # メール送信エラー
        Rails.logger.error("Contact mail delivery failed: #{e.message}")
        { success: false, errors: ["メールの送信に失敗しました。しばらくしてから再度お試しください。"] }
      end
    end

    private

    # カテゴリーのラベルを返します
    #
    # Args:
    #   category (String): カテゴリーの値
    #
    # Returns:
    #   String: カテゴリーのラベル
    def category_label(category)
      labels = {
        "general" => "一般的なお問い合わせ",
        "business" => "ビジネスに関するお問い合わせ",
        "media" => "メディア掲載について",
        "error" => "サイトのエラー報告",
        "other" => "その他"
      }
      labels[category] || category
    end
  end
end
