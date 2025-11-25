# frozen_string_literal: true

# 文字列が数値を表しているかチェックするユーティリティモジュール
module StringUtils
  # 文字列が整数を表しているかチェック
  # @param str [String, Integer, nil] チェック対象の文字列
  # @return [Boolean] 整数を表している場合はtrue
  # @example
  #   StringUtils.numeric_string?("123") #=> true
  #   StringUtils.numeric_string?("abc") #=> false
  #   StringUtils.numeric_string?(123) #=> true
  def self.numeric_string?(str)
    return true if str.is_a?(Integer)
    return false if str.nil? || !str.is_a?(String)

    str.match?(/\A\d+\z/)
  end
end
