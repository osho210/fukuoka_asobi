class AddGooglePlacesFieldsToSpots < ActiveRecord::Migration[8.0]
  def up
    # Google Places API関連フィールド（既存フィールドと重複しないもののみ）
    add_column :spots, :google_place_id, :string
    add_index :spots, :google_place_id

    # ENUM フィールド
    execute <<-SQL
      ALTER TABLE spots
      ADD COLUMN business_status ENUM(
        'BUSINESS_STATUS_UNSPECIFIED',
        'OPERATIONAL',
        'CLOSED_TEMPORARILY',
        'CLOSED_PERMANENTLY'
      ) DEFAULT 'BUSINESS_STATUS_UNSPECIFIED'
    SQL

    execute <<-SQL
      ALTER TABLE spots
      ADD COLUMN price_level ENUM(
        'PRICE_LEVEL_UNSPECIFIED',
        'PRICE_LEVEL_FREE',
        'PRICE_LEVEL_INEXPENSIVE',
        'PRICE_LEVEL_MODERATE',
        'PRICE_LEVEL_EXPENSIVE',
        'PRICE_LEVEL_VERY_EXPENSIVE'
      ) DEFAULT 'PRICE_LEVEL_UNSPECIFIED'
    SQL

    add_index :spots, :business_status
    add_index :spots, :price_level

    # 位置情報（spotsテーブルにはまだ緯度経度がない）
    add_column :spots, :latitude, :decimal, precision: 10, scale: 7
    add_column :spots, :longitude, :decimal, precision: 10, scale: 7
    add_index :spots, [:latitude, :longitude]

    # スポットタイプ情報
    add_column :spots, :google_types, :text # JSON配列として保存
    add_column :spots, :primary_type, :string
    add_column :spots, :primary_type_display_name, :string
    add_index :spots, :primary_type

    # 住所情報（既存のaddressと併用）
    add_column :spots, :international_phone_number, :string
    add_column :spots, :short_formatted_address, :string
    add_column :spots, :adr_format_address, :text

    # Google関連URI
    add_column :spots, :google_maps_uri, :string
    add_column :spots, :icon_mask_base_uri, :string
    add_column :spots, :icon_background_color, :string

    # 時間・タイムゾーン
    add_column :spots, :time_zone_id, :string
    add_column :spots, :time_zone_display_name, :string
    add_column :spots, :utc_offset_minutes, :integer
    add_index :spots, :time_zone_id

    # テキストフィールド
    add_column :spots, :generative_summary, :text
    add_column :spots, :editorial_summary, :text

    # 価格帯情報
    add_column :spots, :price_range_start_amount, :decimal, precision: 10, scale: 2
    add_column :spots, :price_range_start_currency, :string, limit: 3
    add_column :spots, :price_range_end_amount, :decimal, precision: 10, scale: 2
    add_column :spots, :price_range_end_currency, :string, limit: 3

    # レビューサマリー
    add_column :spots, :review_summary_text, :text
    add_column :spots, :review_summary_flag_content_uri, :string, limit: 500
    add_column :spots, :review_summary_disclosure_text, :text
    add_column :spots, :review_summary_reviews_uri, :string, limit: 500

    # 決済オプション
    add_column :spots, :accepts_credit_cards, :boolean, default: false
    add_column :spots, :accepts_debit_cards, :boolean, default: false
    add_column :spots, :accepts_cash_only, :boolean, default: false
    add_column :spots, :accepts_nfc, :boolean, default: false

    # 駐車場オプション（既存のparking_availableと併用）
    add_column :spots, :free_parking_lot, :boolean, default: false
    add_column :spots, :paid_parking_lot, :boolean, default: false
    add_column :spots, :free_street_parking, :boolean, default: false
    add_column :spots, :paid_street_parking, :boolean, default: false
    add_column :spots, :valet_parking, :boolean, default: false
    add_column :spots, :free_garage_parking, :boolean, default: false
    add_column :spots, :paid_garage_parking, :boolean, default: false

    # サービス提供情報
    add_column :spots, :takeout, :boolean, default: false
    add_column :spots, :delivery, :boolean, default: false
    add_column :spots, :dine_in, :boolean, default: false
    add_column :spots, :curbside_pickup, :boolean, default: false
    add_column :spots, :reservable, :boolean, default: false
    add_column :spots, :serves_breakfast, :boolean, default: false
    add_column :spots, :serves_lunch, :boolean, default: false
    add_column :spots, :serves_dinner, :boolean, default: false
    add_column :spots, :serves_brunch, :boolean, default: false
    add_column :spots, :serves_beer, :boolean, default: false
    add_column :spots, :serves_wine, :boolean, default: false
    add_column :spots, :serves_vegetarian_food, :boolean, default: false
    add_column :spots, :outdoor_seating, :boolean, default: false
    add_column :spots, :live_music, :boolean, default: false
    add_column :spots, :menu_for_children, :boolean, default: false
    add_column :spots, :serves_cocktails, :boolean, default: false
    add_column :spots, :serves_dessert, :boolean, default: false
    add_column :spots, :serves_coffee, :boolean, default: false
    add_column :spots, :good_for_children, :boolean, default: false
    add_column :spots, :allows_dogs, :boolean, default: false
    add_column :spots, :restroom, :boolean, default: false
    add_column :spots, :good_for_groups, :boolean, default: false
    add_column :spots, :good_for_watching_sports, :boolean, default: false

    # その他
    add_column :spots, :pure_service_area_business, :boolean, default: false

    # API連携管理
    add_column :spots, :last_api_sync_at, :datetime
    add_column :spots, :api_sync_status, :string, limit: 50, default: 'pending'
    add_index :spots, :api_sync_status
  end

  def down
    # インデックスを削除
    remove_index :spots, :google_place_id if index_exists?(:spots, :google_place_id)
    remove_index :spots, :business_status if index_exists?(:spots, :business_status)
    remove_index :spots, :price_level if index_exists?(:spots, :price_level)
    remove_index :spots, [:latitude, :longitude] if index_exists?(:spots, [:latitude, :longitude])
    remove_index :spots, :primary_type if index_exists?(:spots, :primary_type)
    remove_index :spots, :time_zone_id if index_exists?(:spots, :time_zone_id)
    remove_index :spots, :api_sync_status if index_exists?(:spots, :api_sync_status)

    # カラムを削除
    remove_column :spots, :google_place_id
    remove_column :spots, :business_status
    remove_column :spots, :price_level
    remove_column :spots, :latitude
    remove_column :spots, :longitude
    remove_column :spots, :google_types
    remove_column :spots, :primary_type
    remove_column :spots, :primary_type_display_name
    remove_column :spots, :international_phone_number
    remove_column :spots, :short_formatted_address
    remove_column :spots, :adr_format_address
    remove_column :spots, :google_maps_uri
    remove_column :spots, :icon_mask_base_uri
    remove_column :spots, :icon_background_color
    remove_column :spots, :time_zone_id
    remove_column :spots, :time_zone_display_name
    remove_column :spots, :utc_offset_minutes
    remove_column :spots, :generative_summary
    remove_column :spots, :editorial_summary

    # 価格帯情報
    remove_column :spots, :price_range_start_amount
    remove_column :spots, :price_range_start_currency
    remove_column :spots, :price_range_end_amount
    remove_column :spots, :price_range_end_currency

    # レビューサマリー
    remove_column :spots, :review_summary_text
    remove_column :spots, :review_summary_flag_content_uri
    remove_column :spots, :review_summary_disclosure_text
    remove_column :spots, :review_summary_reviews_uri

    # 決済オプション
    remove_column :spots, :accepts_credit_cards
    remove_column :spots, :accepts_debit_cards
    remove_column :spots, :accepts_cash_only
    remove_column :spots, :accepts_nfc

    # 駐車場オプション
    remove_column :spots, :free_parking_lot
    remove_column :spots, :paid_parking_lot
    remove_column :spots, :free_street_parking
    remove_column :spots, :paid_street_parking
    remove_column :spots, :valet_parking
    remove_column :spots, :free_garage_parking
    remove_column :spots, :paid_garage_parking

    # サービス提供情報
    remove_column :spots, :takeout
    remove_column :spots, :delivery
    remove_column :spots, :dine_in
    remove_column :spots, :curbside_pickup
    remove_column :spots, :reservable
    remove_column :spots, :serves_breakfast
    remove_column :spots, :serves_lunch
    remove_column :spots, :serves_dinner
    remove_column :spots, :serves_brunch
    remove_column :spots, :serves_beer
    remove_column :spots, :serves_wine
    remove_column :spots, :serves_vegetarian_food
    remove_column :spots, :outdoor_seating
    remove_column :spots, :live_music
    remove_column :spots, :menu_for_children
    remove_column :spots, :serves_cocktails
    remove_column :spots, :serves_dessert
    remove_column :spots, :serves_coffee
    remove_column :spots, :good_for_children
    remove_column :spots, :allows_dogs
    remove_column :spots, :restroom
    remove_column :spots, :good_for_groups
    remove_column :spots, :good_for_watching_sports

    # その他
    remove_column :spots, :pure_service_area_business

    # API連携管理
    remove_column :spots, :last_api_sync_at
    remove_column :spots, :api_sync_status
  end
end
