# config/initializers/cors.rb
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    origins "https://fukuoka-asobi.com",
            "https://www.fukuoka-asobi.com",
            "http://localhost:8200",
            "http://localhost:9200",
            "https://fukuoka-asobi.vercel.app"

    resource "*",
      headers: :any,
      methods: %i[get post put patch delete options head],
      credentials: true,
      max_age: 600
  end
end

