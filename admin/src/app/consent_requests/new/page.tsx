'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/TextField';
import { Select } from '@/components/forms/Select';
import { CREATE_CONSENT_REQUEST } from '@/graphql/mutations/consents';
import { GET_SPOTS } from '@/graphql/queries/getSpots';
import { ArrowLeft, Save } from 'lucide-react';

export default function NewConsentRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    spotId: '',
    consenterType: 'STORE',
    consenterDisplayName: '',
    contactHint: '',
  });

  const { data: spotsData } = useQuery(GET_SPOTS);
  const [createConsentRequest, { loading }] = useMutation(CREATE_CONSENT_REQUEST, {
    onCompleted: (data) => {
      if (data.createConsentRequest.errors.length === 0) {
        alert('承諾依頼を作成しました');
        router.push('/consent_requests');
      } else {
        alert('エラー: ' + data.createConsentRequest.errors.join(', '));
      }
    },
    onError: (error) => {
      alert('エラー: ' + error.message);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createConsentRequest({
      variables: {
        input: {
          spotId: parseInt(formData.spotId),
          consenterType: formData.consenterType,
          consenterDisplayName: formData.consenterDisplayName,
          contactHint: formData.contactHint || null,
        },
      },
    });
  };

  const spotOptions = spotsData?.spots?.map((spot: any) => ({
    value: spot.id,
    label: spot.spotName,
  })) || [];

  const consenterTypeOptions = [
    { value: 'STORE', label: '店舗' },
    { value: 'INSTAGRAM_USER', label: 'Instagram利用者' },
  ];

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          戻る
        </Button>
      </div>

      <div className="max-w-2xl">
        <h1 className="text-3xl font-bold mb-6">画像利用承諾依頼の作成</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
          <Select
            label="対象店舗"
            value={formData.spotId}
            onChange={(value) => setFormData({ ...formData, spotId: value })}
            options={spotOptions}
            required
          />

          <Select
            label="承諾者タイプ"
            value={formData.consenterType}
            onChange={(value) => setFormData({ ...formData, consenterType: value })}
            options={consenterTypeOptions}
            required
          />

          <TextField
            label="承諾者表示名"
            value={formData.consenterDisplayName}
            onChange={(e) => setFormData({ ...formData, consenterDisplayName: e.target.value })}
            placeholder={formData.consenterType === 'STORE' ? '例: 店長 田中' : '例: @username'}
            required
          />

          <TextField
            label="連絡手段（任意）"
            value={formData.contactHint}
            onChange={(e) => setFormData({ ...formData, contactHint: e.target.value })}
            placeholder="Instagram DM、メール、電話など"
          />

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">承諾条件（MVP固定）</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• 利用媒体: Webメディア / Instagram（あなたのアカウント）</li>
              <li>• 利用範囲: 投稿 / ストーリーズ</li>
              <li>• クレジット表記: 店舗名 / 撮影者名 / タグ付け希望（フォームで選択）</li>
              <li>• 改変: トリミング・文字入れ等を許容</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? '作成中...' : '承諾依頼を作成'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              キャンセル
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
