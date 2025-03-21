class AddGenderAndTermsAgreedToUsers < ActiveRecord::Migration[8.0]
  def change
    add_column :users, :gender, :string, default: 'prefer_not_to_say'
    add_column :users, :terms_agreed, :boolean, default: false
  end
end
