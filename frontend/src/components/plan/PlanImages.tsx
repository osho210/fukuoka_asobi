'use client'
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { PlayPlan } from '@/types/plan';

export interface ImageProperty {
    attachmentId: string;
    url: string;
    isSelected: boolean;
    position: number;
    comment?: string;
}

interface PlayPlanDetailProps {
    plan: PlayPlan;
}

/**
 * プラン画像一覧をSwiperで表示するコンポーネント
 * @param {PlayPlanDetailProps} plan - プラン詳細
 * @return {JSX.Element|null} 画像リスト
 */
export const PlanImages = (plan: PlayPlanDetailProps) => {
    const imageProperties: ImageProperty[] = plan.plan.imageProperties || [];
    if (!imageProperties) return null;

    return (
        <div>
            <h3>おすすめポイント</h3>
            <div className="plan-images">
                {imageProperties.map((displayImage, index) => (
                    <div key={displayImage.attachmentId ?? index} className="plan-image-item">
                        <Image
                            src={displayImage.url}
                            alt={`プラン画像${index + 1}`}
                            width={300}
                            height={300}
                            className="plan-image"
                        />

                        {/* ▼ 吹き出し（コメントがある時だけ表示） */}
                        {displayImage.comment && (
                            <div className="plan-image-bubble plan-image-bubble--hand">
                                {displayImage.comment}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
