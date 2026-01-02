'use client';

import React, { useState } from 'react';
import BucketsList from '@/components/buckets/BucketsList';
import BucketDetailModal from '@/components/buckets/BucketDetailModal';
import { useBucketListItem } from '@/components/buckets/useBuckets';
import { BucketListItem } from '@/__generated__/graphql';
import Image from 'next/image';
import '@/styles/BucketsPage.css';

/**
 * バケッツ（福岡でやりたいこと）一覧ページ
 * UI描画のみを担当。データ取得ロジックはコンポーネント層に委譲
 */
export default function BucketsPage() {
    // モーダル制御用の状態
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedBucketId, setSelectedBucketId] = useState<string | null>(null);
    const [selectedBucket, setSelectedBucket] = useState<BucketListItem | null>(null);

    // Image クリック時に指定される ID でバケット詳細を取得
    const { bucketListItem, loading: bucketLoading } = useBucketListItem(
        selectedBucketId || ''
    );

    // bucketListItem が取得されたらモーダルに反映
    React.useEffect(() => {
        if (bucketListItem && !bucketLoading) {
            setSelectedBucket(bucketListItem as BucketListItem);
            setIsModalOpen(true);
        }
    }, [bucketListItem, bucketLoading]);

    // KV イメージクリック時の処理
    const handleKvImageClick = (bucketId: string) => {
        setSelectedBucketId(bucketId);
    };

    // BucketsList から選択されたバケットの詳細モーダルを表示
    const handleBucketSelect = (item: BucketListItem) => {
        setSelectedBucket(item);
        setIsModalOpen(true);
    };

    // モーダルを閉じる処理
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBucketId(null);
        setSelectedBucket(null);
    };

    return (
        <div className="buckets-page">
            <div className="buckets-page-header">
                <div className='buckets-page-kv-content'>
                    <Image
                        src="/bucket_kv1.png"
                        alt="福岡でやりたいこと"
                        width={140}
                        height={210}
                        className="buckets-page-kv-image"
                        onClick={() => handleKvImageClick('8')}
                        style={{ cursor: 'pointer' }}
                    />
                    <Image
                        src="/bucket_kv2.png"
                        alt="福岡でやりたいこと"
                        width={140}
                        height={210}
                        className="buckets-page-kv-image"
                        onClick={() => handleKvImageClick('2')}
                        style={{ cursor: 'pointer' }}
                    />
                    <Image
                        src="/bucket_kv3.png"
                        alt="福岡でやりたいこと"
                        width={140}
                        height={210}
                        className="buckets-page-kv-image"
                        onClick={() => handleKvImageClick('1')}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
            </div>

            <div className="buckets-page-content">
                <BucketsList onSelectItem={handleBucketSelect} />
            </div>

            {selectedBucket && (
                <BucketDetailModal
                    isOpen={isModalOpen}
                    bucketListItem={selectedBucket}
                    id={selectedBucket.id}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
}