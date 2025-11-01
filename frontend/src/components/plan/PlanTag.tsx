'use client'
import { PlayPlan } from '@/types/plan';

interface PlayPlanDetailProps {
    plan: PlayPlan;
}
/**
 * プラン画像一覧を表示するコンポーネント
 * @param  props - 画像配列
 * @return  画像リスト
 */
export const PlanTags = (plan: PlayPlanDetailProps) => {
    const tags = plan.plan.tags || "";

    // tagsは,区切りなので分割して配列にする
    const tagsArray = tags.split(',').map(tag => tag.trim());

    if (!tagsArray) return null;

    return (
        <div className="plan-tags-container">
            <h2 className="plan-tags-title">こんな方に見ていただきたい</h2>
            <div className="plan-tags">
                {tagsArray.map((tag, index) => (
                    <div key={index} className="plan-tag-item">
                        <span className="plan-tag">{tag}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};