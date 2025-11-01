class ModifyPlayPlansTimeFields < ActiveRecord::Migration[8.0]
  def change
    # 既存のdatetime型のカラムを削除
    remove_column :play_plans, :start_datetime, :datetime
    remove_column :play_plans, :end_datetime, :datetime

    # 新しいカラムを追加
    add_column :play_plans, :start_time, :time, comment: 'プランの開始日'
    add_column :play_plans, :end_time, :time, comment: 'プランの終了日'
    add_column :plan_details, :end_time, :time, comment: 'プラン内でのスポットの終了時刻'
  end
end
