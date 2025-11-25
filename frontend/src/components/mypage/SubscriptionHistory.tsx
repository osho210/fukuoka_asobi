'use client';

import React from 'react';
import '@/styles/SubscriptionHistory.css';

interface PaymentTransaction {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
}

interface SubscriptionHistoryProps {
  history: PaymentTransaction[];
  loading: boolean;
}

export const SubscriptionHistory: React.FC<SubscriptionHistoryProps> = ({ history, loading }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      succeeded: { label: '成功', className: 'subscription-history-badge-succeeded' },
      pending: { label: '保留中', className: 'subscription-history-badge-pending' },
      failed: { label: '失敗', className: 'subscription-history-badge-failed' },
      canceled: { label: 'キャンセル', className: 'subscription-history-badge-canceled' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      label: status,
      className: 'subscription-history-badge-canceled',
    };

    return (
      <span className={`subscription-history-badge ${config.className}`}>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="subscription-history-container">
        <h2 className="subscription-history-title">決済履歴</h2>
        <div className="subscription-history-loading">
          <div className="subscription-history-spinner"></div>
          <p className="subscription-history-loading-text">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="subscription-history-container">
        <h2 className="subscription-history-title">決済履歴</h2>
        <p className="subscription-history-empty">決済履歴がありません</p>
      </div>
    );
  }

  return (
    <div className="subscription-history-container">
      <h2 className="subscription-history-title">決済履歴</h2>

      {/* モバイル表示 */}
      <div className="subscription-history-mobile">
        {history.map((transaction) => (
          <div key={transaction.id} className="subscription-history-mobile-item">
            <div className="subscription-history-mobile-header">
              <span className="subscription-history-mobile-amount">
                {formatAmount(transaction.amount, transaction.currency)}
              </span>
              {getStatusBadge(transaction.status)}
            </div>
            <div className="subscription-history-mobile-date">
              <p>{formatDate(transaction.paidAt || transaction.createdAt)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* デスクトップ表示 */}
      <div className="subscription-history-desktop">
        <table className="subscription-history-table">
          <thead>
            <tr>
              <th>日時</th>
              <th>金額</th>
              <th>ステータス</th>
            </tr>
          </thead>
          <tbody>
            {history.map((transaction) => (
              <tr key={transaction.id}>
                <td>
                  {formatDate(transaction.paidAt || transaction.createdAt)}
                </td>
                <td className="subscription-history-amount">
                  {formatAmount(transaction.amount, transaction.currency)}
                </td>
                <td>
                  {getStatusBadge(transaction.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
