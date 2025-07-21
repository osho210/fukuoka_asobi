class CreateMagazines < ActiveRecord::Migration[8.0]
  def change
    create_table :magazines do |t|
      t.string :name, null: false
      t.date :release_date
      t.string :sales_info
      t.string :sales_url
      t.string :publisher
      t.string :issue_number
      t.string :cover_image_url
      t.text :description
      t.string :status, null: false, default: 'draft'

      t.timestamps
    end
  end
end
