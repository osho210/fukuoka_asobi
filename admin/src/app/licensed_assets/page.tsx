'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { GET_LICENSED_ASSETS } from '@/graphql/queries/consents';
import { Plus, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

export default function LicensedAssetsPage() {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(GET_LICENSED_ASSETS);

  if (loading) return <div className="p-8">読み込み中...</div>;
  if (error) return <div className="p-8 text-red-600">エラー: {error.message}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">承諾済み画像管理</h1>
        <Button onClick={() => router.push('/licensed_assets/new')}>
          <Plus className="w-4 h-4 mr-2" />
          画像登録
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data?.licensedAssets?.map((asset: any) => (
          <div key={asset.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="aspect-square bg-gray-100 relative">
              {asset.imageUrl ? (
                <img
                  src={asset.imageUrl}
                  alt={asset.captionNote || '承諾済み画像'}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  画像なし
                </div>
              )}
              <div className="absolute top-2 right-2">
                {asset.usable ? (
                  <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    使用可能
                  </div>
                ) : (
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                    <XCircle className="w-3 h-3" />
                    停止中
                  </div>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2">
                {asset.spot?.spotName}
              </h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>
                  <span className="font-medium">承諾者:</span>{' '}
                  {asset.consentAgreement?.signerName}
                </div>
                {asset.consentAgreement?.photographerName && (
                  <div>
                    <span className="font-medium">撮影者:</span>{' '}
                    {asset.consentAgreement.photographerName}
                  </div>
                )}
                {asset.captionNote && (
                  <div className="mt-2">
                    <span className="font-medium">説明:</span>{' '}
                    {asset.captionNote}
                  </div>
                )}
                {(asset.consentAgreement?.tagStoreRequested ||
                  asset.consentAgreement?.tagPhotographerRequested) && (
                  <div className="mt-2 bg-blue-50 p-2 rounded">
                    <span className="text-xs font-medium text-blue-900">
                      タグ付け希望あり
                    </span>
                    {asset.consentAgreement?.tagAccountsText && (
                      <div className="text-xs text-blue-700 mt-1">
                        {asset.consentAgreement.tagAccountsText}
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="mt-4 flex gap-2">
                {asset.sourceUrl && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(asset.sourceUrl, '_blank')}
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    元投稿
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!data?.licensedAssets?.length && (
        <div className="text-center py-12 text-gray-500">
          承諾済み画像がまだありません
        </div>
      )}
    </div>
  );
}
