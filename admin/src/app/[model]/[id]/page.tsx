'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/TextField';
import { TextArea } from '@/components/forms/TextArea';
import { Select } from '@/components/forms/Select';
import { ToggleSwitch } from '@/components/forms/ToggleSwitch';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';

// モデルデータの型定義
interface ModelData {
  id: string;
  [key: string]: string | number | boolean | object | null;
}

// 関連データの型定義
interface RelationData {
  id: string;
  [key: string]: string | number | boolean | object | null;
}

// ダミーデータ（GraphQLが未実装の場合に使用）
const dummyData: Record<string, Record<string, ModelData>> = {
  areas: {
    '1': { id: '1', areaName: '天神', district: { id: '1', districtName: '福岡市中央区' }, updatedAt: '2025-04-01T10:00:00Z' },
    '2': { id: '2', areaName: '博多', district: { id: '2', districtName: '福岡市博多区' }, updatedAt: '2025-04-02T10:00:00Z' },
  },
  categories: {
    '1': { id: '1', categoryName: 'カフェ', updatedAt: '2025-04-01T10:00:00Z' },
    '2': { id: '2', categoryName: 'レストラン', updatedAt: '2025-04-02T10:00:00Z' },
  },
  districts: {
    '1': { id: '1', districtName: '福岡市中央区', updatedAt: '2025-04-01T10:00:00Z' },
    '2': { id: '2', districtName: '福岡市博多区', updatedAt: '2025-04-02T10:00:00Z' },
  },
  hashtags: {
    '1': { id: '1', hashtagName: 'おしゃれ', updatedAt: '2025-04-01T10:00:00Z' },
    '2': { id: '2', hashtagName: '穴場', updatedAt: '2025-04-02T10:00:00Z' },
  },
  menus: {
    '1': { id: '1', menuName: 'モーニング', updatedAt: '2025-04-01T10:00:00Z' },
    '2': { id: '2', menuName: 'ランチ', updatedAt: '2025-04-02T10:00:00Z' },
  },
  purposes: {
    '1': { id: '1', purposeName: 'デート', updatedAt: '2025-04-01T10:00:00Z' },
    '2': { id: '2', purposeName: '女子会', updatedAt: '2025-04-02T10:00:00Z' },
  },
  recommended_fors: {
    '1': { id: '1', recommendedForName: 'カップル', updatedAt: '2025-04-01T10:00:00Z' },
    '2': { id: '2', recommendedForName: '友達同士', updatedAt: '2025-04-02T10:00:00Z' },
  },
  spot_ambiances: {
    '1': { id: '1', ambianceName: '落ち着いた', updatedAt: '2025-04-01T10:00:00Z' },
    '2': { id: '2', ambianceName: '賑やか', updatedAt: '2025-04-02T10:00:00Z' },
  },
  spots: {
    '1': {
      id: '1',
      storeName: 'カフェA',
      address: '福岡市中央区天神1-1-1',
      district: { id: '1', districtName: '福岡市中央区' },
      phone: '092-123-4567',
      website: 'https://example.com',
      catchphrase: '天神の隠れ家カフェ',
      isRainyOk: true,
      budgetRange: '普通',
      updatedAt: '2025-04-01T10:00:00Z'
    },
    '2': {
      id: '2',
      storeName: 'レストランB',
      address: '福岡市博多区博多駅前2-2-2',
      district: { id: '2', districtName: '福岡市博多区' },
      phone: '092-987-6543',
      website: 'https://example.org',
      catchphrase: '博多の人気レストラン',
      isRainyOk: false,
      budgetRange: '高い',
      updatedAt: '2025-04-02T10:00:00Z'
    },
  },
};

// モデル名の日本語表示
const modelDisplayNames: Record<string, string> = {
  areas: 'エリア',
  categories: 'カテゴリー',
  districts: '地区',
  hashtags: 'ハッシュタグ',
  menus: 'メニュー',
  purposes: '目的',
  recommended_fors: 'おすすめ対象',
  spot_ambiances: '雰囲気',
  spots: 'スポット',
  play_plans: '遊びプラン',
  events: 'イベント',
  news: 'ニュース',
};

// 各モデルのフィールド定義
const modelFields: Record<string, { name: string; type: string; required?: boolean }[]> = {
  areas: [
    { name: 'areaName', type: 'text', required: true },
    { name: 'district', type: 'relation', required: true },
  ],
  categories: [
    { name: 'categoryName', type: 'text', required: true },
  ],
  districts: [
    { name: 'districtName', type: 'text', required: true },
  ],
  hashtags: [
    { name: 'hashtagName', type: 'text', required: true },
  ],
  menus: [
    { name: 'menuName', type: 'text', required: true },
  ],
  purposes: [
    { name: 'purposeName', type: 'text', required: true },
  ],
  recommended_fors: [
    { name: 'recommendedForName', type: 'text', required: true },
  ],
  spot_ambiances: [
    { name: 'ambianceName', type: 'text', required: true },
  ],
  spots: [
    { name: 'storeName', type: 'text', required: true },
    { name: 'address', type: 'text', required: true },
    { name: 'district', type: 'relation', required: true },
    { name: 'phone', type: 'text' },
    { name: 'website', type: 'text' },
    { name: 'catchphrase', type: 'text' },
    { name: 'isRainyOk', type: 'boolean' },
    { name: 'budgetRange', type: 'select', required: true },
  ],
};

