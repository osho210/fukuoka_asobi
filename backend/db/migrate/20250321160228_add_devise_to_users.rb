# frozen_string_literal: true

class AddDeviseToUsers < ActiveRecord::Migration[8.0]
  def self.up
    change_table :users do |t|
      ## Database authenticatable
      # emailカラムは既に存在するため、コメントアウト
      # t.string :email,              null: false, default: ""

      # password_hashカラムをencrypted_passwordに置き換え
      t.rename :password_hash, :encrypted_password
      t.change :encrypted_password, :string, null: false, default: ""

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable
      t.integer  :sign_in_count, default: 0, null: false
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string   :current_sign_in_ip
      t.string   :last_sign_in_ip

      ## JWT認証用
      t.string :jti
    end

    # 既存のユーザーにランダムなjti値を設定
    User.reset_column_information
    User.find_each do |user|
      user.update_column(:jti, SecureRandom.uuid)
    end

    # jtiカラムをnull: falseに変更
    change_column_null :users, :jti, false

    # emailのインデックスは既に存在する可能性があるため、条件付きで追加
    unless index_exists?(:users, :email)
      add_index :users, :email, unique: true
    end

    add_index :users, :reset_password_token, unique: true
    add_index :users, :jti, unique: true
  end

  def self.down
    change_table :users do |t|
      # Deviseで追加したカラムを削除
      t.rename :encrypted_password, :password_hash
      t.remove :reset_password_token, :reset_password_sent_at, :remember_created_at
      t.remove :sign_in_count, :current_sign_in_at, :last_sign_in_at, :current_sign_in_ip, :last_sign_in_ip
      t.remove :jti
    end

    # インデックスの削除
    remove_index :users, :reset_password_token if index_exists?(:users, :reset_password_token)
    remove_index :users, :jti if index_exists?(:users, :jti)
  end
end
