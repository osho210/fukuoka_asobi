# frozen_string_literal: true

require 'net/http'
require 'json'
require 'uri'

module HeartRails
  # HeartRails Express API と通信して最寄駅情報を取得するサービスクラス
  class StationService
    BASE_URL = 'https://express.heartrails.com/api/json'

    # @param latitude [Float] 緯度
    # @param longitude [Float] 経度
    def initialize(latitude, longitude)
      @latitude = latitude
      @longitude = longitude
    end

    # 最寄駅の駅名を取得する
    #
    # @return [String, nil] 最寄駅の駅名。取得失敗時は nil
    def fetch_nearest_station
      uri = build_uri
      response = Net::HTTP.get_response(uri)

      return nil unless response.is_a?(Net::HTTPSuccess)

      json_response = JSON.parse(response.body)
      stations = json_response.dig('response', 'station')

      return nil if stations.blank?

      stations.first['name']
    rescue JSON::ParserError, NoMethodError => e
      Rails.logger.error "HeartRails API Error: #{e.message}"
      nil
    end

    private

    def build_uri
      uri = URI(BASE_URL)
      uri.query = URI.encode_www_form({ method: 'getStations', y: @latitude, x: @longitude })
      uri
    end
  end
end
