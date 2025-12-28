'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import '@/styles/experience-cards.css';
import { GET_ALL_EXPERIENCE_CARDS } from '@/graphql/queries/getExperienceCards';
import type { GetAllExperienceCardsQuery } from '@/__generated__/types';

export default function ExperienceCardsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { data, loading, error } = useQuery<GetAllExperienceCardsQuery>(GET_ALL_EXPERIENCE_CARDS);

    const filteredCards = data?.allExperienceCards?.filter((card) =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.area?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

    if (loading) return <div className="experience-cards__loading">読み込み中...</div>;
    if (error) return <div className="experience-cards__error">エラー: {error.message}</div>;

    return (
        <div className="experience-cards">
            <div className="experience-cards__header">
                <h1 className="experience-cards__title">体験カード管理</h1>
                <Link href="/experience_cards/new" className="experience-cards__create-button">
                    新規作成
                </Link>
            </div>

            {/* 検索フィルター */}
            <div className="experience-cards__search">
                <input
                    type="text"
                    placeholder="タイトル、エリア、タグで検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="experience-cards__search-input"
                />
            </div>

            {/* カード一覧テーブル */}
            <div className="experience-cards__table-container">
                <table className="experience-cards__table">
                    <thead className="experience-cards__table-header">
                        <tr>
                            <th className="experience-cards__table-header-cell">タイトル</th>
                            <th className="experience-cards__table-header-cell">エリア</th>
                            <th className="experience-cards__table-header-cell">所要時間</th>
                            <th className="experience-cards__table-header-cell">時間帯</th>
                            <th className="experience-cards__table-header-cell">タグ</th>
                            <th className="experience-cards__table-header-cell">ステータス</th>
                            <th className="experience-cards__table-header-cell">作成日</th>
                            <th className="experience-cards__table-header-cell">操作</th>
                        </tr>
                    </thead>
                    <tbody className="experience-cards__table-body">
                        {filteredCards.map((card) => (
                            <tr key={card.id} className="experience-cards__table-row">
                                <td className="experience-cards__table-cell">
                                    <div className="experience-cards__title-cell">{card.title}</div>
                                </td>
                                <td className="experience-cards__table-cell">
                                    <span className="experience-cards__area">{card.area || '-'}</span>
                                </td>
                                <td className="experience-cards__table-cell">
                                    <span className="experience-cards__duration">{card.duration || '-'}</span>
                                </td>
                                <td className="experience-cards__table-cell">
                                    <span className="experience-cards__time-slot">{card.timeSlot || '-'}</span>
                                </td>
                                <td className="experience-cards__table-cell">
                                    <div className="experience-cards__tags">
                                        {card.tags?.map((tag) => (
                                            <span key={tag} className="experience-cards__tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="experience-cards__table-cell">
                                    <span className={`experience-cards__status ${card.active ? 'experience-cards__status--active' : 'experience-cards__status--inactive'}`}>
                                        {card.active ? 'アクティブ' : '非アクティブ'}
                                    </span>
                                </td>
                                <td className="experience-cards__table-cell">
                                    {new Date(card.createdAt).toLocaleDateString('ja-JP')}
                                </td>
                                <td className="experience-cards__table-cell">
                                    <div className="experience-cards__actions">
                                        <Link
                                            href={`/experience_cards/${card.id}`}
                                            className="experience-cards__action-link"
                                        >
                                            編集
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredCards.length === 0 && (
                    <div className="experience-cards__empty">
                        <div className="experience-cards__empty-text">
                            {searchTerm ? '検索条件に一致するカードが見つかりません' : 'カードがありません'}
                        </div>
                    </div>
                )}
            </div>

            {/* 統計情報 */}
            <div className="experience-cards__stats">
                <div className="experience-cards__stat-card">
                    <div className="experience-cards__stat-label">総カード数</div>
                    <div className="experience-cards__stat-value">{data?.allExperienceCards?.length || 0}</div>
                </div>
                <div className="experience-cards__stat-card">
                    <div className="experience-cards__stat-label">アクティブ</div>
                    <div className="experience-cards__stat-value experience-cards__stat-value--active">
                        {data?.allExperienceCards?.filter((c) => c.active).length || 0}
                    </div>
                </div>
                <div className="experience-cards__stat-card">
                    <div className="experience-cards__stat-label">非アクティブ</div>
                    <div className="experience-cards__stat-value experience-cards__stat-value--inactive">
                        {data?.allExperienceCards?.filter((c) => !c.active).length || 0}
                    </div>
                </div>
            </div>
        </div>
    );
}