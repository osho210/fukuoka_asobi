'use client';

import React, { useEffect, useCallback } from 'react';
import { useBucketListItems } from './useBuckets';
import { BucketListItem } from '@/__generated__/graphql';
import Image from 'next/image';
import { formatPublishedDate, renderTextWithLineBreaks, isSpineBookTemplate } from '@/utils/bucketUtils';
import '@/styles/BucketsPage.css';

interface BucketsListProps {
    bucketIdFromUrl: string | null;
    onSelectItem?: (item: BucketListItem) => void;
    onBucketFound?: (bucket: BucketListItem) => void;
}

/**
 * バケットリストアイテム一覧を表示するコンポーネント
 *
 * 責務：
 * - バケットリストアイテムの一覧表示
 * - URL パラメータに対応するバケットを検索して親に通知
 */
const BucketsListContent: React.FC<BucketsListProps> = ({
    bucketIdFromUrl,
    onSelectItem,
    onBucketFound,
}) => {
    const { bucketListItems, loading, error } = useBucketListItems();

    // バケットアイテムをクリック時の処理
    const handleBucketClick = useCallback((item: BucketListItem) => {
        // 親コンポーネントに選択を通知（ページ側で URL を更新）
        onSelectItem?.(item);
    }, [onSelectItem]);

    // URL パラメータに対応するバケットを検索（バケットリスト読み込み後のみ）
    useEffect(() => {
        if (bucketIdFromUrl && bucketListItems?.length) {
            const found = bucketListItems.find((item) => item.id === bucketIdFromUrl);
            if (found) {
                // 親コンポーネントに対応するバケットを通知
                onBucketFound?.(found as BucketListItem);
            }
        }
    }, [bucketIdFromUrl, bucketListItems, onBucketFound]);

    // ローディング中の表示
    if (loading) {
        return (
            <div className="buckets-loading-container">
                <p>読み込み中...</p>
            </div>
        );
    }

    // エラー発生時の表示
    if (error) {
        return (
            <div className="buckets-error-container">
                <p>エラーが発生しました: {error.message}</p>
            </div>
        );
    }

    // バケットリストアイテムが空の場合
    if (!bucketListItems || bucketListItems.length === 0) {
        return (
            <div className="buckets-empty-container">
                <p>やりたいことがまだ登録されていません</p>
            </div>
        );
    }

    return (
        <div className="buckets-list-container">
            <div className="buckets-grid">
                {bucketListItems.map((item) => {
                    // テンプレートタイプに応じた条件分岐
                    const isSpineBook = isSpineBookTemplate(item.layoutBucket.templateKey);

                    return (
                        <div
                            key={item.id}
                            className="bucket-card"
                            onClick={() => handleBucketClick(item as BucketListItem)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    handleBucketClick(item as BucketListItem);
                                }
                            }}
                        >
                            <div className="bucket-card-content">
                                <div className={isSpineBook ? 'spine-book' : 'bucket-image-box'}>
                                    <Image
                                        src={'/' + item.layoutBucket.templateKey + '.png'}
                                        alt={item.title}
                                        width={isSpineBook ? 45 : 112}
                                        height={isSpineBook ? 140 : 168}
                                        className="bucket-image"
                                    />
                                    {/* 基本テンプレート用の表示 */}
                                    {!isSpineBook && (
                                        <div className="bucket-image-text">
                                            <span className="bucket-image-title">{renderTextWithLineBreaks(item.title)}</span>
                                            {item.content && (
                                                <span className="bucket-image-content">{item.content}</span>
                                            )}
                                        </div>
                                    )}

                                    {/* 背表紙テンプレート用の表示 */}
                                    {isSpineBook && (
                                        <div className="bucket-image-text bucket-spine-book-text">
                                            <span className="bucket-image-title bucket-spine-book-title">
                                                {renderTextWithLineBreaks(item.title)}
                                            </span>
                                            {/* 公開日を表示 */}
                                            {(() => {
                                                const formattedDate = formatPublishedDate(item.publishedAt);
                                                return formattedDate ? (
                                                    <div className="bucket-spine-book-date">
                                                        <div className="bucket-spine-book-month">{formattedDate.month}</div>
                                                        <div className="bucket-spine-book-day">{formattedDate.day}</div>
                                                    </div>
                                                ) : null;
                                            })()}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// React.memo でコンポーネント全体をメモ化
// props が浅い比較で前回と同じ場合は再レンダリングをスキップする
export const BucketsList = React.memo(BucketsListContent);

export default BucketsList;
