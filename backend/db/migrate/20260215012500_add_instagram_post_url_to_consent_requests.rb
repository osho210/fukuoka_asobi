class AddInstagramPostUrlToConsentRequests < ActiveRecord::Migration[8.0]
  def change
    add_column :consent_requests, :instagram_post_url, :string
  end
end
