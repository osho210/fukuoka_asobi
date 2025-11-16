'use client';

import FavoriteButton from '../common/FavoriteButton';
import { PlayPlan } from '@/__generated__/graphql';

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
  return (
    <div className="plan-actions">
      {showFavorite && plan && (
        <FavoriteButton
          playPlanId={plan.id}
          isFavorite={plan.isFavorite}
          className="plan-action-button primary"
          showText={true}
          size="md"
        />
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
