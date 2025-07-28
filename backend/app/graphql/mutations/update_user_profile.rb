# frozen_string_literal: true

require 'uri'
require 'base64'
require 'tempfile'

module Mutations
  class UpdateUserProfile < BaseMutation
    description "ユーザープロフィールを更新します"

    # 入力フィールド
    argument :username, String, required: false
    argument :instagram_url, String, required: false
    argument :bio, String, required: false
    argument :profile_image_url, String, required: false
    argument :avatar, String, required: false, description: "Base64エンコードされた画像データ"

    # 出力フィールド
    field :user, Types::UserType, null: true
    field :errors, [String], null: false

    def resolve(username: nil, instagram_url: nil, bio: nil, profile_image_url: nil, avatar: nil)
      current_user = context[:current_user]
      unless current_user
        return { user: nil, errors: ["認証されていません。ログインしてください。"] }
      end

      update_params = {}
      update_params[:username]      = username       if username.present?
      update_params[:instagram_url] = instagram_url  if instagram_url.present?
      update_params[:bio]           = bio            if bio.present?

      # ───────────────────────────────
      # profile_image_url は必ず文字列化して basename を取る
      # ───────────────────────────────
      if profile_image_url.present?
        path = URI.parse(profile_image_url.to_s).path.to_s
        filename = File.basename(path)
        update_params[:profile_image_url] = filename
      end

      # ───────────────────────────────
      # avatar(Base64) 処理も to_s で nil 対策
      # ───────────────────────────────
      if avatar.present?
        begin
          data_url    = avatar.to_s
          content_type = data_url[/\Adata:(.*?);base64,/, 1].to_s
          base64_data  = data_url.sub(/\Adata:.*?;base64,/, '')
          decoded_data = Base64.decode64(base64_data)

          timestamp = Time.now.to_i
          extension = case content_type
                      when 'image/jpeg' then '.jpg'
                      when 'image/png'  then '.png'
                      when 'image/gif'  then '.gif'
                      else                '.jpg'
                      end
          filename = "avatar_#{timestamp}#{extension}"

          temp_file = Tempfile.new(["avatar_#{timestamp}", extension])
          temp_file.binmode
          temp_file.write(decoded_data)
          temp_file.rewind

          pp 'アップロードするファイル情報:'
          pp "  ファイル名: #{filename}"
          pp "  コンテンツタイプ: #{content_type}" 

          current_user.avatar.purge if current_user.avatar.attached?
          current_user.avatar.attach(
            io:           temp_file,
            filename:     filename,
            content_type: content_type
          )
        rescue => e
          return { user: nil, errors: ["画像のアップロードに失敗しました: #{e.message}"] }
        ensure
          temp_file&.close
          temp_file&.unlink
        end
      end

      # 最後に DB 更新
      if current_user.update(update_params)
        # 最新の情報を取得するためにreloadする
        current_user.reload
        { user: current_user, errors: [] }
      else
        { user: nil, errors: current_user.errors.full_messages }
      end
    end
  end
end
