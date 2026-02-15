class CreateConsentRequests < ActiveRecord::Migration[8.0]
  def change
    drop_table :consent_requests, if_exists: true

    create_table :consent_requests do |t|
      t.references :spot, null: false, foreign_key: true
      t.string :consenter_type, null: false
      t.string :consenter_display_name, null: false
      t.string :contact_hint
      t.string :status, default: 'DRAFT', null: false
      t.string :token, null: false
      t.datetime :expires_at
      t.text :message_template
      t.integer :created_by
      t.timestamps
    end

    add_index :consent_requests, :token, unique: true
    add_index :consent_requests, :status
  end
end