// フィールド名の日本語表示
const fieldDisplayNames: Record<string, string> = {
  areaName: 'エリア名',
  district: '地区',
  categoryName: 'カテゴリー名',
  districtName: '地区名',
  hashtagName: 'ハッシュタグ名',
  menuName: 'メニュー名',
  purposeName: '目的名',
  recommendedForName: 'おすすめ対象名',
  ambianceName: '雰囲気名',
  storeName: '店舗名',
  address: '住所',
  phone: '電話番号',
  website: 'ウェブサイト',
  catchphrase: 'キャッチフレーズ',
  isRainyOk: '雨天可否',
  budgetRange: '予算感',
};

// 選択肢の定義
const selectOptions: Record<string, { value: string; label: string }[]> = {
  budgetRange: [
    { value: '安い', label: '安い' },
    { value: '普通', label: '普通' },
    { value: '高い', label: '高い' },
  ],
};

export default function ModelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const modelRoute = params.model as string;
  const id = params.id as string;
  const isNew = id === 'new';

  const [formData, setFormData] = useState<ModelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fieldLabel = modelDisplayNames[modelRoute] || modelRoute;
  const fields = modelFields[modelRoute] || [];

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        if (isNew) {
          // 新規作成の場合は空のフォームデータを作成
          const newData: ModelData = { id: '' };
          setFormData(newData);
        } else {
          // 既存データの取得（ダミーデータを使用）
          const data = dummyData[modelRoute]?.[id];
          if (data) {
            setFormData(data);
          } else {
            console.error('データが見つかりません');
          }
        }
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [modelRoute, id, isNew]);

  const handleChange = (name: string, value: string | boolean | RelationData) => {
    if (!formData) return;

    setFormData({
      ...formData,
      [name]: value,
    });

    // エラーをクリア
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    fields.forEach((field) => {
      if (field.required && !formData?.[field.name]) {
        newErrors[field.name] = '必須項目です';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSaving(true);

    try {
      // GraphQLミューテーションの代わりにダミー処理
      console.log('保存データ:', formData);

      // 成功したら一覧ページに戻る
      router.push(`/admin/${modelRoute}`);
    } catch (error) {
      console.error('保存に失敗しました:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    try {
      // GraphQLミューテーションの代わりにダミー処理
      console.log('削除データ:', formData);

      // 成功したら一覧ページに戻る
      router.push(`/admin/${modelRoute}`);
    } catch (error) {
      console.error('削除に失敗しました:', error);
    }
  };

  if (isLoading) {
    return <div className="p-4">読み込み中...</div>;
  }

  if (!formData) {
    return <div className="p-4">データが見つかりません</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/admin/${modelRoute}`)}
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            戻る
          </Button>
          <h1 className="text-2xl font-bold">
            {isNew ? `${fieldLabel}新規作成` : `${fieldLabel}編集`}
          </h1>
        </div>
        {!isNew && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSaving}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            削除
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fields.map((field) => {
            const fieldName = field.name;
            const fieldLabel = fieldDisplayNames[fieldName] || fieldName;
            const value = formData[fieldName];
            const error = errors[fieldName];

            switch (field.type) {
              case 'text':
                return (
                  <TextField
                    key={fieldName}
                    id={fieldName}
                    name={fieldName}
                    label={fieldLabel}
                    value={value as string || ''}
                    onChange={(e) => handleChange(fieldName, e.target.value)}
                    required={field.required}
                    error={error}
                    fullWidth
                  />
                );
              case 'textarea':
                return (
                  <TextArea
                    key={fieldName}
                    id={fieldName}
                    name={fieldName}
                    label={fieldLabel}
                    value={value as string || ''}
                    onChange={(e) => handleChange(fieldName, e.target.value)}
                    required={field.required}
                    error={error}
                    fullWidth
                  />
                );
              case 'boolean':
                return (
                  <ToggleSwitch
                    key={fieldName}
                    id={fieldName}
                    name={fieldName}
                    label={fieldLabel}
                    checked={Boolean(value)}
                    onChange={(checked) => handleChange(fieldName, checked)}
                    required={field.required}
                    error={error}
                  />
                );
              case 'select':
                return (
                  <Select
                    key={fieldName}
                    id={fieldName}
                    name={fieldName}
                    label={fieldLabel}
                    value={value as string || ''}
                    onChange={(val) => handleChange(fieldName, val)}
                    options={selectOptions[fieldName] || []}
                    required={field.required}
                    error={error}
                    fullWidth
                  />
                );
              case 'relation':
                // 関連データの選択は実際にはSelectAsyncを使用
                return (
                  <Select
                    key={fieldName}
                    id={fieldName}
                    name={fieldName}
                    label={fieldLabel}
                    value={(value as RelationData)?.id || ''}
                    onChange={(val) => handleChange(fieldName, { id: val } as RelationData)}
                    options={[
                      { value: '1', label: '福岡市中央区' },
                      { value: '2', label: '福岡市博多区' },
                    ]}
                    required={field.required}
                    error={error}
                    fullWidth
                  />
                );
              default:
                return null;
            }
          })}
        </div>

        <div className="mt-8 flex justify-end">
          <Button
            type="submit"
            disabled={isSaving}
          >
            <Save className="h-4 w-4 mr-1" />
            保存
          </Button>
        </div>
      </form>
    </div>
  );
}
