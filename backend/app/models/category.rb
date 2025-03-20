class Category < ApplicationRecord
  has_many :news, dependent: :nullify
end
