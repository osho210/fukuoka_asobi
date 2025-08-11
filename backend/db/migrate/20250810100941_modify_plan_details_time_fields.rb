class ModifyPlanDetailsTimeFields < ActiveRecord::Migration[8.0]
  def change
    # 既存のdatetime型のカラムを削除
    remove_column :plan_details, :start_datetime, :datetime
    remove_column :plan_details, :end_datetime, :datetime

    # 新しいカラムを追加
    add_column :plan_details, :start_time, :time, comment: 'プラン内でのスポットの開始時刻'
    add_column :plan_details, :duration_minutes, :integer, comment: 'そのスポットでの滞在時間（分単位）'
  end
end
