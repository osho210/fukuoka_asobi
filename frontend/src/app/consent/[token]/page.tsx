'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_CONSENT_REQUEST_BY_TOKEN } from '@/graphql/queries/consents';
import { CREATE_CONSENT_AGREEMENT } from '@/graphql/mutations/consents';

export default function ConsentFormPage() {
  const params = useParams();
  const router = useRouter();
  const token = params.token as string;

  const [formData, setFormData] = useState({
    signerName: '',
    signerInstagram: '',
    photographerName: '',
    tagStoreRequested: false,
    tagPhotographerRequested: false,
    tagAccountsText: '',
    rightsConfirmed: false,
    agreed: false,
  });

  const [submitted, setSubmitted] = useState(false);
  const [getConsentRequest, { data: requestData, loading: requestLoading, error: requestError }] =
    useLazyQuery(GET_CONSENT_REQUEST_BY_TOKEN);
  
  const [createAgreement, { loading: submitLoading }] = useMutation(CREATE_CONSENT_AGREEMENT, {
    onCompleted: (data) => {
      if (data.createConsentAgreement.errors.length === 0) {
        setSubmitted(true);
      } else {
        alert('エラー: ' + data.createConsentAgreement.errors.join(', '));
      }
    },
    onError: (error) => {
      alert('エラー: ' + error.message);
    },
  });

  useEffect(() => {
    if (token) {
      getConsentRequest({ variables: { token } });
    }
  }, [token, getConsentRequest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.rightsConfirmed || !formData.agreed) {
      alert('すべての同意項目にチェックを入れてください');
      return;
    }

    await createAgreement({
      variables: {
        token,
        signerName: formData.signerName,
        rightsConfirmed: formData.rightsConfirmed,
        signerInstagram: formData.signerInstagram || null,
        photographerName: formData.photographerName || null,
        tagStoreRequested: formData.tagStoreRequested,
        tagPhotographerRequested: formData.tagPhotographerRequested,
        tagAccountsText: formData.tagAccountsText || null,
        ipAddress: null,
        userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      },
    });
  };

  if (requestLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (requestError || !requestData?.consentRequest) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">エラー</h2>
          <p className="text-gray-700 mb-4">
            {requestError ? 'データの取得に失敗しました' : '無効なURLです'}
          </p>
          <p className="text-sm text-gray-500">
            URLが正しいか確認してください。有効期限が切れている可能性もあります。
          </p>
        </div>
      </div>
    );
  }

  const request = requestData.consentRequest;

  if (request.status === 'APPROVED') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-4">承諾済み</h2>
          <p className="text-gray-700">
            この依頼は既に承諾されています。
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-4">
            <svg className="mx-auto h-16 w-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">承諾完了</h2>
          <p className="text-gray-700 mb-6">
            画像利用の承諾ありがとうございます。<br />
            承諾内容を記録しました。
          </p>
          <p className="text-sm text-gray-500">
            このページを閉じていただいて構いません。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            画像利用承諾フォーム
          </h1>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-blue-900 mb-4">承諾内容</h2>
            <div className="space-y-3 text-sm text-blue-800">
              <div>
                <span className="font-semibold">対象店舗:</span> {request.spot.spotName}
              </div>
              <div>
                <span className="font-semibold">店舗住所:</span> {request.spot.address}
              </div>
              <div className="border-t border-blue-200 pt-3 mt-3">
                <p className="font-semibold mb-2">利用条件:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>利用媒体: 福岡遊び日記 Webメディア / Instagram（公式アカウント）</li>
                  <li>利用範囲: 投稿 / ストーリーズ</li>
                  <li>クレジット表記: 店舗名 / 撮影者名（ご指定の場合）</li>
                  <li>改変: レイアウト都合のトリミングや文字入れを行う場合があります</li>
                </ul>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                お名前 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.signerName}
                onChange={(e) => setFormData({ ...formData, signerName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instagramアカウント名（任意）
              </label>
              <input
                type="text"
                value={formData.signerInstagram}
                onChange={(e) => setFormData({ ...formData, signerInstagram: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="@username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                撮影者名（異なる場合のみ）
              </label>
              <input
                type="text"
                value={formData.photographerName}
                onChange={(e) => setFormData({ ...formData, photographerName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">タグ付け希望</p>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.tagStoreRequested}
                  onChange={(e) => setFormData({ ...formData, tagStoreRequested: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">店舗アカウントのタグ付けを希望</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.tagPhotographerRequested}
                  onChange={(e) => setFormData({ ...formData, tagPhotographerRequested: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">撮影者アカウントのタグ付けを希望</span>
              </label>
              {(formData.tagStoreRequested || formData.tagPhotographerRequested) && (
                <input
                  type="text"
                  value={formData.tagAccountsText}
                  onChange={(e) => setFormData({ ...formData, tagAccountsText: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="タグ付け希望のアカウント名（例: @username）"
                />
              )}
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.rightsConfirmed}
                    onChange={(e) => setFormData({ ...formData, rightsConfirmed: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    <span className="text-red-500">*</span> 私は当該画像の権利者、または権利者から利用許諾を得ています
                  </span>
                </label>
                <label className="flex items-start">
                  <input
                    type="checkbox"
                    checked={formData.agreed}
                    onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                    required
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    <span className="text-red-500">*</span> 上記の利用条件に同意します
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitLoading || !formData.rightsConfirmed || !formData.agreed}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {submitLoading ? '送信中...' : '同意して送信'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
