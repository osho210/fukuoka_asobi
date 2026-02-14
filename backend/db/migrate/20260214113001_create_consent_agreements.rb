class CreateConsentAgreements < ActiveRecord::Migration[8.0]
  def change
    create_table :consent_agreements do |t|
      t.references :consent_request, null: false, foreign_key: true
      t.datetime :agreed_at, null: false
      t.string :agreement_version, null: false # e.g., "v1.0"
      t.text :agreement_snapshot_json, null: false # JSON snapshot of terms
      t.string :signer_name, null: false
      t.string :signer_instagram
      t.string :photographer_name
      t.boolean :tag_store_requested, default: false
      t.boolean :tag_photographer_requested, default: false
      t.string :tag_accounts_text
      t.boolean :rights_confirmed, null: false, default: true
      t.string :ip_address
      t.string :user_agent
      t.timestamps
    end

    add_index :consent_agreements, :consent_request_id
    add_index :consent_agreements, :agreed_at
  end
end
