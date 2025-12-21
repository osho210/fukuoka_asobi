# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 本番ドメイン
    origins "https://fukuoka-asobi.com",
            "https://www.fukuoka-asobi.com",
            # 開発環境
            "http://localhost:8200",
            "http://localhost:9200",
            # Cloudflare Pages (管理画面)
            "https://fukuoka-asobi.pages.dev",
            "https://admin.fukuoka-asobi.com"

    resource "*",
      headers: :any,
      methods: %i[get post put patch delete options head],
      credentials: true,
      max_age: 600
  end
end

