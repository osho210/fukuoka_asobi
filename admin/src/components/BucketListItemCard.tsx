'use client';

import React from 'react';
import { BucketListItem } from '@/__generated__/graphql';
import { getShiftStyles } from '@/lib/bucket-layout-utils';

interface BucketListItemCardProps {
    item: BucketListItem;
    onClick?: (item: BucketListItem) => void;
}

/**
 * バケットリストアイテムを表示するカードコンポーネント
 * LayoutBucketShiftEnum の値に応じて動的にスタイルを適応
 */
export const BucketListItemCard: React.FC<BucketListItemCardProps> = ({
    item,
    onClick,
}) => {
    // shift値からCSS スタイルを取得
    const shiftStyles = getShiftStyles(item.layoutBucket.shift);

    return (
        <div
            className="bucket-list-item-card"
            style={shiftStyles}
            onClick={() => onClick?.(item)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick?.(item);
                }
            }}
        >
            {/* カード内容 */}
            <div className="bucket-card-header">
                <h3 className="bucket-card-title">{item.title}</h3>
                {item.areaText && (
                    <span className="bucket-card-area-badge">{item.areaText}</span>
                )}
            </div>

            {item.content && (
                <div className="bucket-card-content">
                    <p>{item.content}</p>
                </div>
            )}

            {/* メタデータ */}
            <div className="bucket-card-meta">
                {item.costMin !== null && item.costMax !== null && (
                    <div className="bucket-card-cost">
                        <span className="label">予算:</span>
                        <span className="value">
                            ¥{item.costMin?.toLocaleString()} - ¥{item.costMax?.toLocaleString()}
                        </span>
                    </div>
                )}

                {item.weather && (
                    <div className="bucket-card-weather">
                        <span className="label">天気:</span>
                        <span className="value">{getWeatherLabel(item.weather)}</span>
                    </div>
                )}

                {item.publishedAt && (
                    <div className="bucket-card-published">
                        <span className="label">公開日:</span>
                        <span className="value">
                            {new Date(item.publishedAt).toLocaleDateString('ja-JP')}
                        </span>
                    </div>
                )}
            </div>

            {/* ステータス */}
            <div className="bucket-card-footer">
                <span
                    className={`bucket-card-status status-${item.status.toLowerCase()}`}
                >
                    {getStatusLabel(item.status)}
                </span>
            </div>
        </div>
    );
};

/**
 * 天気ラベルを取得
 */
function getWeatherLabel(weather: string): string {
    const weatherMap: Record<string, string> = {
        sunny: '晴れ',
        cloudy: '曇り',
        rainy: '雨',
        any: 'いつでも',
    };
    return weatherMap[weather] || weather;
}

/**
 * ステータスラベルを取得
 */
function getStatusLabel(status: string): string {
    const statusMap: Record<string, string> = {
        published: '公開済み',
        draft: '下書き',
        archived: 'アーカイブ',
    };
    return statusMap[status] || status;
}

export default BucketListItemCard;
