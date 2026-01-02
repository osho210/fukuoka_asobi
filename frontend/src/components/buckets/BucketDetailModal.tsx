'use client';

import React, { useState, useEffect } from 'react';
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
 *
 * 設計原則：
 * - このコンポーネントは単純にpropsの状態を表示するだけ
 * - URLパラメータとの同期は親コンポーネント（BucketsList）で完全に管理
 * - isOpen=false になったら、同期的にモーダルを閉じる
 */
export const BucketDetailModal: React.FC<BucketDetailModalProps> = ({
    isOpen,
    bucketListItem: initialBucketListItem,
    onClose,
    id,
}) => {
    // アニメーション用の内部状態
    const [isAnimating, setIsAnimating] = useState(false);

    // idが必ず存在することを保証（親で管理）
    const effectiveId = id || '';

    // サーバーから詳細データを取得
    const { bucketListItem: serverBucketListItem, loading, error } = useBucketListItem(effectiveId);

    // initialBucketListItemが渡されている場合はそれを使用、無い場合はサーバーデータを使用
    const bucketListItem = initialBucketListItem || serverBucketListItem;
    const { toasts, showToast, removeToast } = useToast();

    // モーダルの開閉アニメーション制御
    useEffect(() => {
        if (isOpen) {
            // モーダルを開く場合、次のフレームでアニメーションを開始
            requestAnimationFrame(() => {
                setIsAnimating(true);
                // モーダル表示時のボディスクロール無効化
                document.body.style.overflow = 'hidden';
            });
        } else {
            // モーダルを閉じる場合、アニメーションをリセット
            setIsAnimating(false);
            // スクロール復活
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // モーダルを閉じるハンドラー
    const handleClose = () => {
        onClose();
    };

    // モーダルが開いていない場合は何も描画しない
    if (!isOpen) {
        return null;
    }

    return (
        <>
            <div
                className={`bucket-detail-modal-overlay ${isAnimating ? 'visible' : ''}`}
                onClick={handleClose}
                role="presentation"
            >
                <div
                    className={`bucket-detail-modal-content ${isAnimating ? 'visible' : ''}`}
                    onClick={(e) => e.stopPropagation()}
                    role="dialog"
                    aria-modal="true"
                >
                    <button className="bucket-detail-modal-close" onClick={handleClose} aria-label="モーダルを閉じる">
                        ×
                    </button>

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
                                        <h3 className="bucket-detail-image-title">
                                            {renderTextWithLineBreaks(bucketListItem.title)}
                                        </h3>
                                        <p className="bucket-detail-image-content">{bucketListItem.content}</p>
                                    </div>
                                    <div className="bucket-detail-image-text">
                                        <h4 className="bucket-detail-section-title">内容</h4>
                                        <p className="bucket-detail-section-content">{bucketListItem.content}</p>
                                        {bucketListItem.meetingTime && (
                                            <div className="bucket-detail-section">
                                                <h4 className="bucket-detail-section-title">待ち合わせ</h4>
                                                <p className="bucket-detail-section-content">
                                                    {bucketListItem.meetingTime && `時間: ` + formatTime(bucketListItem.meetingTime)}
                                                </p>
                                                <p className="bucket-detail-section-content">
                                                    {bucketListItem.meetingPlaceName && `場所: ` + bucketListItem.meetingPlaceName}
                                                </p>
                                                {bucketListItem.meetingPlaceName && (
                                                    <button
                                                        className="bucket-detail-copy-maps-button"
                                                        onClick={async () => {
                                                            const success = await copyGoogleMapsUrlToClipboard(
                                                                bucketListItem.meetingPlaceName || ''
                                                            );
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
                                                )}
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
                                            <svg
                                                width="20"
                                                height="20"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                            >
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
