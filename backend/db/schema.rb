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

ActiveRecord::Schema[8.0].define(version: 2025_03_20_071354) do
  create_table "areas", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "area_name", null: false
    t.bigint "district_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["area_name", "district_id"], name: "index_areas_on_area_name_and_district_id", unique: true
    t.index ["district_id"], name: "index_areas_on_district_id"
  end

  create_table "categories", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_categories_on_name", unique: true
  end

  create_table "districts", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "district_name", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["district_name"], name: "index_districts_on_district_name", unique: true
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
    t.integer "status", default: 0
    t.boolean "is_online", default: false
    t.string "source_url"
    t.string "banner_image"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["event_category_id"], name: "index_events_on_event_category_id"
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

  create_table "menus", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "menu_name", null: false
    t.decimal "price", precision: 10, scale: 2
    t.text "description"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["menu_name"], name: "index_menus_on_menu_name"
  end

  create_table "news", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "title", null: false
    t.text "body", null: false
    t.datetime "published_at"
    t.integer "status", default: 0, null: false
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
    t.index ["spot_id", "day_of_week"], name: "index_opening_hours_on_spot_id_and_day_of_week", unique: true
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

  create_table "spot_menus", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.bigint "spot_id", null: false
    t.bigint "menu_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["menu_id"], name: "index_spot_menus_on_menu_id"
    t.index ["spot_id", "menu_id"], name: "index_spot_menus_on_spot_id_and_menu_id", unique: true
    t.index ["spot_id"], name: "index_spot_menus_on_spot_id"
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
    t.index ["budget_range"], name: "index_spots_on_budget_range"
    t.index ["district_id"], name: "index_spots_on_district_id"
    t.index ["spot_name"], name: "index_spots_on_spot_name"
    t.index ["spot_type"], name: "index_spots_on_spot_type"
    t.index ["theme"], name: "index_spots_on_theme"
  end

  create_table "users", charset: "utf8mb4", collation: "utf8mb4_0900_ai_ci", force: :cascade do |t|
    t.string "username", null: false
    t.string "profile_image_url"
    t.text "bio"
    t.string "role", default: "ユーザー"
    t.string "email", null: false
    t.string "password_hash"
    t.string "instagram_url"
    t.boolean "is_paid_member", default: false
    t.date "paid_start_date"
    t.date "paid_end_date"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_foreign_key "areas", "districts"
  add_foreign_key "events", "event_categories"
  add_foreign_key "news", "categories"
  add_foreign_key "news", "users", column: "author_id"
  add_foreign_key "opening_hours", "spots"
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
  add_foreign_key "spot_menus", "menus"
  add_foreign_key "spot_menus", "spots"
  add_foreign_key "spot_purposes", "purposes"
  add_foreign_key "spot_purposes", "spots"
  add_foreign_key "spots", "districts"
end
