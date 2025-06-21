'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/TextField';
import { TextArea } from '@/components/forms/TextArea';
import { Select } from '@/components/forms/Select';
import { ToggleSwitch } from '@/components/forms/ToggleSwitch';
import { MultiSelect } from '@/components/forms/MultiSelect';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { createModel, updateModel, deleteModel } from '@/lib/modelGraphQL';
import { ModelInput } from '@/lib/modelGraphQL';

// モデルデータの型定義
interface ModelData {
  id: string;
  [key: string]: string | number | boolean | object | null | string[] | number[];
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
  station: '駅マスタ',
};

// 各モデルのフィールド定義
const modelFields: Record<string, { name: string; type: string; required?: boolean; modelName?: string; labelField?: string }[]> = {
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
    { name: 'budgetRange', type: 'select', required: true },
    { name: 'hashtag', type: 'relation', modelName: 'Hashtag', labelField: 'hashtagName' },
    { name: 'purpose', type: '', modelName: 'Purpose', labelField: 'purposeName' },
    { name: 'spotAmbiance', type: 'multirelation', modelName: 'spotAmbiances', labelField: 'ambianceName' },
    { name: 'categories', type: 'multirelation', modelName: 'Category', labelField: 'name' },
    { name: 'menu', type: 'multirelation', modelName: 'Menu', labelField: 'menuName' },
    { name: 'area', type: 'multirelation', modelName: 'Area', labelField: 'areaName' },
  ],
  stations: [
    { name: 'name', type: 'text', required: true },
    { name: 'trainLine', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'active', type: 'boolean' },
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
  website: 'ウェブサイト',
  catchphrase: 'キャッチフレーズ',
  isRainyOk: '雨天可否',
  budgetRange: '予算感',
  active: 'アクティブフラグ',
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
  const [isLoading,] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fieldLabel = modelDisplayNames[modelRoute] || modelRoute;
  const fields = modelFields[modelRoute] || [];

  const handleChange = (name: string, value: string | boolean | RelationData | string[] | number[]) => {
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

      if (field.type === 'relation' && typeof value === 'object' && value !== null && !Array.isArray(value)) {
        // リレーションフィールドの場合はIDを取得
        const relationData = value as RelationData;
        input[`${fieldName}Id`] = relationData.id;
      } else if (field.type === 'multirelation' && Array.isArray(value)) {
        // 複数関連フィールドの場合はIDの配列を設定
        const idFieldName = `${fieldName.replace(/s$/, '')}Ids`;
        // 数値配列に変換
        input[idFieldName] = (value as (string | number)[]).map(item =>
          typeof item === 'string' ? Number(item) : item
        ) as number[];
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
        await updateModel(modelRoute, id, input);
      }

      // 成功したら一覧ページに戻る
      router.push(`/${modelRoute}`);
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
      await deleteModel(modelRoute, id);

      // 成功したら一覧ページに戻る
      router.push(`/${modelRoute}`);
    } catch (err) {
      console.error('削除に失敗しました:', err);
      setError('削除に失敗しました');
    }
  };

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="admin-spinner"></div>
      </div>
    );
  }

  if (!formData) {
    return <div className="admin-card">データが見つかりません</div>;
  }

  return (
    <div>
      <div className="admin-header">
        <div className="admin-flex admin-items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/${modelRoute}`)}
            className="admin-mr-2"
          >
            <ArrowLeft className="h-4 w-4 admin-mr-1" />
            戻る
          </Button>
          <h1 className="admin-page-title">
            {isNew ? `${fieldLabel}新規作成` : `${fieldLabel}編集`}
          </h1>
        </div>
        {!isNew && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isSaving}
          >
            <Trash2 className="h-4 w-4 admin-mr-1" />
            削除
          </Button>
        )}
      </div>

      {error && (
        <div className="admin-alert admin-alert-danger admin-mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card">
        <div className="admin-form-grid">
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
                  <MultiSelect
                    key={fieldName}
                    id={fieldName}
                    label={fieldLabel}
                    modelName={field.modelName || ''}
                    labelField={field.labelField || ''}
                    selectedValues={(value as number[]) || []}
                    onChange={(values) => {
                      // 選択されたIDの配列を更新
                      handleChange(fieldName, values);

                      // 関連するIDフィールドも更新
                      const idFieldName = `${fieldName.replace(/s$/, '')}Ids`;
                      handleChange(idFieldName, values);
                    }}
                    required={field.required}
                    error={error}
                    fullWidth
                  />
                );
              case 'multirelation':
                // 複数関連データの選択
                return (
                  <MultiSelect
                    key={fieldName}
                    id={fieldName}
                    label={fieldLabel}
                    modelName={field.modelName || ''}
                    labelField={field.labelField || ''}
                    selectedValues={(value as number[]) || []}
                    onChange={(values) => {
                      // 選択されたIDの配列を更新
                      handleChange(fieldName, values);

                      // 関連するIDフィールドも更新
                      const idFieldName = `${fieldName.replace(/s$/, '')}Ids`;
                      handleChange(idFieldName, values);
                    }}
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

        <div className="admin-mt-4 admin-flex admin-justify-end">
          <Button
            type="submit"
            disabled={isSaving}
          >
            <Save className="h-4 w-4 admin-mr-1" />
            {isSaving ? '保存中...' : '保存'}
          </Button>
        </div>
      </form>
    </div>
  );
}
