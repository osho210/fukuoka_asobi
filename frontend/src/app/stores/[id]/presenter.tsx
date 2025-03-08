'use client';
import type { Store, Category, Area, Hashtag, OpeningHour } from '../../../types/store';
import Link from 'next/link';

interface StoreProps {
    store: Store
}

export default function StorePresenter({ store }: StoreProps) {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Link href="/" className="text-blue-600 hover:text-blue-800">
                    &larr; 店舗一覧に戻る
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-2">{store.storeName}</h1>
                    {store.catchphrase && (
                        <p className="text-xl text-gray-600 mb-6">{store.catchphrase}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h2 className="text-xl font-semibold mb-4">基本情報</h2>
                            <div className="space-y-3">
                                <p className="flex items-start">
                                    <span className="font-medium w-32">エリア:</span>
                                    <span>{store.district.district_name} - {store.areas.map((area: Area) => area.areaName).join(', ')}</span>
                                </p>
                                {store.address && (
                                    <p className="flex items-start">
                                        <span className="font-medium w-32">住所:</span>
                                        <span>{store.address}</span>
                                    </p>
                                )}
                                {store.phoneNumber && (
                                    <p className="flex items-start">
                                        <span className="font-medium w-32">電話番号:</span>
                                        <span>{store.phoneNumber}</span>
                                    </p>
                                )}
                                {store.nearestStation && (
                                    <p className="flex items-start">
                                        <span className="font-medium w-32">最寄り駅:</span>
                                        <span>{store.nearestStation}</span>
                                    </p>
                                )}
                                {store.website && (
                                    <p className="flex items-start">
                                        <span className="font-medium w-32">ウェブサイト:</span>
                                        <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                            {store.website}
                                        </a>
                                    </p>
                                )}
                                {store.instagramUrl && (
                                    <p className="flex items-start">
                                        <span className="font-medium w-32">Instagram:</span>
                                        <a href={store.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                            {store.instagramUrl}
                                        </a>
                                    </p>
                                )}
                                {store.budgetRange && (
                                    <p className="flex items-start">
                                        <span className="font-medium w-32">予算:</span>
                                        <span>{store.budgetRange}</span>
                                    </p>
                                )}
                                {store.parkingAvailable !== null && (
                                    <p className="flex items-start">
                                        <span className="font-medium w-32">駐車場:</span>
                                        <span>{store.parkingAvailable ? 'あり' : 'なし'}</span>
                                    </p>
                                )}
                                {store.isRainyOk !== null && (
                                    <p className="flex items-start">
                                        <span className="font-medium w-32">雨天時:</span>
                                        <span>{store.isRainyOk ? '利用可' : '利用不可'}</span>
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold mb-4">詳細情報</h2>
                            <div className="space-y-3">
                                {store.reviewRating && (
                                    <p className="flex items-start">
                                        <span className="font-medium w-32">評価:</span>
                                        <span>{store.reviewRating} / 5.0 ({store.reviewCount}件のレビュー)</span>
                                    </p>
                                )}
                                {store.recommendedFor1 && (
                                    <p className="flex items-start">
                                        <span className="font-medium w-32">おすすめ1:</span>
                                        <span>{store.recommendedFor1}</span>
                                    </p>
                                )}
                                {store.recommendedFor2 && (
                                    <p className="flex items-start">
                                        <span className="font-medium w-32">おすすめ2:</span>
                                        <span>{store.recommendedFor2}</span>
                                    </p>
                                )}
                                {store.minPeople && store.maxPeople && (
                                    <p className="flex items-start">
                                        <span className="font-medium w-32">人数:</span>
                                        <span>{store.minPeople}〜{store.maxPeople}人</span>
                                    </p>
                                )}
                                {store.theme && (
                                    <p className="flex items-start">
                                        <span className="font-medium w-32">テーマ:</span>
                                        <span>{store.theme}</span>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-4">カテゴリー</h2>
                        <div className="flex flex-wrap gap-2">
                            {store.categories.map((category: Category) => (
                                <span key={category.id} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                    {category.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    {store.hashtags.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">ハッシュタグ</h2>
                            <div className="flex flex-wrap gap-2">
                                {store.hashtags.map((hashtag: Hashtag) => (
                                    <span key={hashtag.id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full">
                                        {hashtag.hashtagName}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {store.openingHours && store.openingHours.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold mb-4">営業時間</h2>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">曜日</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">開店時間</th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">閉店時間</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {store.openingHours.map((hour: OpeningHour) => (
                                            <tr key={hour.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{hour.dayOfWeek}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(hour.openTime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {new Date(hour.closeTime).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
