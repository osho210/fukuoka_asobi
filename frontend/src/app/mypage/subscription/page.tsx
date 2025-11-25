'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_CURRENT_USER } from '@/graphql/mypage';
import { GET_CURRENT_SUBSCRIPTION, GET_PAYMENT_HISTORY } from '@/graphql/subscription';
import { SubscriptionStatus } from '@/components/mypage/SubscriptionStatus';
import { SubscriptionPlan } from '@/components/mypage/SubscriptionPlan';
import { CancelSubscription } from '@/components/mypage/CancelSubscription';
import { SubscriptionHistory } from '@/components/mypage/SubscriptionHistory';
import { useRouter } from 'next/navigation';
import '@/styles/SubscriptionPage.css';

export default function SubscriptionPage() {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);

  // ユーザー情報を取得
  const { data: userData, loading: userLoading } = useQuery(GET_CURRENT_USER, {
    fetchPolicy: 'network-only',
  });

  // サブスクリプション情報を取得
  const { data: subscriptionData, loading: subscriptionLoading, refetch: refetchSubscription } = useQuery(
    GET_CURRENT_SUBSCRIPTION,
    {
      skip: !userData?.currentUser,
      fetchPolicy: 'network-only',
    }
  );

  // 決済履歴を取得
  const { data: historyData, loading: historyLoading } = useQuery(
    GET_PAYMENT_HISTORY,
    {
      variables: { limit: 10 },
      skip: !userData?.currentUser,
      fetchPolicy: 'network-only',
    }
  );

  // ログインしていない場合はリダイレクト
  useEffect(() => {
    if (!userLoading && !userData?.currentUser) {
      router.push('/login');
    }
  }, [userLoading, userData, router]);

  // ローディング中の表示
  if (userLoading || subscriptionLoading) {
    return (
      <div className="subscription-page-loading">
        <div className="subscription-page-loading-content">
          <div className="subscription-page-spinner"></div>
          <p className="subscription-page-loading-text">読み込み中...</p>
        </div>
      </div>
    );
  }

  // ユーザーが取得できない場合
  if (!userData?.currentUser) {
    return null;
  }

  const user = userData.currentUser;
  const subscription = subscriptionData?.currentSubscription;
  const paymentHistory = historyData?.paymentHistory || [];

  return (
    <div className="subscription-page-container">
      <div className="subscription-page-inner">
        <h1 className="subscription-page-title">サブスクリプション管理</h1>

        {/* サブスクリプション状態 */}
        <div className="subscription-page-section">
          <SubscriptionStatus user={user} />
        </div>

        {/* 有料会員でない場合はプラン紹介を表示 */}
        {!user.isPaidMember && (
          <div className="subscription-page-section">
            <SubscriptionPlan />
          </div>
        )}

        {/* 有料会員の場合は解約ボタンとサブスクリプション詳細を表示 */}
        {user.isPaidMember && subscription && (
          <div className="subscription-page-section">
            <div className="subscription-detail-card">
              <h2 className="subscription-detail-title">サブスクリプション詳細</h2>

              <div className="subscription-detail-list">
                <div className="subscription-detail-item">
                  <span className="subscription-detail-label">ステータス:</span>
                  <span className="subscription-detail-value">{subscription.status}</span>
                </div>

                {subscription.currentPeriodEnd && (
                  <div className="subscription-detail-item">
                    <span className="subscription-detail-label">次回更新日:</span>
                    <span className="subscription-detail-value">
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString('ja-JP')}
                    </span>
                  </div>
                )}

                {subscription.cancelAtPeriodEnd && (
                  <div className="subscription-detail-warning">
                    <p className="subscription-detail-warning-text">
                      このサブスクリプションは {new Date(subscription.currentPeriodEnd).toLocaleDateString('ja-JP')} に終了する予定です
                    </p>
                  </div>
                )}

                {!subscription.cancelAtPeriodEnd && (
                  <div className="subscription-detail-button-wrapper">
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="subscription-detail-cancel-button"
                    >
                      サブスクリプションを解約
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 決済履歴 */}
        {paymentHistory.length > 0 && (
          <div className="subscription-page-section">
            <SubscriptionHistory history={paymentHistory} loading={historyLoading} />
          </div>
        )}

        {/* 解約確認モーダル */}
        {showCancelModal && (
          <CancelSubscription
            onClose={() => setShowCancelModal(false)}
            onSuccess={() => {
              setShowCancelModal(false);
              refetchSubscription();
            }}
          />
        )}
      </div>
    </div>
  );
}
