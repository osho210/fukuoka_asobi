class AddPasswordResetToUsers < ActiveRecord::Migration[7.0]
  def change
    # カラムが存在しない場合にのみ追加
    unless column_exists?(:users, :reset_password_token)
      add_column :users, :reset_password_token, :string
    end

    unless column_exists?(:users, :reset_password_sent_at)
      add_column :users, :reset_password_sent_at, :datetime
    end

    # インデックスが存在しない場合にのみ追加
    unless index_exists?(:users, :reset_password_token)
      add_index :users, :reset_password_token, unique: true
    end
  end
end
