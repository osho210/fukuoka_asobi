'use client';

import React from 'react';
import BucketsList from '@/components/buckets/BucketsList';
import Image from 'next/image';
import '@/styles/BucketsPage.css';

/**
 * バケッツ（福岡でやりたいこと）一覧ページ
 * UI描画のみを担当。データ取得ロジックはコンポーネント層に委譲
 */
export default function BucketsPage() {
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
                    />
                    <Image
                        src="/bucket_kv2.png"
                        alt="福岡でやりたいこと"
                        width={140}
                        height={210}
                        className="buckets-page-kv-image"
                    />
                    <Image
                        src="/bucket_kv3.png"
                        alt="福岡でやりたいこと"
                        width={140}
                        height={210}
                        className="buckets-page-kv-image"
                    />
                </div>
            </div>

            <div className="buckets-page-content">
                <BucketsList />
            </div>
        </div>
    );
}