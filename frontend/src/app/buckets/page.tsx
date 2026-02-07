'use client';

import React, { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import BucketsList from '@/components/buckets/BucketsList';
import BucketDetailModal from '@/components/buckets/BucketDetailModal';
import { BucketListItem } from '@/__generated__/graphql';
import Image from 'next/image';
import '@/styles/BucketsPage.css';

/**
 * バケッツ（福岡でやりたいこと）一覧ページの実装
 *
 * 責務：
 * - URL パラメータ（bucket_id）の一元管理
 * - モーダルの開閉制御
 * - KV イメージクリック時の処理
 * - 子コンポーネント（BucketsList）への状態の受け渡し
 */
function BucketsPageContent() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    // URL パラメータからバケットIDを取得（シングルソースオブトゥルース）
    const bucketIdFromUrl = searchParams?.get('bucket_id') || null;

    // ローカル状態：選択されたバケット情報
    const [selectedBucket, setSelectedBucket] = React.useState<BucketListItem | null>(null);

    // URL パラメータが変更されたときに状態を同期
    useEffect(() => {
        if (bucketIdFromUrl) {
            // URL パラメータが存在する場合はモーダルが表示される
            // BucketsList が対応するバケットを検索して selectedBucket を設定する
            // （BucketsList側のonBucketFoundコールバックで設定される）
        } else {
            // URL パラメータが無い場合は選択状態をクリア
            setSelectedBucket(null);
        }
    }, [bucketIdFromUrl]);

    // KV イメージクリック時の処理
    const handleKvImageClick = (bucketId: string) => {
        // URL パラメータを更新（これによってモーダルが表示される）
        const params = new URLSearchParams(searchParams?.toString() ?? '');
        params.set('bucket_id', bucketId);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // BucketsList から選択されたバケットの詳細モーダルを表示
    const handleBucketSelect = (item: BucketListItem) => {
        // URL パラメータを更新
        const params = new URLSearchParams(searchParams?.toString() ?? '');
        params.set('bucket_id', item.id);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // モーダルを閉じる処理
    const handleCloseModal = () => {
        // URL パラメータをクリア
        const params = new URLSearchParams(searchParams?.toString() ?? '');
        params.delete('bucket_id');
        const nextUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname ?? '/buckets';
        router.replace(nextUrl, { scroll: false });
    };

    // モーダルを表示するか判定（URL パラメータが存在する場合は表示）
    const isModalOpen = !!bucketIdFromUrl;

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
                <BucketsList
                    bucketIdFromUrl={bucketIdFromUrl}
                    onSelectItem={handleBucketSelect}
                    onBucketFound={(bucket) => setSelectedBucket(bucket)}
                />
            </div>

            <BucketDetailModal
                isOpen={isModalOpen}
                bucketListItem={selectedBucket}
                id={bucketIdFromUrl || undefined}
                onClose={handleCloseModal}
            />
        </div>
    );
}

/**
 * バケッツページ
 * useSearchParams を使用するコンポーネントを Suspense で囲む
 */
export default function BucketsPage() {
    return (
        <Suspense fallback={<div>読み込み中...</div>}>
            <BucketsPageContent />
        </Suspense>
    );
}