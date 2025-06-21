class ChangeDataStatusToNews < ActiveRecord::Migration[6.1]
  def change
    reversible do |dir|
      dir.up do
        change_column :news, :status, :string, null: false, default: "draft"
      end

      dir.down do
        change_column :news, :status, :integer, null: true, default: nil
      end
    end
  end
end
