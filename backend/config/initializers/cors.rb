# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 本番ドメイン
    origins "https://fukuoka-asobi.com",
            "https://www.fukuoka-asobi.com",
            # 開発環境
            "http://localhost:8200",
            "http://localhost:9200",
            # Vercel（現行）
            "https://fukuoka-asobi.vercel.app"
            # Cloudflare Pages への移行時は以下を追加してください：
            # "https://fukuoka-asobi-frontend.pages.dev",  # Frontend デフォルトドメイン
            # "https://fukuoka-asobi-admin.pages.dev"      # Admin デフォルトドメイン
            # 移行完了後、Vercel ドメインは削除してください

    resource "*",
      headers: :any,
      methods: %i[get post put patch delete options head],
      credentials: true,
      max_age: 600
  end
end

