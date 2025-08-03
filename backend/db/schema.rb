# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_08_03_031932) do
  create_table "accessibility_options", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_accessibility_options_on_name", unique: true
  end

  create_table "active_storage_attachments", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "areas", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "area_name", null: false
    t.bigint "district_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.index ["area_name", "district_id"], name: "index_areas_on_area_name_and_district_id", unique: true
    t.index ["district_id"], name: "index_areas_on_district_id"
    t.index ["slug"], name: "index_areas_on_slug"
  end

  create_table "bookmarks", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.string "bookmarkable_type", null: false
    t.bigint "bookmarkable_id", null: false
    t.string "title"
    t.text "note"
    t.string "category"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["bookmarkable_type", "bookmarkable_id"], name: "index_bookmarks_on_bookmarkable"
    t.index ["user_id", "bookmarkable_type", "bookmarkable_id"], name: "index_bookmarks_on_user_and_bookmarkable", unique: true
    t.index ["user_id"], name: "index_bookmarks_on_user_id"
  end

  create_table "categories", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_categories_on_name", unique: true
  end

  create_table "contacts", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "email", null: false
    t.string "subject", null: false
    t.string "inquiry_type", null: false
    t.text "message", null: false
    t.boolean "privacy_policy", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "districts", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "district_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "slug"
    t.index ["district_name"], name: "index_districts_on_district_name", unique: true
    t.index ["slug"], name: "index_districts_on_slug", unique: true
  end

  create_table "event_categories", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "events", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.string "location"
    t.decimal "latitude", precision: 10, scale: 7
    t.decimal "longitude", precision: 10, scale: 7
    t.datetime "start_datetime"
    t.datetime "end_datetime"
    t.string "recurring_rule"
    t.bigint "event_category_id", null: false
    t.string "price"
    t.string "organizer"
    t.string "contact_email"
    t.string "contact_phone"
    t.integer "capacity"
    t.string "status", default: "draft", null: false
    t.boolean "is_online", default: false
    t.string "source_url"
    t.string "banner_image"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_category_id"], name: "index_events_on_event_category_id"
  end

  create_table "favorites", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "user_id", null: false
    t.bigint "play_plan_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["play_plan_id"], name: "index_favorites_on_play_plan_id"
    t.index ["user_id", "play_plan_id"], name: "index_favorites_on_user_id_and_play_plan_id", unique: true
    t.index ["user_id"], name: "index_favorites_on_user_id"
  end

  create_table "hashtags", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "hashtag_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["hashtag_name"], name: "index_hashtags_on_hashtag_name", unique: true
  end

  create_table "instagram_embeds", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "instagram_embed_name", null: false
    t.string "embed_code", null: false
    t.string "embed_url", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["instagram_embed_name"], name: "index_instagram_embeds_on_instagram_embed_name", unique: true
  end

  create_table "magazines", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.date "release_date"
    t.string "sales_info"
    t.text "sales_url"
    t.string "publisher"
    t.string "issue_number"
    t.text "cover_image_url"
    t.text "description"
    t.string "status", default: "draft", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "menu_categories", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_menu_categories_on_name", unique: true
  end

  create_table "menus", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "menu_name", null: false
    t.decimal "price", precision: 10, scale: 2
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "menu_category_id", null: false
    t.index ["menu_category_id"], name: "index_menus_on_menu_category_id"
    t.index ["menu_name"], name: "index_menus_on_menu_name"
  end

  create_table "news", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "title", null: false
    t.text "body", null: false
    t.datetime "published_at"
    t.string "status", default: "draft", null: false
    t.string "image_url"
    t.bigint "author_id"
    t.bigint "category_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["author_id"], name: "index_news_on_author_id"
    t.index ["category_id"], name: "index_news_on_category_id"
  end

  create_table "opening_hours", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "spot_id", null: false
    t.string "day_of_week", null: false
    t.time "open_time", null: false
    t.time "close_time", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.boolean "is_closed_day", default: false, null: false
    t.text "google_opening_hours_data"
    t.string "opening_hours_type", default: "regular"
    t.index ["opening_hours_type"], name: "index_opening_hours_on_opening_hours_type"
    t.index ["spot_id", "day_of_week", "open_time"], name: "index_opening_hours_on_spot_day_and_open_time", unique: true
    t.index ["spot_id"], name: "index_opening_hours_on_spot_id"
  end

  create_table "plan_details", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "plan_id", null: false
    t.integer "step_number", null: false
    t.string "step_name", null: false
    t.text "step_description"
    t.integer "spot_id"
    t.text "comment"
    t.datetime "start_datetime"
    t.datetime "end_datetime"
    t.decimal "budget", precision: 10, scale: 2
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "planner_title"
    t.text "planner_description"
  end

  create_table "play_plan_recommended_fors", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "play_plan_id"
    t.integer "recommended_for_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["play_plan_id", "recommended_for_id"], name: "index_play_plan_recommended_fors_unique", unique: true
    t.index ["play_plan_id"], name: "index_play_plan_recommended_fors_on_play_plan_id"
    t.index ["recommended_for_id"], name: "index_play_plan_recommended_fors_on_recommended_for_id"
  end

  create_table "play_plans", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.integer "user_id"
    t.string "plan_name", null: false
    t.datetime "start_datetime"
    t.datetime "end_datetime"
    t.text "description"
    t.integer "status", default: 0, null: false
    t.integer "favorite_count", default: 0
    t.decimal "rating", precision: 3, scale: 2, default: "0.0"
    t.integer "review_count", default: 0
    t.string "image_url"
    t.string "tags"
    t.string "location"
    t.datetime "published_at"
    t.integer "trip_type", default: 0, null: false
    t.decimal "total_budget", precision: 10, scale: 2
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "planner_title"
    t.text "planner_description"
  end

  create_table "purposes", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "purpose_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["purpose_name"], name: "index_purposes_on_purpose_name", unique: true
  end

  create_table "recommended_fors", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "spot_accessibility_options", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "spot_id", null: false
    t.bigint "accessibility_option_id", null: false
    t.boolean "available", default: true
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["accessibility_option_id"], name: "index_spot_accessibility_options_on_accessibility_option_id"
    t.index ["spot_id", "accessibility_option_id"], name: "index_spot_accessibility_unique", unique: true
    t.index ["spot_id"], name: "index_spot_accessibility_options_on_spot_id"
  end

  create_table "spot_ambiance_relations", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "spot_id", null: false
    t.bigint "spot_ambiance_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["spot_ambiance_id"], name: "index_spot_ambiance_relations_on_spot_ambiance_id"
    t.index ["spot_id", "spot_ambiance_id"], name: "index_store_ambiance_relations_on_store_and_ambiance", unique: true
    t.index ["spot_id"], name: "index_spot_ambiance_relations_on_spot_id"
  end

  create_table "spot_ambiances", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "ambiance_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["ambiance_name"], name: "index_spot_ambiances_on_ambiance_name", unique: true
  end

  create_table "spot_areas", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "spot_id", null: false
    t.bigint "area_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["area_id"], name: "index_spot_areas_on_area_id"
    t.index ["spot_id", "area_id"], name: "index_spot_areas_on_spot_id_and_area_id", unique: true
    t.index ["spot_id"], name: "index_spot_areas_on_spot_id"
  end

  create_table "spot_categories", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "spot_id", null: false
    t.bigint "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_spot_categories_on_category_id"
    t.index ["spot_id", "category_id"], name: "index_spot_categories_on_spot_id_and_category_id", unique: true
    t.index ["spot_id"], name: "index_spot_categories_on_spot_id"
  end

  create_table "spot_hashtags", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "spot_id", null: false
    t.bigint "hashtag_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["hashtag_id"], name: "index_spot_hashtags_on_hashtag_id"
    t.index ["spot_id", "hashtag_id"], name: "index_spot_hashtags_on_spot_id_and_hashtag_id", unique: true
    t.index ["spot_id"], name: "index_spot_hashtags_on_spot_id"
  end

  create_table "spot_instagram_embeds", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "spot_id", null: false
    t.bigint "instagram_embed_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["instagram_embed_id"], name: "index_spot_instagram_embeds_on_instagram_embed_id"
    t.index ["spot_id", "instagram_embed_id"], name: "index_store_instagram_embeds_on_store_and_instagram_embed", unique: true
    t.index ["spot_id"], name: "index_spot_instagram_embeds_on_spot_id"
  end

  create_table "spot_magazines", id: false, charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "spot_id", null: false
    t.bigint "magazine_id", null: false
    t.string "publication_feature"
    t.integer "page_number"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["magazine_id"], name: "index_spot_magazines_on_magazine_id"
    t.index ["spot_id", "magazine_id"], name: "index_spot_magazines_on_spot_id_and_magazine_id", unique: true
    t.index ["spot_id"], name: "index_spot_magazines_on_spot_id"
  end

  create_table "spot_menus", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "spot_id", null: false
    t.bigint "menu_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["menu_id"], name: "index_spot_menus_on_menu_id"
    t.index ["spot_id", "menu_id"], name: "index_spot_menus_on_spot_id_and_menu_id", unique: true
    t.index ["spot_id"], name: "index_spot_menus_on_spot_id"
  end

  create_table "spot_photos", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "spot_id", null: false
    t.string "photo_reference", limit: 500, null: false
    t.integer "width"
    t.integer "height"
    t.text "html_attributions"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["photo_reference"], name: "index_spot_photos_on_photo_reference"
    t.index ["spot_id", "photo_reference"], name: "index_spot_photos_on_spot_id_and_photo_reference", unique: true
    t.index ["spot_id"], name: "index_spot_photos_on_spot_id"
  end

  create_table "spot_purposes", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "spot_id", null: false
    t.bigint "purpose_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["purpose_id"], name: "index_spot_purposes_on_purpose_id"
    t.index ["spot_id", "purpose_id"], name: "index_spot_purposes_on_spot_id_and_purpose_id", unique: true
    t.index ["spot_id"], name: "index_spot_purposes_on_spot_id"
  end

  create_table "spots", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "district_id", null: false
    t.string "spot_name", null: false
    t.string "address"
    t.string "phone_number"
    t.string "website"
    t.string "catchphrase"
    t.string "recommended_for_1"
    t.string "recommended_for_2"
    t.boolean "parking_available", default: false
    t.string "nearest_station"
    t.decimal "review_rating", precision: 3, scale: 2, default: "0.0"
    t.integer "review_count", default: 0
    t.string "instagram_url"
    t.boolean "is_closed", default: false
    t.string "budget_range", default: "普通"
    t.integer "max_people"
    t.integer "min_people", default: 1
    t.boolean "is_rainy_ok", default: true
    t.string "theme"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "spot_type", default: "STORE", null: false
    t.string "image_url"
    t.string "google_place_id"
    t.column "business_status", "enum('BUSINESS_STATUS_UNSPECIFIED','OPERATIONAL','CLOSED_TEMPORARILY','CLOSED_PERMANENTLY')", default: "BUSINESS_STATUS_UNSPECIFIED"
    t.column "price_level", "enum('PRICE_LEVEL_UNSPECIFIED','PRICE_LEVEL_FREE','PRICE_LEVEL_INEXPENSIVE','PRICE_LEVEL_MODERATE','PRICE_LEVEL_EXPENSIVE','PRICE_LEVEL_VERY_EXPENSIVE')", default: "PRICE_LEVEL_UNSPECIFIED"
    t.decimal "latitude", precision: 10, scale: 7
    t.decimal "longitude", precision: 10, scale: 7
    t.text "google_types"
    t.string "primary_type"
    t.string "primary_type_display_name"
    t.string "international_phone_number"
    t.string "short_formatted_address"
    t.text "adr_format_address"
    t.string "google_maps_uri"
    t.string "icon_mask_base_uri"
    t.string "icon_background_color"
    t.string "time_zone_id"
    t.string "time_zone_display_name"
    t.integer "utc_offset_minutes"
    t.text "generative_summary"
    t.text "editorial_summary"
    t.decimal "price_range_start_amount", precision: 10, scale: 2
    t.string "price_range_start_currency", limit: 3
    t.decimal "price_range_end_amount", precision: 10, scale: 2
    t.string "price_range_end_currency", limit: 3
    t.text "review_summary_text"
    t.string "review_summary_flag_content_uri", limit: 500
    t.text "review_summary_disclosure_text"
    t.string "review_summary_reviews_uri", limit: 500
    t.boolean "accepts_credit_cards", default: false
    t.boolean "accepts_debit_cards", default: false
    t.boolean "accepts_cash_only", default: false
    t.boolean "accepts_nfc", default: false
    t.boolean "free_parking_lot", default: false
    t.boolean "paid_parking_lot", default: false
    t.boolean "free_street_parking", default: false
    t.boolean "paid_street_parking", default: false
    t.boolean "valet_parking", default: false
    t.boolean "free_garage_parking", default: false
    t.boolean "paid_garage_parking", default: false
    t.boolean "takeout", default: false
    t.boolean "delivery", default: false
    t.boolean "dine_in", default: false
    t.boolean "curbside_pickup", default: false
    t.boolean "reservable", default: false
    t.boolean "serves_breakfast", default: false
    t.boolean "serves_lunch", default: false
    t.boolean "serves_dinner", default: false
    t.boolean "serves_brunch", default: false
    t.boolean "serves_beer", default: false
    t.boolean "serves_wine", default: false
    t.boolean "serves_vegetarian_food", default: false
    t.boolean "outdoor_seating", default: false
    t.boolean "live_music", default: false
    t.boolean "menu_for_children", default: false
    t.boolean "serves_cocktails", default: false
    t.boolean "serves_dessert", default: false
    t.boolean "serves_coffee", default: false
    t.boolean "good_for_children", default: false
    t.boolean "allows_dogs", default: false
    t.boolean "restroom", default: false
    t.boolean "good_for_groups", default: false
    t.boolean "good_for_watching_sports", default: false
    t.boolean "pure_service_area_business", default: false
    t.datetime "last_api_sync_at"
    t.string "api_sync_status", limit: 50, default: "pending"
    t.index ["api_sync_status"], name: "index_spots_on_api_sync_status"
    t.index ["budget_range"], name: "index_spots_on_budget_range"
    t.index ["business_status"], name: "index_spots_on_business_status"
    t.index ["district_id"], name: "index_spots_on_district_id"
    t.index ["google_place_id"], name: "index_spots_on_google_place_id"
    t.index ["latitude", "longitude"], name: "index_spots_on_latitude_and_longitude"
    t.index ["price_level"], name: "index_spots_on_price_level"
    t.index ["primary_type"], name: "index_spots_on_primary_type"
    t.index ["spot_name"], name: "index_spots_on_spot_name"
    t.index ["spot_type"], name: "index_spots_on_spot_type"
    t.index ["theme"], name: "index_spots_on_theme"
    t.index ["time_zone_id"], name: "index_spots_on_time_zone_id"
  end

  create_table "stations", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.boolean "active"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "train_line", null: false
  end

  create_table "travel_details", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "plan_detail_id", null: false
    t.integer "sequence_number", null: false
    t.string "travel_method", null: false
    t.integer "travel_time"
    t.text "notes"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["plan_detail_id", "sequence_number"], name: "index_travel_details_on_plan_detail_id_and_sequence_number", unique: true
    t.index ["plan_detail_id"], name: "index_travel_details_on_plan_detail_id"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "username", null: false
    t.string "profile_image_url"
    t.text "bio"
    t.string "role", default: "ユーザー"
    t.string "email", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "instagram_url"
    t.boolean "is_paid_member", default: false
    t.date "paid_start_date"
    t.date "paid_end_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "gender", default: "prefer_not_to_say"
    t.boolean "terms_agreed", default: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "jti", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["jti"], name: "index_users_on_jti", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "areas", "districts"
  add_foreign_key "bookmarks", "users"
  add_foreign_key "events", "event_categories"
  add_foreign_key "favorites", "play_plans", on_delete: :cascade
  add_foreign_key "favorites", "users", on_delete: :cascade
  add_foreign_key "news", "categories"
  add_foreign_key "news", "users", column: "author_id"
  add_foreign_key "opening_hours", "spots"
  add_foreign_key "spot_accessibility_options", "accessibility_options"
  add_foreign_key "spot_accessibility_options", "spots"
  add_foreign_key "spot_ambiance_relations", "spot_ambiances"
  add_foreign_key "spot_ambiance_relations", "spots"
  add_foreign_key "spot_areas", "areas"
  add_foreign_key "spot_areas", "spots"
  add_foreign_key "spot_categories", "categories"
  add_foreign_key "spot_categories", "spots"
  add_foreign_key "spot_hashtags", "hashtags"
  add_foreign_key "spot_hashtags", "spots"
  add_foreign_key "spot_instagram_embeds", "instagram_embeds"
  add_foreign_key "spot_instagram_embeds", "spots"
  add_foreign_key "spot_magazines", "magazines"
  add_foreign_key "spot_magazines", "spots"
  add_foreign_key "spot_menus", "menus"
  add_foreign_key "spot_menus", "spots"
  add_foreign_key "spot_photos", "spots"
  add_foreign_key "spot_purposes", "purposes"
  add_foreign_key "spot_purposes", "spots"
  add_foreign_key "spots", "districts"
  add_foreign_key "travel_details", "plan_details"
end
