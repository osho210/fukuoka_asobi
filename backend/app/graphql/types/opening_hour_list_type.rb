# frozen_string_literal: true

module Types
  # NOTE: このファイルはGoogle Places APIのレスポンスを表現するために、
  #       opening_hour_period_detail_type.rb と opening_hour_period_type.rb をインラインで定義しています。
  #       もし他で再利用する場合は、ファイルを分割してください。

  class OpeningHourPeriodDetailType < Types::BaseObject
    description "営業時間の開始または終了の詳細"
    field :day, Integer, null: false, description: "曜日 (0=日曜, 6=土曜)"
    field :hour, Integer, null: false, description: "時 (0-23)"
    field :minute, Integer, null: false, description: "分 (0-59)"
  end

  class OpeningHourPeriodType < Types::BaseObject
    description "営業時間の期間"
    field :open, Types::OpeningHourPeriodDetailType, null: true, description: "開始時間"
    field :close, Types::OpeningHourPeriodDetailType, null: true, description: "終了時間"
  end

  class OpeningHourListType < Types::BaseObject
    description "Google Places APIの営業時間情報"
    field :open_now, Boolean, null: true, description: "現在営業中か"
    field :periods, [Types::OpeningHourPeriodType], null: true, description: "営業時間の期間リスト"
    field :weekday_descriptions, [String], null: true, description: "曜ごとの営業時間テキスト"
  end
end
