'use client';

import { useState, useEffect, useMemo } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/TextField';
import { TextArea } from '@/components/forms/TextArea';
import { Select } from '@/components/forms/Select';
import { ToggleSwitch } from '@/components/forms/ToggleSwitch';
import { Save, Trash2 } from 'lucide-react';
import { createModel, updateModel, deleteModel } from '@/lib/modelGraphQL';
import { ModelInput } from '@/lib/modelGraphQL';
import { useQuery } from '@apollo/client';
import { GET_SPOT_TYPE_ENUM, GET_BUDGET_RANGE_ENUM } from '@/graphql/queries/getEnumTypes';

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
const modelFields: Record<string, { name: string; type: string; required?: boolean; enumKey?: string }[]> = {
  areas: [
    { name: 'areaName', type: 'text', required: true },
    { name: 'district', type: 'relation', required: true },
  ],
  categories: [
    { name: 'name', type: 'text', required: true },
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
    { name: 'name', type: 'text', required: true },
  ],
  spot_ambiances: [
    { name: 'ambianceName', type: 'text', required: true },
  ],
  spots: [
    { name: 'spotName', type: 'text', required: true },
    { name: 'address', type: 'text', required: true },
    { name: 'district', type: 'relation', required: true },
    { name: 'phoneNumber', type: 'text' },
    { name: 'website', type: 'text' },
    { name: 'catchphrase', type: 'text' },
    { name: 'isRainyOk', type: 'boolean' },
    { name: 'isClosed', type: 'boolean' },
    { name: 'nearestStation', type: 'text' },
    { name: 'imageUrl', type: 'text' },
    { name: 'minPeople', type: 'number' },
    { name: 'maxPeople', type: 'number' },
    { name: 'recommendedFor1', type: 'text' },
    { name: 'recommendedFor2', type: 'text' },
    { name: 'reviewCount', type: 'number' },
    { name: 'reviewRating', type: 'number' },
    { name: 'instagramUrl', type: 'text' },
    { name: 'spotType', type: 'select', required: true, enumKey: 'SpotTypeEnum' },
    { name: 'budgetRange', type: 'select', required: true, enumKey: 'BudgetRangeEnum' },
  ],
};

// フィールド名の日本語表示
const fieldDisplayNames: Record<string, string> = {
  areaName: 'エリア名',
  district: '地区',
  name: '名前',
  districtName: '地区名',
  hashtagName: 'ハッシュタグ名',
  menuName: 'メニュー名',
  purposeName: '目的名',
  ambianceName: '雰囲気名',
  spotName: 'スポット名',
  address: '住所',
  phoneNumber: '電話番号',
  instagramUrl: 'Instagram URL',
  website: 'ウェブサイト',
  catchphrase: 'キャッチフレーズ',
  isRainyOk: '雨天可否',
  budgetRange: '予算感',
  isClosed: '営業中',
  nearestStation: '最寄り駅',
  imageUrl: '画像URL',
  minPeople: '最小人数',
  maxPeople: '最大人数',
  recommendedFor1: 'おすすめ対象1',
  recommendedFor2: 'おすすめ対象2',
  reviewCount: 'レビュー数',
  reviewRating: 'レビュー評価',
  spotType: 'スポットタイプ',
};


interface ModelDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  modelRoute: string;
  modelId?: string; // 新規作成の場合はundefined
  onSaved: () => void; // 保存成功時のコールバック
  initialData?: ModelData | null; // 編集時の初期データ
}

export function ModelDetailModal({
  isOpen,
  onClose,
  modelRoute,
  modelId,
  onSaved,
  initialData
}: ModelDetailModalProps) {
  const isNew = !modelId || modelId === 'new';
  const [formData, setFormData] = useState<ModelData | null>(initialData || { id: '' });
  // isLoadingは現在使用していないため削除
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fieldLabel = modelDisplayNames[modelRoute] || modelRoute;
  const fields = modelFields[modelRoute] || [];

  const { data: spotTypeData } = useQuery(GET_SPOT_TYPE_ENUM, {
    variables: { enumName: "SpotTypeEnum" },
  });
  const { data: budgetData } = useQuery(GET_BUDGET_RANGE_ENUM, {
    variables: { enumName: "BudgetRangeEnum" },
  });

  // useMemo でマッピングをキャッシュ
  const enumOptions = useMemo(() => ({
    SpotTypeEnum: spotTypeData?.__type?.enumValues.map((ev: { name: string, description: string }) => ({
      value: ev.name,
      label: ev.description ?? ev.name,
    })) ?? [],
    BudgetRangeEnum: budgetData?.__type?.enumValues.map((ev: { name: string, description: string }) => ({
      value: ev.name,
      label: ev.description ?? ev.name,
    })) ?? [],
  }), [spotTypeData, budgetData]);

  // モーダルが開かれたときに初期データをセット
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
    }
  }, [isOpen, initialData]);

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

  const prepareFormData = (): ModelInput => {
    const input: ModelInput = {};

    // フォームデータからGraphQLミューテーション用のデータを作成
    fields.forEach((field) => {
      const fieldName = field.name;
      const value = formData?.[fieldName];

      if (field.type === 'relation' && typeof value === 'object' && value !== null) {
        // リレーションフィールドの場合はIDを取得
        const relationData = value as RelationData;
        input[`${fieldName}Id`] = relationData.id;
      } else {
        // 通常のフィールドの場合はそのまま設定
        if (value !== undefined && value !== null) {
          input[fieldName] = value as string | number | boolean;
        }
      }
    });

    return input;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !formData) {
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const input = prepareFormData();

      if (isNew) {
        // 新規作成
        await createModel(modelRoute, input);
      } else {
        // 更新
        await updateModel(modelRoute, modelId!, input);
      }

      // 成功したらモーダルを閉じて一覧を更新
      onSaved();
      onClose();
    } catch (err) {
      console.error('保存に失敗しました:', err);
      setError('保存に失敗しました');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('本当に削除しますか？')) {
      return;
    }

    setError(null);

    try {
      await deleteModel(modelRoute, modelId!);

      // 成功したらモーダルを閉じて一覧を更新
      onSaved();
      onClose();
    } catch (err) {
      console.error('削除に失敗しました:', err);
      setError('削除に失敗しました');
    }
  };

  const modalTitle = isNew ? `${fieldLabel}新規作成` : `${fieldLabel}編集`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={modalTitle} size="lg">
      {error && (
        <div className="admin-alert admin-alert-danger admin-mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-form">
        <div className="admin-form-grid">
          {fields.map((field) => {
            const fieldName = field.name;
            const fieldLabel = fieldDisplayNames[fieldName] || fieldName;
            const value = formData?.[fieldName];
            const error = errors[fieldName];

            console.log(spotTypeData)

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
              case 'url':
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
                    type="url"
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
                const options = enumOptions[field.enumKey!] || [];

                console.log('Enum Options:', options);
                console.log('Selected Value:', value);

                return (
                  <Select
                    key={field.name}
                    id={field.name}
                    name={field.name}
                    label={fieldDisplayNames[field.name]}
                    value={value as string}
                    onChange={(val) => handleChange(field.name, val)}
                    options={options}
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

        <div className="admin-mt-4 admin-flex admin-justify-between">
          {!isNew && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSaving}
            >
              <Trash2 className="h-4 w-4 admin-mr-1" />
              削除
            </Button>
          )}
          <div className="admin-flex admin-justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="admin-mr-2"
              disabled={isSaving}
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              disabled={isSaving}
            >
              <Save className="h-4 w-4 admin-mr-1" />
              {isSaving ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
