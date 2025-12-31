'use client';

import React, { useEffect, useState } from 'react';
import { useBucketListItem } from './useBuckets';
import { BucketListItem } from '@/__generated__/graphql';
import Image from 'next/image';
import { renderTextWithLineBreaks, copyGoogleMapsUrlToClipboard, getBaseImagePath } from '@/utils/bucketUtils';
import { formatTime, getWeatherLabel } from '@/utils/dateUtils';
import '@/styles/BucketDetailModal.css';

interface BucketDetailModalProps {
    isOpen: boolean;
    bucketListItem?: BucketListItem | null;
    onClose: () => void;
    id?: string;
}

/**
 * バケットリストアイテム詳細をモーダルで表示するコンポーネント
 * モーダルが開く際にサーバーからデータを取得する
 */
export const BucketDetailModal: React.FC<BucketDetailModalProps> = ({
    isOpen,
    bucketListItem: initialBucketListItem,
    onClose,
    id,
}) => {
    // サーバーから詳細データを取得する場合、idから取得
    const { bucketListItem: serverBucketListItem, loading, error } = useBucketListItem(id || '');
    const [isVisible, setIsVisible] = useState(false);

    // initialBucketListItemが渡されている場合はそれを使用、無い場合はサーバーデータを使用
    const bucketListItem = initialBucketListItem || serverBucketListItem;

    // モーダルが開く時：スクロール無効化を最優先で実行
    useEffect(() => {
        if (isOpen) {
            // 同期的にボディのスクロール無効化（レンダリング前）
            document.body.style.overflow = 'hidden';
            document.body.style.scrollBehavior = 'auto';

            // 次のフレームでモーダルを表示（アニメーション開始）
            requestAnimationFrame(() => {
                setIsVisible(true);
            });
        } else {
            setIsVisible(false);
            // モーダル閉じる時もスクロール再度有効化
            setTimeout(() => {
                document.body.style.overflow = 'unset';
                document.body.style.scrollBehavior = 'unset';
            }, 0);
        }

        return () => {
            document.body.style.overflow = 'unset';
            document.body.style.scrollBehavior = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    return (
        <div
            className={`bucket-detail-modal-overlay ${isVisible ? 'visible' : ''}`}
            onClick={onClose}
            role="presentation"
        >
            <div
                className={`bucket-detail-modal-content ${isVisible ? 'visible' : ''}`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
            >
                <button
                    className="bucket-detail-modal-close"
                    onClick={onClose}
                    aria-label="モーダルを閉じる"
                >
                    ×
                </button>

                {/* ローディング中 */}
                {id && loading && (
                    <div className="bucket-detail-modal-loading">
                        <p>読み込み中...</p>
                    </div>
                )}

                {/* エラー発生 */}
                {id && error && (
                    <div className="bucket-detail-modal-error">
                        <p>エラーが発生しました: {error.message}</p>
                    </div>
                )}

                {/* 詳細情報がない場合 */}
                {!loading && !error && !bucketListItem && (
                    <div className="bucket-detail-modal-empty">
                        <p>データが見つかりません</p>
                    </div>
                )}

                {/* 詳細情報を表示 */}
                {bucketListItem && (
                    <div className="bucket-detail-modal-body">
                        <div className="bucket-detail-modal-header">
                            <div className={'bucket-image-container'}>
                                <div className="bucket-detail-image-box">
                                    <Image
                                        src={'/' + getBaseImagePath(bucketListItem.layoutBucket.templateKey)}
                                        // src={'/bucket_kv1.png'}
                                        alt={bucketListItem.title}
                                        width={150}
                                        height={225}
                                        className="bucket-detail-image"
                                        priority
                                    />
                                    <h3 className="bucket-detail-image-title">{renderTextWithLineBreaks(bucketListItem.title)}</h3>
                                    <p className="bucket-detail-image-content">{bucketListItem.content}</p>
                                </div>
                                <div className="bucket-detail-image-text">
                                    <h4 className="bucket-detail-section-title">内容</h4>
                                    <p className="bucket-detail-section-content">{bucketListItem.content}</p>
                                    {bucketListItem.meetingTime && (
                                        <div className="bucket-detail-section">
                                            <h4 className="bucket-detail-section-title">待ち合わせ</h4>
                                            <p className="bucket-detail-section-content">{bucketListItem.meetingTime && `時間: ` + formatTime(bucketListItem.meetingTime)}</p>
                                            <p className="bucket-detail-section-content">{bucketListItem.meetingPlaceName && `場所: ` + bucketListItem.meetingPlaceName}</p>
                                            {bucketListItem.meetingPlaceName && <button
                                                className="bucket-detail-copy-maps-button"
                                                onClick={async () => {
                                                    const success = await copyGoogleMapsUrlToClipboard(bucketListItem.meetingPlaceName || '');
                                                    if (success) {
                                                        alert('Google MapsのURLをコピーしました！');
                                                    } else {
                                                        alert('コピーに失敗しました');
                                                    }
                                                }}
                                                title="Google Maps URLをコピー"
                                                aria-label="Google Maps URLをコピー"
                                            >
                                                google map URLをコピー
                                            </button>
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bucket-detail-modal-info">
                            {(bucketListItem.costMin || bucketListItem.costMax) && (
                                <div className="bucket-detail-section">
                                    <h4 className="bucket-detail-section-title">費用</h4>
                                    <p className="bucket-detail-section-content">
                                        {bucketListItem.costMin && `¥${bucketListItem.costMin} `}
                                        {bucketListItem.costMax && `~ ¥${bucketListItem.costMax}`}
                                    </p>
                                </div>
                            )}
                            {/* おすすめの天気 */}
                            {bucketListItem.weather && (
                                <div className="bucket-detail-section">
                                    <h4 className="bucket-detail-section-title">おすすめの天気</h4>
                                    <p className="bucket-detail-section-content">{getWeatherLabel(bucketListItem.weather)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BucketDetailModal;
