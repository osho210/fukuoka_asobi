# frozen_string_literal: true

module PlanGeneration
  # スポットの選定処理を担当するサービスクラス
  # スコア付きスポットから、指定された数のスポットを選択する
  class SpotSelectionService
    # スポット選定処理を実行
    # @param scored_spots [Array<Hash>] スコア付きスポット情報の配列
    # @param custom_options [Hash] カスタムオプション
    # @return [Array<Spot>] 選定されたスポットの配列
    # @raise [InsufficientSpotsError] 必要なスポット数が確保できない場合
    def self.select(scored_spots, custom_options: {})
      # スポット数を決定（カスタムオプションで指定、なければデフォルト3）
      spot_count = determine_spot_count(custom_options)

      # スポットが不足している場合はエラー
      if scored_spots.size < spot_count
        raise InsufficientSpotsError.new(
          required_count: spot_count,
          found_count: scored_spots.size
        )
      end

      # スコアの高い順に指定数選択
      selected = scored_spots.take(spot_count)

      # 選択されたスポットを返す
      selected.map { |item| item[:spot] }
    end

    # スポット数を決定
    # @param custom_options [Hash] カスタムオプション
    # @return [Integer] スポット数（1〜10の範囲）
    def self.determine_spot_count(custom_options)
      spot_count = custom_options[:spot_count] || custom_options['spot_count'] || 3

      # 最小1、最大10に制限
      [[spot_count.to_i, 1].max, 10].min
    end

    private_class_method :determine_spot_count
  end
end
