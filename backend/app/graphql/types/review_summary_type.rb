module Types
  class ReviewSummaryType < Types::BaseObject
    field :text, String, null: true
    field :flag_content_uri, String, null: true
    field :disclosure_text, String, null: true
    field :reviews_uri, String, null: true
  end
end
