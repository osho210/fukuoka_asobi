module Mutations
  class SyncSpotWithGooglePlaces < BaseMutation
    description "Google Places APIとスポット情報を同期する"

    argument :spot_id, ID, required: true, description: "同期するスポットのID"
    argument :google_place_id, String, required: false, description: "Google Place ID（指定された場合はこのIDで同期）"
    argument :search_query, String, required: false, description: "検索クエリ（Place IDが指定されていない場合に使用）"

    field :spot, Types::SpotType, null: true, description: "同期されたスポット"
    field :errors, [String], null: false, description: "エラーメッセージ"
    field :success, Boolean, null: false, description: "同期が成功したかどうか"

    def resolve(input:)
      spot_id = input[:spot_id]
      google_place_id = input[:google_place_id]
      search_query = input[:search_query]
      # スポットを取得
      spot = Spot.find_by(id: spot_id)
      unless spot
        return {
          spot: nil,
          errors: ["スポットが見つかりません"],
          success: false
        }
      end

      # 同期サービスを初期化
      sync_service = SpotSyncService.new(spot)

      begin
        if google_place_id.present?
          # Google Place IDが指定されている場合は直接同期
          success = sync_service.sync_with_google_places(google_place_id)
        elsif search_query.present?
          # 検索クエリが指定されている場合は検索してから同期
          search_results = sync_service.search_and_sync(search_query)

          if search_results.empty?
            return {
              spot: spot,
              errors: ["検索結果が見つかりませんでした"],
              success: false
            }
          end

          # 最初の検索結果で同期
          first_result = search_results.first
          success = sync_service.sync_with_google_places(first_result[:place_id])
        else
          return {
            spot: spot,
            errors: ["Google Place IDまたは検索クエリのいずれかを指定してください"],
            success: false
          }
        end

        if success
          spot.reload
          {
            spot: spot,
            errors: [],
            success: true
          }
        else
          {
            spot: spot,
            errors: ["Google Places APIとの同期に失敗しました"],
            success: false
          }
        end

      rescue => e
        Rails.logger.error "Sync mutation error: #{e.message}"
        {
          spot: spot,
          errors: ["同期中にエラーが発生しました: #{e.message}"],
          success: false
        }
      end
    end
  end
end
