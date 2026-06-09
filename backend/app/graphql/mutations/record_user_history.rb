# frozen_string_literal: true

module Mutations
  class RecordUserHistory < BaseMutation
    description "ユーザーの閲覧履歴を記録します"

    # 入力フィールド
    argument :viewable_type, String, required: true
    argument :viewable_id, ID, required: true

    # 出力フィールド
    field :user_history, Types::UserHistoryType, null: true
    field :errors, [String], null: false

    def resolve(viewable_type:, viewable_id:)
      # 現在のユーザーを取得
      current_user = context[:current_user]

      # ユーザーが認証されていない場合はエラー
      unless current_user
        return {
          user_history: nil,
          errors: ["認証が必要です"]
        }
      end

      # 対象のオブジェクトを取得
      viewable = find_viewable(viewable_type, viewable_id)
      unless viewable
        return {
          user_history: nil,
          errors: ["指定された閲覧対象が見つかりません。"]
        }
      end

      # 閲覧履歴を記録
      begin
        user_history = UserHistory.record_view(current_user.id, viewable)
        {
          user_history: user_history,
          errors: []
        }
      rescue StandardError => e
        {
          user_history: nil,
          errors: ["閲覧履歴の記録に失敗しました: #{e.message}"]
        }
      end
    end

    private

    def find_viewable(viewable_type, viewable_id)
      case viewable_type
      when "News"
        News.find_by(id: viewable_id)
      when "Magazine"
        Magazine.find_by(id: viewable_id)
      when "PlayPlan"
        PlayPlan.find_by(id: viewable_id)
      else
        nil
      end
    end
  end
end
