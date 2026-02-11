'use client';

import SpotCard from '@/components/SpotCard';
import SpotCategoryList from '@/components/SpotCategoryList';
import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_SPOTS } from '@/graphql/queries/getSpots';
import { GetSpotsQuery } from '@/__generated__/types';
import '@/styles/SpotsPage.css';

export default function SpotsPage() {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

    const { loading, error, data } = useQuery<GetSpotsQuery>(GET_SPOTS);

    if (loading) return <div className="spots-loading-container">読み込み中...</div>;
    if (error) return <div className="spots-error-container">エラーが発生しました</div>;

    // カテゴリーでフィルタリング
    const filteredSpots = data?.spots.filter(spot => {
        if (!selectedCategoryId) return true;
        return spot.categories.some(category => category.id === selectedCategoryId);
    }) || [];

    return (
        <div className="spots-container">
            {/* カテゴリーリスト */}
            <section className="spots-category-section">
                <SpotCategoryList
                    categories={data?.categories || []}
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={setSelectedCategoryId}
                />
            </section>

            {/* スポット一覧 */}
            {filteredSpots.length === 0 ? (
                <div className="spots-empty-container">
                    <p className="spots-empty-message">スポットがありません</p>
                </div>
            ) : (
                <div className="spots-grid">
                    {filteredSpots.map((spot) => (
                        <SpotCard
                            key={spot.id}
                            id={spot.id}
                            spotName={spot.spotName}
                            address={spot.address}
                            catchphrase={spot.catchphrase}
                            imageUrl={spot.imageUrl}
                            reviewRating={spot.reviewRating}
                            reviewCount={spot.reviewCount}
                            budgetRange={spot.budgetRange}
                            categoryNames={spot.categories.map(category => category.name)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
