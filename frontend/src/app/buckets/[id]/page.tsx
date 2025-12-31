'use client';

import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import BucketDetail from '@/components/buckets/BucketDetail';
import '@/styles/BucketsPage.css';

/**
 * バケッツ詳細ページ
 * UI描画のみを担当。データ取得ロジックはコンポーネント層に委譲
 */
export default function BucketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id as string;

    const handleBack = () => {
        router.push('/buckets');
    };

    if (!id) {
        return <div className="bucket-error">IDが指定されていません</div>;
    }

    return (
        <div className="bucket-detail-page">
            <BucketDetail id={id} onBack={handleBack} />
        </div>
    );
}
