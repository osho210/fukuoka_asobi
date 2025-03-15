class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :username, null: false
      t.string :profile_image_url
      t.text :bio
      t.string :role, default: 'ユーザー'
      t.string :email, null: false
      t.string :password_hash
      t.string :instagram_url
      t.boolean :is_paid_member, default: false
      t.date :paid_start_date
      t.date :paid_end_date

      t.timestamps
    end
  end
end
