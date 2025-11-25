class CreatePaymentTransactions < ActiveRecord::Migration[8.0]
  def change
    create_table :payment_transactions do |t|
      t.references :user, null: false, foreign_key: true
      t.string :stripe_payment_intent_id
      t.decimal :amount, precision: 10, scale: 2
      t.string :currency
      t.string :status
      t.datetime :paid_at
      t.text :metadata

      t.timestamps
    end

    add_index :payment_transactions, :stripe_payment_intent_id
    add_index :payment_transactions, :status
  end
end
