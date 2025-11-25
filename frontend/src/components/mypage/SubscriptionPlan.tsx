'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_SUBSCRIPTION } from '@/graphql/subscription';
import { loadStripe } from '@stripe/stripe-js';
import '@/styles/SubscriptionPlan.css';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export const SubscriptionPlan: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [createSubscription] = useMutation(CREATE_SUBSCRIPTION);

  const handleSubscribe = async () => {
    setLoading(true);
    setError(null);

    try {
      const successUrl = `${window.location.origin}/mypage/subscription?success=true`;
      const cancelUrl = `${window.location.origin}/mypage/subscription?canceled=true`;

      const { data } = await createSubscription({
        variables: {
          successUrl,
          cancelUrl,
        },
      });

      if (data?.createSubscription?.errors?.length > 0) {
        setError(data.createSubscription.errors.join(', '));
        setLoading(false);
        return;
      }

      const sessionId = data?.createSubscription?.sessionId;
      if (!sessionId) {
        setError('セッションIDの取得に失敗しました');
        setLoading(false);
        return;
      }

      // Stripe Checkoutにリダイレクト
      const stripe = await stripePromise;
      if (!stripe) {
        setError('決済システムの初期化に失敗しました。ページを再読み込みしてください。');
        setLoading(false);
        return;
      }

      const { error: stripeError } = await stripe.redirectToCheckout({ sessionId });
      if (stripeError) {
        setError(stripeError.message || '決済ページへの遷移に失敗しました。もう一度お試しください。');
        setLoading(false);
      }
    } catch (err) {
      console.error('Subscription error:', err);
      setError('予期しないエラーが発生しました。しばらく時間をおいてから再度お試しください。');
      setLoading(false);
    }
  };

  return (
    <div className="subscription-plan-container">
      <div className="subscription-plan-header">
        <h2 className="subscription-plan-title">有料会員プラン</h2>
        <p className="subscription-plan-subtitle">もっと自由に、もっと楽しく福岡を遊ぼう</p>
      </div>

      <div className="subscription-plan-card">
        <div className="subscription-plan-price">
          <div className="subscription-plan-amount">
            ¥500
            <span className="subscription-plan-amount-unit">/月</span>
          </div>
          <p className="subscription-plan-tax-note">税込価格</p>
        </div>

        <div className="subscription-plan-benefits">
          <h3 className="subscription-plan-benefits-title">会員特典</h3>
          <ul className="subscription-plan-benefits-list">
            <li className="subscription-plan-benefit-item">
              <svg
                className="subscription-plan-benefit-check"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="subscription-plan-benefit-text">無制限のプラン検索機能</span>
            </li>
            <li className="subscription-plan-benefit-item">
              <svg
                className="subscription-plan-benefit-check"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="subscription-plan-benefit-text">詳細オプションを利用したプラン作成機能</span>
            </li>
            <li className="subscription-plan-benefit-item">
              <svg
                className="subscription-plan-benefit-check"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="subscription-plan-benefit-text">お気に入り機能の無制限利用</span>
            </li>
            <li className="subscription-plan-benefit-item">
              <svg
                className="subscription-plan-benefit-check"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="subscription-plan-benefit-text">広告なしの快適な閲覧体験</span>
            </li>
            <li className="subscription-plan-benefit-item">
              <svg
                className="subscription-plan-benefit-check"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span className="subscription-plan-benefit-text">新機能への優先アクセス</span>
            </li>
          </ul>
        </div>
      </div>

      {error && (
        <div className="subscription-plan-error">
          <p className="subscription-plan-error-text">{error}</p>
        </div>
      )}

      <button
        onClick={handleSubscribe}
        disabled={loading}
        className="subscription-plan-button"
      >
        {loading ? '処理中...' : '今すぐ有料会員になる'}
      </button>

      <div className="subscription-plan-footer">
        <p>いつでもキャンセル可能です</p>
        <p>決済はStripeを通じて安全に処理されます</p>
      </div>
    </div>
  );
};
