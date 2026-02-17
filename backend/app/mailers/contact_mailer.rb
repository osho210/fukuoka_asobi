# frozen_string_literal: true

class ContactMailer < ApplicationMailer
  # 管理者宛にお問い合わせを通知します。
  #
  # Args:
  #   name (String): お問い合わせ者の名前
  #   email (String): お問い合わせ者のメールアドレス
  #   subject (String): 件名
  #   category (String): お問い合わせ種別
  #   message (String): お問い合わせ内容
  #
  # Returns:
  #   Mail::Message: メールオブジェクト
  def admin_notification(name:, email:, subject:, category:, message:)
    @name = name
    @email = email
    @subject = subject
    @category = category
    @message = message

    receiver_email = ENV.fetch("CONTACT_RECEIVER_EMAIL", "fukuoka.asobi.nikki@gmail.com")

    mail(
      to: receiver_email,
      subject: "[お問い合わせ] #{@subject}"
    )
  end

  # お問い合わせ者へ自動返信メールを送信します。
  #
  # Args:
  #   name (String): お問い合わせ者の名前
  #   email (String): お問い合わせ者のメールアドレス
  #   subject (String): 件名
  #
  # Returns:
  #   Mail::Message: メールオブジェクト
  def auto_reply(name:, email:, subject:)
    @name = name
    @subject = subject

    mail(
      to: email,
      subject: "[福岡遊び日記] お問い合わせを受け付けました"
    )
  end
end
