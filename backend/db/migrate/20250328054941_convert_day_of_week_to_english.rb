class ConvertDayOfWeekToEnglish < ActiveRecord::Migration[8.0]
  def up
    # 日本語の曜日から英語の曜日コードへのマッピング
    day_mapping = {
      '月' => 'mon',
      '火' => 'tue',
      '水' => 'wed',
      '木' => 'thu',
      '金' => 'fri',
      '土' => 'sat',
      '日' => 'sun'
    }

    # 既存のレコードを更新
    OpeningHour.find_each do |opening_hour|
      if day_mapping.key?(opening_hour.day_of_week)
        old_value = opening_hour.day_of_week
        new_value = day_mapping[old_value]
        opening_hour.update_column(:day_of_week, new_value)
        puts "OpeningHour ID: #{opening_hour.id} の曜日を #{old_value} から #{new_value} に変換しました。"
      else
        puts "OpeningHour ID: #{opening_hour.id} の曜日 #{opening_hour.day_of_week} は既に英語形式か、未知の形式です。"
      end
    end
  end

  def down
    # 英語の曜日コードから日本語の曜日へのマッピング
    day_mapping = {
      'mon' => '月',
      'tue' => '火',
      'wed' => '水',
      'thu' => '木',
      'fri' => '金',
      'sat' => '土',
      'sun' => '日'
    }

    # 既存のレコードを更新
    OpeningHour.find_each do |opening_hour|
      if day_mapping.key?(opening_hour.day_of_week)
        opening_hour.update_column(:day_of_week, day_mapping[opening_hour.day_of_week])
        puts "OpeningHour ID: #{opening_hour.id} の曜日を #{opening_hour.day_of_week} から #{day_mapping[opening_hour.day_of_week]} に変換しました。"
      else
        puts "OpeningHour ID: #{opening_hour.id} の曜日 #{opening_hour.day_of_week} は既に日本語形式か、未知の形式です。"
      end
    end
  end
end
