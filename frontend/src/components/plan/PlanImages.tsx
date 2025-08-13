'use client'
import Image from 'next/image';
import { PlayPlan } from '@/types/plan';


type PlanImage = {
    id: number;
    url: string;
};

interface PlayPlanDetailProps {
    plan: PlayPlan;
}
/**
 * プラン画像一覧を表示するコンポーネント
 * @param  props - 画像配列
 * @return  画像リスト
 */
export const PlanImages = (plan: PlayPlanDetailProps) => {
    const images: PlanImage[] = plan.plan.imageUrls || [];

    if (!images) return null;

    // UIの都合上、最大3つまで表示する
    const displayImages = images.slice(0, 3);

    return (
        <div className="plan-images">
            {displayImages.map((image, index) => (
                <div key={image.id ?? index} className="plan-image-item">
                    <Image
                        src={image.url}
                        alt={`プラン画像${index + 1}`}
                        width={70}
                        height={200}
                        className="plan-image"
                    />
                </div>
            ))}
        </div>
    );
};