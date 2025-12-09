# frozen_string_literal: true

module Validators
  # 検索パラメータのバリデーションを行うサービスクラス
  # 必須項目、範囲、型チェックを実施し、エラー時は InvalidSearchParametersError を発生させる
  class SearchParamsValidator
    # バリデーションを実行
    # @param districts [Array<String|Integer>] 地区ID または slug の配列
    # @param date [String] 検索対象日（YYYY-MM-DD形式）
    # @param member_info [Hash] メンバー情報（recommend_users など）
    # @param budget [Hash] 予算情報（min, max）
    # @param start_time [String, nil] 開始時刻（HH:MM形式）
    # @param end_time [String, nil] 終了時刻（HH:MM形式）
    # @param custom_options [Hash, nil] カスタムオプション
    # @raise [InvalidSearchParametersError] バリデーションエラーが発生した場合
    def self.validate!(districts:, date:, member_info:, budget:, start_time: nil, end_time: nil, custom_options: nil)
      errors = {}

      # 日付のバリデーション
      date_errors = validate_date(date)
      errors[:date] = date_errors if date_errors.any?

      # 地区のバリデーション
      district_errors = validate_districts(districts)
      errors[:districts] = district_errors if district_errors.any?

      # メンバー情報のバリデーション
      member_info_errors = validate_member_info(member_info)
      errors[:member_info] = member_info_errors if member_info_errors.any?

      # 予算のバリデーション
      budget_errors = validate_budget(budget)
      errors[:budget] = budget_errors if budget_errors.any?

      # 時刻のバリデーション
      time_errors = validate_time(date, start_time, end_time)
      errors.merge!(time_errors) if time_errors.any?

      # カスタムオプションのバリデーション
      if custom_options.present?
        custom_options_errors = validate_custom_options(custom_options)
        errors[:custom_options] = custom_options_errors if custom_options_errors.any?
      end

      # エラーがある場合は例外を発生
      raise InvalidSearchParametersError.new(details: errors) if errors.any?

      true
    end

    # 日付のバリデーション
    # @param date [String] 検索対象日
    # @return [Array<String>] エラーメッセージの配列
    def self.validate_date(date)
      errors = []

      if date.blank?
        errors << I18n.t('errors.validation.date.required')
        return errors
      end

      begin
        parsed_date = Date.parse(date)
        if parsed_date < Date.today
          errors << I18n.t('errors.validation.date.past_date')
        end
      rescue ArgumentError
        errors << I18n.t('errors.validation.date.invalid')
      end

      errors
    end

    # 地区のバリデーション
    # @param districts [Array] 地区ID または slug の配列
    # @return [Array<String>] エラーメッセージの配列
    def self.validate_districts(districts)
      errors = []

      if districts.blank? || !districts.is_a?(Array) || districts.empty?
        errors << I18n.t('errors.validation.districts.required')
        return errors
      end

      # 地区IDまたはslugが有効かチェック
      invalid_districts = districts.reject do |district_identifier|
        if StringUtils.numeric_string?(district_identifier)
          District.exists?(id: district_identifier)
        else
          District.exists?(slug: district_identifier)
        end
      end

      if invalid_districts.any?
        errors << I18n.t('errors.validation.districts.invalid')
      end

      errors
    end

    # メンバー情報のバリデーション
    # @param member_info [Hash] メンバー情報
    # @return [Array<String>] エラーメッセージの配列
    def self.validate_member_info(member_info)
      errors = []

      if member_info.blank? || !member_info.is_a?(Hash)
        errors << I18n.t('errors.validation.member_info.required')
        return errors
      end

      recommend_users = member_info[:recommend_users] || member_info['recommend_users']
      if recommend_users.blank? || !recommend_users.is_a?(Array) || recommend_users.empty?
        errors << I18n.t('errors.validation.member_info.required')
      end

      errors
    end

    # 予算のバリデーション
    # @param budget [Hash] 予算情報（min, max）
    # @return [Array<String>] エラーメッセージの配列
    def self.validate_budget(budget)
      errors = []

      if budget.blank? || !budget.is_a?(Hash)
        errors << I18n.t('errors.validation.budget.required')
        return errors
      end

      min = budget[:min] || budget['min']
      max = budget[:max] || budget['max']

      if min.nil? || max.nil?
        errors << I18n.t('errors.validation.budget.required')
        return errors
      end

      # 数値であることを確認
      begin
        min_value = Float(min)
        max_value = Float(max)

        if min_value < 0 || max_value < 0
          errors << I18n.t('errors.validation.budget.invalid_range')
        elsif min_value > max_value
          errors << I18n.t('errors.validation.budget.min_greater_than_max')
        end
      rescue ArgumentError, TypeError
        errors << I18n.t('errors.validation.budget.required')
      end

      errors
    end

    # 時刻のバリデーション
    # @param date [String] 検索対象日
    # @param start_time [String, nil] 開始時刻
    # @param end_time [String, nil] 終了時刻
    # @return [Hash] フィールド名とエラーメッセージのハッシュ
    def self.validate_time(date, start_time, end_time)
      errors = {}

      # 開始時刻と終了時刻が両方指定されている場合のみチェック
      if start_time.present? && end_time.present?
        begin
          start_datetime = Time.parse("#{date} #{start_time}")
          end_datetime = Time.parse("#{date} #{end_time}")

          if end_datetime <= start_datetime
            errors[:time] = [I18n.t('errors.validation.time.end_before_start')]
          end
        rescue ArgumentError
          errors[:time] = [I18n.t('errors.validation.time.invalid_format')]
        end
      end

      errors
    end

    # カスタムオプションのバリデーション
    # @param custom_options [Hash] カスタムオプション
    # @return [Array<String>] エラーメッセージの配列
    def self.validate_custom_options(custom_options)
      errors = []

      # スポット数のバリデーション
      spot_count = custom_options[:spot_count] || custom_options['spot_count']
      if spot_count.present?
        begin
          count = Integer(spot_count)
          if count < 1 || count > 10
            errors << I18n.t('errors.validation.custom_options.spot_count_invalid')
          end
        rescue ArgumentError, TypeError
          errors << I18n.t('errors.validation.custom_options.spot_count_invalid')
        end
      end

      errors
    end

    private_class_method :validate_date, :validate_districts, :validate_member_info,
                         :validate_budget, :validate_time, :validate_custom_options
  end
end
