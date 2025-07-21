class ChangeUniqueIndexOnOpeningHours < ActiveRecord::Migration[7.1]
  def change
    # 既存のユニークインデックスを削除します
    remove_index :opening_hours, name: :index_opening_hours_on_spot_id_and_day_of_week, if_exists: true

    # 新しいユニークインデックスを追加します
    # open_time も含めることで、同じ曜日に開始時間が異なる複数の営業時間を登録できるようになります
    add_index :opening_hours, [:spot_id, :day_of_week, :open_time], unique: true, name: 'index_opening_hours_on_spot_day_and_open_time'
  end
end
