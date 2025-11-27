# frozen_string_literal: true

module PlanGeneration
  # スポットのフィルタリング処理を担当するサービスクラス
  # 地区、営業時間、予算、カスタムオプション（テーマ、カテゴリー、雨天対応など）、
  # およびプレミアム検索条件によるフィルタリングを実行する
  class SpotFilterService
    # フィルタリング処理を実行
    # @param districts [Array<String|Integer>] 地区ID または slug の配列
    # @param date [Date] 検索対象日
    # @param start_time [Time] 開始時刻
    # @param end_time [Time] 終了時刻
    # @param budget [Hash] 予算情報（min, max）
    # @param custom_options [Hash] カスタムオプション
    # @param user [User, nil] 現在のユーザー（プレミアム機能の判定に使用）
    # @return [ActiveRecord::Relation] フィルタリングされたスポットのクエリ
    # @raise [StandardError] プレミアム機能を非課金ユーザーが使用した場合
    def self.filter(districts:, date:, start_time:, end_time:, budget:, custom_options: {}, user: nil)
      # 基本クエリ
      query = Spot.all

      # 地区によるフィルタリング
      query = filter_by_districts(query, districts)

      # 営業時間によるフィルタリング
      query = filter_by_opening_hours(query, date, start_time, end_time)

      # 予算によるフィルタリング
      query = filter_by_budget(query, budget)

      # カスタムオプションによるフィルタリング
      query = filter_by_custom_options(query, custom_options)

      # プレミアム検索条件によるフィルタリング
      query = filter_by_premium_options(query, custom_options, user)

      # 重複を除去して結果を返す
      query.distinct
    end

    # 地区によるフィルタリング
    # @param query [ActiveRecord::Relation] ベースクエリ
    # @param districts [Array<String|Integer>] 地区ID または slug の配列
    # @return [ActiveRecord::Relation] フィルタリング後のクエリ
    def self.filter_by_districts(query, districts)
      return query if districts.blank?

      # 数値IDとslugの両方に対応
      numeric_ids, slugs = districts.partition { |district_identifier| StringUtils.numeric_string?(district_identifier) }

      # 一度のクエリで全slug→idのマッピングを取得
      slug_to_id = {}
      if slugs.present?
        # Remove nils and duplicates just in case
        slugs = slugs.compact.uniq
        slug_to_id = District.where(slug: slugs).pluck(:slug, :id).to_h
      end

      district_ids = numeric_ids + slugs.map { |slug| slug_to_id[slug] }
      district_ids.compact!
      query.where(district_id: district_ids)
    end

    # 営業時間によるフィルタリング
    # @param query [ActiveRecord::Relation] ベースクエリ
    # @param date [Date] 検索対象日
    # @param start_time [Time] 開始時刻
    # @param end_time [Time] 終了時刻
    # @return [ActiveRecord::Relation] フィルタリング後のクエリ
    def self.filter_by_opening_hours(query, date, start_time, end_time)
      # 日本語の曜日に変換
      day_of_week_ja = date.strftime("%a")
      day_mapping = {
        'Sun' => '日',
        'Mon' => '月',
        'Tue' => '火',
        'Wed' => '水',
        'Thu' => '木',
        'Fri' => '金',
        'Sat' => '土'
      }
      day_of_week = day_mapping[day_of_week_ja]

      # 時刻をJSTに変換してから文字列化
      start_time_jst = start_time.in_time_zone('Asia/Tokyo')
      end_time_jst = end_time.in_time_zone('Asia/Tokyo')

      # 営業時間に一致するspot_idをサブクエリで取得
      # DBのopen_time/close_timeはTime型で保存されているため、Time型で比較
      valid_spot_ids = OpeningHour
        .where(day_of_week: day_of_week, is_closed_day: false)
        .where("open_time <= ? AND close_time >= ?", end_time_jst, start_time_jst)
        .select(:spot_id)

      # 既存のクエリ条件を保持しながら、営業時間に一致するスポットのみに絞る
      query.where(id: valid_spot_ids)
    end

    # 予算によるフィルタリング
    # 予算はスポット単位ではなくプラン全体で考慮するため、緩めのフィルタリングを実施
    # @param query [ActiveRecord::Relation] ベースクエリ
    # @param budget [Hash] 予算情報（min, max）
    # @return [ActiveRecord::Relation] フィルタリング後のクエリ
    def self.filter_by_budget(query, budget)
      max_budget = budget[:max] || budget['max']
      return query if max_budget.nil?

      if max_budget <= 5000
        query.where(budget_range: "CHEAP")
      elsif max_budget <= 15000
        query.where(budget_range: ["CHEAP", "AVERAGE"])
      else
        query
      end
    end

    # カスタムオプションによるフィルタリング
    # @param query [ActiveRecord::Relation] ベースクエリ
    # @param custom_options [Hash] カスタムオプション
    # @return [ActiveRecord::Relation] フィルタリング後のクエリ
    def self.filter_by_custom_options(query, custom_options)
      return query if custom_options.blank?

      # 雨天対応
      if custom_options[:rainy_day_option] || custom_options['rainy_day_option']
        query = query.where(is_rainy_ok: true)
      end

      # テーマ
      theme = custom_options[:theme] || custom_options['theme']
      if theme.present?
        query = query.where(theme: theme)
      end

      # カテゴリー
      categories = custom_options[:categories] || custom_options['categories']
      if categories.present? && categories.is_a?(Array) && categories.any?
        query = query.joins(:categories).where(categories: { name: categories })
      end

      query
    end

    # プレミアム検索条件によるフィルタリング
    # @param query [ActiveRecord::Relation] ベースクエリ
    # @param custom_options [Hash] カスタムオプション
    # @param user [User, nil] 現在のユーザー
    # @return [ActiveRecord::Relation] フィルタリング後のクエリ
    # @raise [PlanGenerationError] プレミアム機能を非課金ユーザーが使用した場合
    def self.filter_by_premium_options(query, custom_options, user)
      return query if custom_options.blank?

      premium_options_used = false

      # アクセシビリティオプション
      if custom_options[:accessibility_options].present?
        premium_options_used = true
        # TODO: accessibility_optionsテーブルとの関連付けが必要
        # 現時点では実装スキップ（将来的に実装）
      end

      # 決済手段
      if custom_options[:accepts_credit_cards]
        premium_options_used = true
        query = query.where(accepts_credit_cards: true)
      end

      if custom_options[:accepts_nfc]
        premium_options_used = true
        query = query.where(accepts_nfc: true)
      end

      if custom_options[:accepts_cash_only]
        premium_options_used = true
        query = query.where(accepts_cash_only: true)
      end

      # 飲食店オプション
      if custom_options[:serves_breakfast]
        premium_options_used = true
        query = query.where(serves_breakfast: true)
      end

      if custom_options[:serves_lunch]
        premium_options_used = true
        query = query.where(serves_lunch: true)
      end

      if custom_options[:serves_dinner]
        premium_options_used = true
        query = query.where(serves_dinner: true)
      end

      if custom_options[:serves_vegetarian_food]
        premium_options_used = true
        query = query.where(serves_vegetarian_food: true)
      end

      if custom_options[:outdoor_seating]
        premium_options_used = true
        query = query.where(outdoor_seating: true)
      end

      if custom_options[:good_for_children]
        premium_options_used = true
        query = query.where(good_for_children: true)
      end

      if custom_options[:allows_dogs]
        premium_options_used = true
        query = query.where(allows_dogs: true)
      end

      # その他のオプション
      if custom_options[:reservable]
        premium_options_used = true
        query = query.where(reservable: true)
      end

      if custom_options[:takeout]
        premium_options_used = true
        query = query.where(takeout: true)
      end

      if custom_options[:delivery]
        premium_options_used = true
        query = query.where(delivery: true)
      end

      # プレミアムオプションが使用されている場合、ユーザーが課金メンバーかチェック
      if premium_options_used && (user.nil? || !user.paid_member?)
        raise PlanGenerationError.new(
          I18n.t('errors.plan_generation.premium_required'),
          code: 'PREMIUM_REQUIRED'
        )
      end

      query
    end

    private_class_method :filter_by_districts, :filter_by_opening_hours, :filter_by_budget,
                         :filter_by_custom_options, :filter_by_premium_options
  end
end
