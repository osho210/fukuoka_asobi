'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useBucketListItem } from './useBuckets';
import { BucketListItem } from '@/__generated__/graphql';
import Image from 'next/image';
import { renderTextWithLineBreaks, copyGoogleMapsUrlToClipboard, getBaseImagePath } from '@/utils/bucketUtils';
import { formatTime } from '@/utils/dateUtils';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast/ToastContainer';
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
 * URLパラメータ(?bucket_id=xxx)がある場合、自動的にモーダルを開く
 * 別のモーダルを開く際はURLパラメータを更新
 */
export const BucketDetailModal: React.FC<BucketDetailModalProps> = ({
    isOpen,
    bucketListItem: initialBucketListItem,
    onClose,
    id,
}) => {
    const searchParams = useSearchParams();
    const bucketIdFromUrl = searchParams ? searchParams.get('bucket_id') : null;
    const [currentBucketId, setCurrentBucketId] = useState<string | null>(bucketIdFromUrl);
    const [isModalOpen, setIsModalOpen] = useState(!!bucketIdFromUrl);

    // URLパラメータまたはpropsから実効的なIDを決定
    const effectiveId = currentBucketId || id;

    // サーバーから詳細データを取得
    // initialBucketListItemが既に存在する場合やIDが無い場合はクエリをスキップ
    const shouldSkipQuery = !effectiveId || !!initialBucketListItem;
    // サーバーから詳細データを取得
    const { bucketListItem: serverBucketListItem, loading, error } = useBucketListItem(effectiveId || '', {
        skip: shouldSkipQuery,
    });
    const [isVisible, setIsVisible] = useState(false);
    const { toasts, showToast, removeToast } = useToast();

    // initialBucketListItemが渡されている場合はそれを使用、無い場合はサーバーデータを使用
    const bucketListItem = initialBucketListItem || serverBucketListItem;

    // URLパラメータが変更された場合
    useEffect(() => {
        if (bucketIdFromUrl) {
            setCurrentBucketId(bucketIdFromUrl);
            setIsModalOpen(true);
        }
    }, [bucketIdFromUrl]);

    // propsのisOpenが変更された場合（リスト表示からの選択）
    useEffect(() => {
        if (isOpen && id && !bucketIdFromUrl) {
            // URLパラメータを更新
            const url = new URL(window.location.href);
            url.searchParams.set('bucket_id', id);
            window.history.replaceState({}, document.title, url.toString());
            setCurrentBucketId(id);
            setIsModalOpen(true);
        }
    }, [isOpen, id, bucketIdFromUrl]);

    // モーダルが開く時：スクロール無効化を最優先で実行
    useEffect(() => {
        if (isModalOpen) {
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
    }, [isModalOpen]);

    // モーダルを閉じるハンドラ
    const handleClose = () => {
        setIsModalOpen(false);
        setCurrentBucketId(null);
        onClose();
        // URLパラメータをクリア
        if (bucketIdFromUrl || currentBucketId) {
            const url = new URL(window.location.href);
            url.searchParams.delete('bucket_id');
            window.history.replaceState({}, document.title, url.toString());
        }
    };

    if (!isModalOpen) {
        return null;
    }

    return (
        <>
            <div
                className={`bucket-detail-modal-overlay ${isVisible ? 'visible' : ''}`}
                onClick={handleClose}
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
                        onClick={handleClose}
                        aria-label="モーダルを閉じる"
                    >
                        ×
                    </button>

                    {/* ローディング中 */}
                    {effectiveId && loading && (
                        <div className="bucket-detail-modal-loading">
                            <p>読み込み中...</p>
                        </div>
                    )}

                    {/* エラー発生 */}
                    {effectiveId && error && (
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
                                                            showToast('Google MapsのURLをコピーしました！', 'success');
                                                        } else {
                                                            showToast('コピーに失敗しました', 'error');
                                                        }
                                                    }}
                                                    title="Google Maps URLをコピー"
                                                    aria-label="Google Maps URLをコピー"
                                                >
                                                    Google Maps URLをコピー
                                                </button>
                                                }
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bucket-detail-modal-info">
                                {/* 共有 */}
                                <div className="bucket-share-section">
                                    <div className="bucket-share-buttons">
                                        {/* LINEシェア - トーク画面に共有 */}
                                        <button
                                            className="bucket-share-button bucket-share-line"
                                            onClick={() => {
                                                // LINE公式のシェアURL（トーク画面で共有可能）
                                                const shareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(
                                                    `${bucketListItem.title}\n${window.location.href}`
                                                )}`;
                                                window.open(shareUrl, '_blank', 'width=500,height=500');
                                            }}
                                            title="LINEで共有"
                                            aria-label="LINEで共有"
                                        >
                                            <Image src={'/line-icon.png'} width={20} height={20} alt={'line icon'} />
                                            LINEで送る
                                        </button>

                                        {/* URLコピー */}
                                        <button
                                            className="bucket-share-button bucket-share-copy"
                                            onClick={async () => {
                                                try {
                                                    await navigator.clipboard.writeText(window.location.href);
                                                    showToast('体験のURLをコピーしました！', 'success');
                                                } catch (error) {
                                                    console.error('URLコピーに失敗しました:', error);
                                                    showToast('コピーに失敗しました', 'error');
                                                }
                                            }}
                                            title="URLをコピー"
                                            aria-label="URLをコピー"
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                                                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                                            </svg>
                                            リンクをコピー
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* トースト通知コンテナ */}
            <ToastContainer toasts={toasts} onRemove={removeToast} />
        </>
    );
};

export default BucketDetailModal;
