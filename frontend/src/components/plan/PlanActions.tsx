'use client';

import FavoriteButton from '../common/FavoriteButton';
import { PlayPlan } from '@/__generated__/graphql';
import { shareToLine, copyUrlToClipboard } from '@/utils/shareUtils';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast/ToastContainer';
import Image from 'next/image';

interface PlanActionsProps {
  plan?: PlayPlan;
  onSave?: () => void;
  onEdit?: () => void;
  showFavorite?: boolean;
  showShare?: boolean;
  customButtons?: React.ReactNode;
}

const PlanActions: React.FC<PlanActionsProps> = ({
  plan,
  onSave,
  onEdit,
  showFavorite = true,
  showShare = true,
  customButtons
}) => {
  const { toasts, showToast, removeToast } = useToast();

  // LINEシェアハンドラー
  const handleShareLine = () => {
    if (plan) {
      shareToLine(plan.planName || 'プラン');
    }
  };

  // URLコピーハンドラー
  const handleShareCopy = async () => {
    const success = await copyUrlToClipboard();
    if (success) {
      showToast('プランのURLをコピーしました！', 'success');
    } else {
      showToast('コピーに失敗しました', 'error');
    }
  };

  return (
    <>
      <div className="plan-actions">
        {showFavorite && plan && (
          <FavoriteButton
            playPlanId={String(plan.id)}
            isFavorite={plan.isFavorite}
            className="plan-action-button primary"
            showText={true}
            size="md"
          />
        )}

        {showShare && (
          <>
            <button className="bucket-share-button bucket-share-line" onClick={handleShareLine}>
              <Image src={'/line-icon.png'} width={20} height={20} alt={'line icon'} />
              LINEで送る
            </button>
            <button className="bucket-share-button bucket-share-copy" onClick={handleShareCopy}>
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
              シェアする
            </button>
          </>
        )}

        {onSave && (
          <button className="plan-action-button primary" onClick={onSave}>
            <span>💾</span>
            <span>プランを保存</span>
          </button>
        )}

        {onEdit && (
          <button className="plan-action-button secondary" onClick={onEdit}>
            <span>✏️</span>
            <span>プランを編集</span>
          </button>
        )}

        {customButtons}
      </div>

      {/* トースト通知コンテナ */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
};

export default PlanActions;
