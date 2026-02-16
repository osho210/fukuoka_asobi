'use client';

import { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/TextField';
import { Select } from '@/components/forms/Select';
import { TextArea } from '@/components/forms/TextArea';
import { CREATE_LICENSED_ASSET } from '@/graphql/mutations/consents';
import { GET_CONSENT_REQUESTS } from '@/graphql/queries/consents';
import { ArrowLeft, Save, Upload } from 'lucide-react';

// GraphQL レスポンスの型定義
interface ConsentAgreement {
  id: number;
  signerName: string;
  agreedAt: string;
}

interface Spot {
  id: number;
  spotName: string;
}

interface ConsentRequest {
  id: number;
  spotId: string;
  consenterDisplayName: string;
  consentAgreement: ConsentAgreement | null;
  spot: Spot;
}

interface GetConsentRequestsData {
  consentRequests: ConsentRequest[];
}
interface CreateLicensedAssetData {
  createLicensedAsset: {
    licensedAsset: {
      id: string;
    } | null;
    errors: string[];
  };
}

export default function NewLicensedAssetPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    consentRequestId: '',
    assetType: 'URL',
    assetUrl: '',
    assetFile: '',
    sourceUrl: '',
    captionNote: '',
  });

  const { data: consentData } = useQuery<GetConsentRequestsData>(GET_CONSENT_REQUESTS, {
    variables: { status: 'APPROVED' },
  });

  const [createLicensedAsset, { loading }] = useMutation<CreateLicensedAssetData>(CREATE_LICENSED_ASSET, {
    onCompleted: (data) => {
      if (data?.createLicensedAsset?.licensedAsset) {
        alert('画像を登録しました');
        router.push('/licensed_assets');
      } else if (data?.createLicensedAsset?.errors) {
        alert('エラー: ' + data.createLicensedAsset.errors.join(', '));
      }
    },
    onError: (error) => {
      alert('エラー: ' + error.message);
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // フルフォーマット（data:image/...;base64,xxx）で保存
        setFormData({ ...formData, assetFile: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 選択されたconsent requestを取得
    const selectedConsentRequest = consentData?.consentRequests.find(
      (req) => req.id.toString() === formData.consentRequestId
    );

    if (!selectedConsentRequest) {
      alert('承諾情報が見つかりません');
      return;
    }

    await createLicensedAsset({
      variables: {
        input: {
          spotId: parseInt(selectedConsentRequest.spotId),
          consentAgreementId: selectedConsentRequest.consentAgreement
            ? parseInt(selectedConsentRequest.consentAgreement.id.toString())
            : null,
          assetType: formData.assetType,
          assetUrl: formData.assetType === 'URL' ? formData.assetUrl : null,
          assetFile: formData.assetType === 'UPLOAD' ? formData.assetFile : null,
          sourceUrl: formData.sourceUrl || null,
          captionNote: formData.captionNote || null,
        },
      },
    });
  };

  const consentOptions = consentData?.consentRequests
    ?.map((req) => ({
      value: req.id.toString(),
      label: `${req.spot.spotName} - ${req.consenterDisplayName}${req.consentAgreement ? '' : ' (同意書未作成)'}`,
    })) || [];

  const assetTypeOptions = [
    { value: 'URL', label: '画像URL' },
    { value: 'UPLOAD', label: 'アップロード' },
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
        <h1 className="text-3xl font-bold mb-6">承諾済み画像の登録</h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-lg shadow p-6">
          <Select
            label="承諾情報"
            value={formData.consentRequestId}
            onChange={(value) => setFormData({ ...formData, consentRequestId: value })}
            options={consentOptions}
            required
          />

          <Select
            label="登録方法"
            value={formData.assetType}
            onChange={(value) => setFormData({ ...formData, assetType: value })}
            options={assetTypeOptions}
            required
          />

          {formData.assetType === 'URL' ? (
            <TextField
              label="画像URL"
              value={formData.assetUrl}
              onChange={(e) => setFormData({ ...formData, assetUrl: e.target.value })}
              placeholder="https://example.com/image.jpg"
              required
            />
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                画像ファイル <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <Upload className="w-10 h-10 mb-3 text-gray-400" />
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">クリックしてアップロード</span>
                    </p>
                    <p className="text-xs text-gray-500">PNG, JPG (MAX. 10MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                </label>
              </div>
              {formData.assetFile && (
                <p className="mt-2 text-sm text-green-600">
                  ✓ ファイルが選択されました
                </p>
              )}
            </div>
          )}

          <TextField
            label="元投稿URL（任意）"
            value={formData.sourceUrl}
            onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
            placeholder="https://instagram.com/p/..."
          />

          <TextArea
            label="説明（任意）"
            value={formData.captionNote}
            onChange={(e) => setFormData({ ...formData, captionNote: e.target.value })}
            placeholder="画像の説明やメモ"
            rows={3}
          />

          <div className="flex gap-4">
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? '登録中...' : '画像を登録'}
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
