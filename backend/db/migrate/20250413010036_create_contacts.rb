class CreateContacts < ActiveRecord::Migration[8.0]
  def change
    create_table :contacts do |t|
      t.string :email, null: false
      t.string :subject, null: false
      t.string :inquiry_type, null: false
      t.text :message, null: false
      t.boolean :privacy_policy, null: false, default: false

      t.timestamps
    end
  end
end
