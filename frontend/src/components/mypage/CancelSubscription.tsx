'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CANCEL_SUBSCRIPTION } from '@/graphql/subscription';
import { GET_CURRENT_USER } from '@/graphql/mypage';
import '@/styles/CancelSubscription.css';

interface CancelSubscriptionProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const CancelSubscription: React.FC<CancelSubscriptionProps> = ({ onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [immediately, setImmediately] = useState(false);

  const [cancelSubscription] = useMutation(CANCEL_SUBSCRIPTION, {
    refetchQueries: [{ query: GET_CURRENT_USER }],
  });

  const handleCancel = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await cancelSubscription({
        variables: {
          immediately,
        },
      });

      if (data?.cancelSubscription?.errors?.length > 0) {
        setError(data.cancelSubscription.errors.join(', '));
        setLoading(false);
        return;
      }

      if (data?.cancelSubscription?.success) {
        onSuccess();
      }
    } catch (err) {
      console.error('Cancel subscription error:', err);
      setError('予期しないエラーが発生しました。しばらく時間をおいてから再度お試しください。');
      setLoading(false);
    }
  };

  return (
    <div className="cancel-subscription-overlay">
      <div className="cancel-subscription-modal">
        <h2 className="cancel-subscription-title">サブスクリプションの解約</h2>

        <div className="cancel-subscription-content">
          <p className="cancel-subscription-text">
            サブスクリプションを解約してもよろしいですか？
          </p>

          <div className="cancel-subscription-warning">
            <p className="cancel-subscription-warning-text">
              <strong>注意:</strong> 解約後も現在の期間終了日まではすべての機能をご利用いただけます。
            </p>
          </div>

          <div className="cancel-subscription-checkbox-wrapper">
            <input
              type="checkbox"
              id="immediately"
              checked={immediately}
              onChange={(e) => setImmediately(e.target.checked)}
              className="cancel-subscription-checkbox"
            />
            <label htmlFor="immediately" className="cancel-subscription-checkbox-label">
              即座に解約する（現在の期間終了を待たずにすぐに機能が使えなくなります）
            </label>
          </div>
        </div>

        {error && (
          <div className="cancel-subscription-error">
            <p className="cancel-subscription-error-text">{error}</p>
          </div>
        )}

        <div className="cancel-subscription-buttons">
          <button
            onClick={onClose}
            disabled={loading}
            className="cancel-subscription-button cancel-subscription-button-cancel"
          >
            キャンセル
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="cancel-subscription-button cancel-subscription-button-confirm"
          >
            {loading ? '処理中...' : '解約する'}
          </button>
        </div>
      </div>
    </div>
  );
};
