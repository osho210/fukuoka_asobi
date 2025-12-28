'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import '@/styles/direction-cards.css';
import { GET_ALL_DIRECTION_CARDS } from '@/graphql/queries/getDirectionCards';
import type { GetAllDirectionCardsQuery } from '@/__generated__/types';

export default function DirectionCardsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const { data, loading, error } = useQuery<GetAllDirectionCardsQuery>(GET_ALL_DIRECTION_CARDS);

    const filteredCards = data?.allDirectionCards?.filter((card) =>
        card.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    ) || [];

    if (loading) return <div className="direction-cards__loading">読み込み中...</div>;
    if (error) return <div className="direction-cards__error">エラー: {error.message}</div>;

    return (
        <div className="direction-cards">
            <div className="direction-cards__header">
                <h1 className="direction-cards__title">方向性カード管理</h1>
                <Link href="/direction_cards/new" className="direction-cards__create-button">
                    新規作成
                </Link>
            </div>

            {/* 検索フィルター */}
            <div className="direction-cards__search">
                <input
                    type="text"
                    placeholder="テキストやタグで検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="direction-cards__search-input"
                />
            </div>

            {/* カード一覧テーブル */}
            <div className="direction-cards__table-container">
                <table className="direction-cards__table">
                    <thead className="direction-cards__table-header">
                        <tr>
                            <th className="direction-cards__table-header-cell">テキスト</th>
                            <th className="direction-cards__table-header-cell">タグ</th>
                            <th className="direction-cards__table-header-cell">重要度</th>
                            <th className="direction-cards__table-header-cell">ステータス</th>
                            <th className="direction-cards__table-header-cell">作成日</th>
                            <th className="direction-cards__table-header-cell">操作</th>
                        </tr>
                    </thead>
                    <tbody className="direction-cards__table-body">
                        {filteredCards.map((card) => (
                            <tr key={card.id} className="direction-cards__table-row">
                                <td className="direction-cards__table-cell">
                                    <div className="direction-cards__text">{card.text}</div>
                                </td>
                                <td className="direction-cards__table-cell">
                                    <div className="direction-cards__tags">
                                        {card.tags?.map((tag) => (
                                            <span key={tag} className="direction-cards__tag">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="direction-cards__table-cell">
                                    <span className="direction-cards__weight">{card.weight}</span>
                                </td>
                                <td className="direction-cards__table-cell">
                                    <span className={`direction-cards__status ${card.active ? 'direction-cards__status--active' : 'direction-cards__status--inactive'}`}>
                                        {card.active ? 'アクティブ' : '非アクティブ'}
                                    </span>
                                </td>
                                <td className="direction-cards__table-cell">
                                    {new Date(card.createdAt).toLocaleDateString('ja-JP')}
                                </td>
                                <td className="direction-cards__table-cell">
                                    <div className="direction-cards__actions">
                                        <Link
                                            href={`/direction_cards/${card.id}`}
                                            className="direction-cards__action-link"
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
                    <div className="direction-cards__empty">
                        <div className="direction-cards__empty-text">
                            {searchTerm ? '検索条件に一致するカードが見つかりません' : 'カードがありません'}
                        </div>
                    </div>
                )}
            </div>

            {/* 統計情報 */}
            <div className="direction-cards__stats">
                <div className="direction-cards__stat-card">
                    <div className="direction-cards__stat-label">総カード数</div>
                    <div className="direction-cards__stat-value">{data?.allDirectionCards?.length || 0}</div>
                </div>
                <div className="direction-cards__stat-card">
                    <div className="direction-cards__stat-label">アクティブ</div>
                    <div className="direction-cards__stat-value direction-cards__stat-value--active">
                        {data?.allDirectionCards?.filter((c) => c.active).length || 0}
                    </div>
                </div>
                <div className="direction-cards__stat-card">
                    <div className="direction-cards__stat-label">非アクティブ</div>
                    <div className="direction-cards__stat-value direction-cards__stat-value--inactive">
                        {data?.allDirectionCards?.filter((c) => !c.active).length || 0}
                    </div>
                </div>
            </div>
        </div>
    );
}