'use client';

import React from 'react';
import '@/styles/SubscriptionStatus.css';

interface User {
    id: string;
    username: string;
    isPaidMember: boolean;
    paidStartDate: string | null;
    paidEndDate: string | null;
}

interface SubscriptionStatusProps {
    user: User;
}

export const SubscriptionStatus: React.FC<SubscriptionStatusProps> = ({ user }) => {
    // 有料会員かどうかを判定
    const isPaid = user.isPaidMember && user.paidEndDate && new Date(user.paidEndDate) >= new Date();

    // 有効期限の表示形式を整える
    const formatDate = (dateString: string | null) => {
        if (!dateString) return '未設定';
        return new Date(dateString).toLocaleDateString('ja-JP', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className={'subscription-container'}>
            <div className={'subscription-status-card'}>
                <div className={'subscription-status-icon'}>
                    {isPaid ? (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={'subscription-icon-paid'}>
                            <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={'subscription-icon-free'}>
                            <path fillRule="evenodd" d="M6.72 5.66l11.62 11.62A8.25 8.25 0 006.72 5.66zm10.56 12.68L5.66 6.72a8.25 8.25 0 0011.62 11.62zM5.105 5.106c3.807-3.808 9.98-3.808 13.788 0 3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>

                <div className={'subscription-status-info'}>
                    <h3 className={'subscription-status-type'}>
                        {isPaid ? '有料会員' : '無料会員'}
                    </h3>

                    {isPaid && (
                        <div className={'subscription-dates'}>
                            <p className={'subscription-date-item'}>
                                <span className={'subscription-date-label'}>開始日:</span>
                                <span className={'subscription-date-value'}>{formatDate(user.paidStartDate)}</span>
                            </p>
                            <p className={'subscription-date-item'}>
                                <span className={'subscription-date-label'}>有効期限:</span>
                                <span className={'subscription-date-value'}>{formatDate(user.paidEndDate)}</span>
                            </p>
                        </div>
                    )}

                    <div className={'subscription-benefits'}>
                        <h4 className={'subscription-benefits-title'}>会員特典</h4>
                        <ul className={'subscription-benefits-list'}>
                            <li className={'subscription-benefit-item'}>
                                <span className={`${'subscription-benefit-check'} ${isPaid ? 'subscription-benefit-available' : ''}`}>
                                    {!isPaid! ? '✓' : '✗'}
                                </span>
                                <p>{!isPaid ? '基本検索機能の利用' : ''}</p>
                            </li>
                            <li className={'subscription-benefit-item'}>
                                <span className={`${'subscription-benefit-check'} ${isPaid ? 'subscription-benefit-available' : ''}`}>
                                    {!isPaid! ? '✓' : '✗'}
                                </span>
                                <p>{!isPaid ? '月3件までのプランの検索' : ''}</p>
                            </li>
                            <li className={'subscription-benefit-item'}>
                                <span className={`${'subscription-benefit-check'} ${isPaid ? 'subscription-benefit-available' : ''}`}>
                                    {isPaid! ? '✓' : '✗'}
                                </span>
                                <p>無制限のプラン検索機能</p>
                            </li>
                            <li className={'subscription-benefit-item'}>
                                <span className={`${'subscription-benefit-check'} ${isPaid ? 'subscription-benefit-available' : ''}`}>
                                    {isPaid! ? '✓' : '✗'}
                                </span>
                                <p>詳細オプションを利用したプラン作成機能</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {!isPaid && (
                <div className={'subscription-upgrade'}>
                    <button className={'subscription-upgrade-button'}>
                        有料会員にアップグレード
                    </button>
                    <p className={'subscription-upgrade-note'}>
                        ※ 有料会員になると、すべての特典が利用できるようになります。
                    </p >
                </div >
            )}
        </div >
    );
};
