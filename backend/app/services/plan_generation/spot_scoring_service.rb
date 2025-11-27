# frozen_string_literal: true

module PlanGeneration
  # スポットのスコアリング処理を担当するサービスクラス
  # レビュー評価、テーマ適合度、カテゴリ適合度、雨天対応、予算適合度、
  # メンバー適合度などを基にスコアを計算し、高い順にソートして返す
  class SpotScoringService
    # スコアリング処理を実行
    # @param spots [Array<Spot>] スコアリング対象のスポット配列
    # @param custom_options [Hash] カスタムオプション
    # @param member_info [Hash] メンバー情報
    # @return [Array<Hash>] スコア付きスポット情報の配列（{ spot: Spot, score: Integer }）
    #                       スコアの高い順にソート済み
    def self.score(spots, custom_options: {}, member_info: {})
      spots.map do |spot|
        score = calculate_score(spot, custom_options, member_info)
        { spot: spot, score: score }
      end.sort_by { |item| -item[:score] } # スコアの高い順にソート
    end

    # 個別スポットのスコアを計算
    # @param spot [Spot] スコアリング対象のスポット
    # @param custom_options [Hash] カスタムオプション
    # @param member_info [Hash] メンバー情報
    # @return [Integer] 計算されたスコア
    def self.calculate_score(spot, custom_options, member_info)
      score = 0

      # 基本スコア（レビュー評価）
      score += calculate_review_score(spot)

      # テーマ適合度
      score += calculate_theme_score(spot, custom_options)

      # カテゴリ適合度
      score += calculate_category_score(spot, custom_options)

      # 雨天対応スコア
      score += calculate_rainy_day_score(spot, custom_options)

      # 予算適合度
      score += calculate_budget_score(spot)

      # メンバー適合度
      score += calculate_member_score(spot, member_info)

      score
    end

    # レビュー評価によるスコアを計算
    # @param spot [Spot] スポット
    # @return [Integer] レビュースコア
    def self.calculate_review_score(spot)
      return 0 unless spot.review_rating

      # 評価が高いほど加点（最大50点）
      (spot.review_rating * 10).to_i
    end

    # テーマ適合度によるスコアを計算
    # @param spot [Spot] スポット
    # @param custom_options [Hash] カスタムオプション
    # @return [Integer] テーマスコア
    def self.calculate_theme_score(spot, custom_options)
      theme = custom_options[:theme] || custom_options['theme']
      return 0 if theme.blank?

      # テーマに合致する場合は大きく加点
      spot.theme == theme ? 30 : 0
    end

    # カテゴリ適合度によるスコアを計算
    # @param spot [Spot] スポット
    # @param custom_options [Hash] カスタムオプション
    # @return [Integer] カテゴリスコア
    def self.calculate_category_score(spot, custom_options)
      categories = custom_options[:categories] || custom_options['categories']
      return 0 if categories.blank? || !categories.is_a?(Array)

      spot_categories = spot.categories.pluck(:name)
      matching_categories = spot_categories & categories

      # マッチするカテゴリごとに加点（1カテゴリ=20点）
      matching_categories.size * 20
    end

    # 雨天対応によるスコアを計算
    # @param spot [Spot] スポット
    # @param custom_options [Hash] カスタムオプション
    # @return [Integer] 雨天対応スコア
    def self.calculate_rainy_day_score(spot, custom_options)
      rainy_day_option = custom_options[:rainy_day_option] || custom_options['rainy_day_option']
      return 0 unless rainy_day_option

      # 雨天対応の場合は加点
      spot.is_rainy_ok ? 15 : 0
    end

    # 予算適合度によるスコアを計算
    # @param spot [Spot] スポット
    # @return [Integer] 予算スコア
    def self.calculate_budget_score(spot)
      case spot.budget_range
      when "CHEAP"
        15 # 安い場合は加点
      when "EXPENSIVE"
        -10 # 高い場合は減点
      else
        0 # 普通の場合は変化なし
      end
    end

    # メンバー適合度によるスコアを計算
    # @param spot [Spot] スポット
    # @param member_info [Hash] メンバー情報
    # @return [Integer] メンバー適合スコア
    def self.calculate_member_score(spot, member_info)
      recommend_users = member_info[:recommend_users] || member_info['recommend_users']
      return 0 if recommend_users.blank? || !recommend_users.is_a?(Array)

      spot_recommended_fors = spot.recommended_fors.pluck(:id)
      matching_recommended_fors = spot_recommended_fors & recommend_users

      # マッチするおすすめ対象ごとに加点（1対象=25点）
      matching_recommended_fors.size * 25
    end

    private_class_method :calculate_score, :calculate_review_score, :calculate_theme_score,
                         :calculate_category_score, :calculate_rainy_day_score,
                         :calculate_budget_score, :calculate_member_score
  end
end
