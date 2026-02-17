class CreateDmTemplates < ActiveRecord::Migration[8.0]
  def change
    create_table :dm_templates do |t|
      t.string :name, null: false
      t.string :version, null: false, default: 'v1.0'
      t.text :content, null: false
      t.text :description
      t.boolean :is_active, default: true, null: false
      t.timestamps
    end

    add_index :dm_templates, [:name, :version], unique: true
    add_index :dm_templates, :is_active

    # デフォルトテンプレートを挿入
    reversible do |dir|
      dir.up do
        execute <<-SQL
          INSERT INTO dm_templates (name, version, content, description, is_active, created_at, updated_at)
          VALUES (
            '画像利用承諾依頼',
            'v1.0',
            '{{store_name}}様

いつもありがとうございます。
福岡遊び日記（Webメディア / Instagram）での画像掲載について、利用許諾のお願いです。

以下のフォームから、投稿・ストーリーズへの掲載許諾をご確認いただけますと幸いです。

📝 承諾フォーム：
{{form_url}}

ご不明点がございましたら、お気軽にお問い合わせください。
よろしくお願いいたします。',
            '画像利用承諾依頼の初期テンプレート',
            true,
            NOW(),
            NOW()
          )
        SQL
      end
    end
  end
end
