class CreateConsentRequests < ActiveRecord::Migration[8.0]
  def change
    create_table :consent_requests do |t|
      t.references :spot, null: false, foreign_key: true
      t.string :consenter_type, null: false # STORE or INSTAGRAM_USER
      t.string :consenter_display_name, null: false
      t.string :contact_hint # Instagram account, email, phone, etc.
      t.string :status, default: 'DRAFT', null: false # DRAFT, SENT, APPROVED, REJECTED, REVOKED, EXPIRED
      t.string :token, null: false
      t.datetime :expires_at
      t.text :message_template
      t.integer :created_by # admin user_id
      t.timestamps
    end

    add_index :consent_requests, :token, unique: true
    add_index :consent_requests, :status
    add_index :consent_requests, :spot_id
  end
end
