'use client';

import React from 'react';
import { useBucketListItem } from './useBuckets';
import '@/styles/BucketsPage.css';

interface BucketDetailProps {
    id: string;
    onBack?: () => void;
}

/**
 * バケットリストアイテム詳細を表示するコンポーネント
 * 個別のアイテムとその詳細情報を表示
 */
export const BucketDetail: React.FC<BucketDetailProps> = ({ id, onBack }) => {
    const { bucketListItem, loading, error } = useBucketListItem(id);

    // ローディング中の表示
    if (loading) {
        return (
            <div className="bucket-detail-loading-container">
                <p>読み込み中...</p>
            </div>
        );
    }

    // エラー発生時の表示
    if (error) {
        return (
            <div className="bucket-detail-error-container">
                <p>エラーが発生しました: {error.message}</p>
                {onBack && (
                    <button onClick={onBack} className="bucket-back-button">
                        戻る
                    </button>
                )}
            </div>
        );
    }

    // アイテムが見つからない場合
    if (!bucketListItem) {
        return (
            <div className="bucket-detail-empty-container">
                <p>やりたいことが見つかりません</p>
                {onBack && (
                    <button onClick={onBack} className="bucket-back-button">
                        戻る
                    </button>
                )}
            </div>
        );
    }

    return (
        <></>
    );
};

export default BucketDetail;
