require "active_support/core_ext/integer/time"

Rails.application.configure do
  config.enable_reloading = false
  config.eager_load = true
  config.consider_all_requests_local = false
  config.action_controller.perform_caching = true

  config.public_file_server.headers = { "cache-control" => "public, max-age=#{1.year.to_i}" }

  config.asset_host = ENV["ASSET_HOST"] if ENV["ASSET_HOST"].present?
  config.active_storage.service = ENV.fetch("ACTIVE_STORAGE_SERVICE", "local").to_sym

  config.assume_ssl = true
  config.force_ssl = true

  # /up だけ http→https リダイレクトを除外
  config.ssl_options = { redirect: { exclude: ->(request) { request.path == "/up" } } }

  config.log_tags = [ :request_id ]
  config.logger   = ActiveSupport::TaggedLogging.logger(STDOUT)
  config.log_level = ENV.fetch("RAILS_LOG_LEVEL", "info")

  config.silence_healthcheck_path = "/up"
  config.active_support.report_deprecations = false

  config.i18n.fallbacks = true
  config.active_record.dump_schema_after_migration = false
  config.active_record.attributes_for_inspect = [ :id ]

  config.hosts << "api.fukuoka-asobi.com"
  config.hosts << "www.fukuoka-asobi.com"
  config.hosts << "fukuoka-asobi.com"

  # 👍 /up は HostAuthorization もスキップ
  config.host_authorization = {
    exclude: ->(request) { request.path == "/up" }
  }

  app_host = ENV.fetch("APP_HOST", "example.com")
  config.action_mailer.default_url_options = { host: app_host, protocol: "https" }
  asset_host_for_urls = ENV["ASSET_HOST"].presence || app_host
  config.active_storage.default_url_options = { host: asset_host_for_urls, protocol: "https" }
end
