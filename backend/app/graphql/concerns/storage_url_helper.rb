# frozen_string_literal: true

# ストレージURLを環境に応じて適切なURLに変換するヘルパーモジュール
module StorageUrlHelper
  # 内部URLを公開URLに変換
  #
  # @param url [String] 変換対象のURL
  # @return [String] 変換後のURL
  # @example
  #   convert_storage_url("http://minio:9000/path/to/image.jpg")
  #   # => "http://localhost:9000/path/to/image.jpg" (開発環境)
  #   # => "https://assets.fukuoka-asobi.com/path/to/image.jpg" (本番環境)
  def convert_storage_url(url)
    return url unless url

    internal_url = ENV.fetch("STORAGE_INTERNAL_URL", "http://minio:9000")
    public_url = ENV.fetch("STORAGE_PUBLIC_URL", "http://localhost:9000")

    url.gsub(internal_url, public_url)
  end
end
