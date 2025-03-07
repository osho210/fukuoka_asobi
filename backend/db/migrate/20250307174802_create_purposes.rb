class CreatePurposes < ActiveRecord::Migration[8.0]
  def change
    create_table :purposes do |t|
      t.string :purpose_name, null: false, index: { unique: true }

      t.timestamps
    end
  end
end
