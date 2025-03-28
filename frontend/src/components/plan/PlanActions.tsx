'use client';

interface PlanActionsProps {
  onSave?: () => void;
  onEdit?: () => void;
  showFavorite?: boolean;
  showShare?: boolean;
  customButtons?: React.ReactNode;
}

const PlanActions: React.FC<PlanActionsProps> = ({
  onSave,
  onEdit,
  showFavorite = true,
  showShare = true,
  customButtons
}) => {
  return (
    <div className="plan-actions">
      {showFavorite && (
        <button className="plan-action-button primary">
          <span>♡</span>
          <span>お気に入りに追加</span>
        </button>
      )}

      {showShare && (
        <button className="plan-action-button secondary">
          <span>🔗</span>
          <span>シェアする</span>
        </button>
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
  );
};

export default PlanActions;
