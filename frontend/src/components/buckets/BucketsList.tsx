'use client';

import React, { useState } from 'react';
import { useBucketListItems } from './useBuckets';
import { BucketListItem } from '@/__generated__/graphql';
import BucketDetailModal from './BucketDetailModal';
import Image from 'next/image';
import { formatPublishedDate, renderTextWithLineBreaks, isSpineBookTemplate } from '@/utils/bucketUtils';
import '@/styles/BucketsPage.css';

interface BucketsListProps {
    onSelectItem?: (item: BucketListItem) => void;
}

/**
 * バケットリストアイテム一覧を表示するコンポーネント
 * GraphQL通信とデータ取得を行い、UIの描画はこのコンポーネントが担当
 */
export const BucketsList: React.FC<BucketsListProps> = ({ onSelectItem }) => {
    const { bucketListItems, loading, error } = useBucketListItems();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBucketId, setSelectedBucketId] = useState<string | null>(null);
    const [selectedBucket, setSelectedBucket] = useState<BucketListItem | null>(null);

    // バケットアイテムをクリック時の処理
    const handleBucketClick = (item: BucketListItem) => {
        setSelectedBucket(item);
        setSelectedBucketId(item.id);
        setIsModalOpen(true);
        onSelectItem?.(item);
    };


    // モーダルを閉じる処理
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBucketId(null);
        setSelectedBucket(null);
    };

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
        <>
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

            {/* バケット詳細モーダル */}
            <BucketDetailModal
                isOpen={isModalOpen}
                bucketListItem={selectedBucket}
                id={selectedBucketId || undefined}
                onClose={handleCloseModal}
            />
        </>
    );
};

export default BucketsList;
