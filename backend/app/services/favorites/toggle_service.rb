# frozen_string_literal: true

module Favorites
  class ToggleService
    attr_reader :user, :play_plan, :action

    def initialize(user:, play_plan_id:, action: nil)
      @user = user
      @play_plan = PlayPlan.find_by(id: play_plan_id)
      @action = action # 'add' または 'remove' または nil（自動判定）
    end

    def call
      return { success: false, errors: ["ユーザーが見つかりません。"] } unless user
      return { success: false, errors: ["プランが見つかりません。"] } unless play_plan

      # アクションが指定されていない場合は、既存のお気に入りの有無で判断
      if action.nil?
        favorite_exists? ? remove_favorite : add_favorite
      else
        case action.to_s
        when 'add'
          add_favorite
        when 'remove'
          remove_favorite
        else
          { success: false, errors: ["無効なアクション: #{action}"] }
        end
      end
    end

    private

    def favorite_exists?
      user.favorites.exists?(play_plan_id: play_plan.id)
    end

    def add_favorite
      # 既にお気に入りに登録されている場合は何もしない（冪等性を確保）
      return { success: true, favorite: existing_favorite, errors: [] } if favorite_exists?

      favorite = user.favorites.new(play_plan: play_plan)

      if favorite.save
        # お気に入り登録イベントを発火（監視・ロギング用）
        ActiveSupport::Notifications.instrument('favorite.added', user_id: user.id, play_plan_id: play_plan.id)

        { success: true, favorite: favorite, errors: [] }
      else
        { success: false, favorite: nil, errors: favorite.errors.full_messages }
      end
    end

    def remove_favorite
      favorite = user.favorites.find_by(play_plan_id: play_plan.id)

      # お気に入りが存在しない場合は成功として扱う（冪等性を確保）
      return { success: true, errors: [] } unless favorite

      if favorite.destroy
        # お気に入り削除イベントを発火（監視・ロギング用）
        ActiveSupport::Notifications.instrument('favorite.removed', user_id: user.id, play_plan_id: play_plan.id)

        { success: true, errors: [] }
      else
        { success: false, errors: favorite.errors.full_messages }
      end
    end

    def existing_favorite
      user.favorites.find_by(play_plan_id: play_plan.id)
    end
  end
end
