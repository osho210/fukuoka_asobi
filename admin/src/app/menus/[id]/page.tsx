'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ApolloError } from '@apollo/client';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/TextField';
import { TextArea } from '@/components/forms/TextArea';
import { MultiSelect } from '@/components/forms/MultiSelect';
import ImageUpload from '@/components/forms/ImageUpload';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { ModelInput, createModel, updateModel, deleteModel, fetchModelList } from '@/lib/modelGraphQL';
import { menusConfig } from '@/lib/models/menus';
import { getModelDisplayName, getFieldDisplayName } from '@/lib/modelConfig';

// 選択項目の型定義
interface RelationItem {
  __typename?: string;
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

// モデルデータの型定義
interface ModelData {
  id: string;
  [key: string]: string | number | boolean | object | null | undefined | RelationItem[];
}

/**
 * メニュー詳細・編集ページ
 */
export default function MenuDetailPage() {
  const params = useParams();
  const router = useRouter();
  const modelRoute = 'menus';
  const id = params?.id as string;
  const isNew = id === 'new';

  const [formData, setFormData] = useState<ModelData | null>(null);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const displayName = getModelDisplayName(modelRoute);
  const fields = menusConfig.fields;

  // データ取得（編集時）または初期化（新規作成時）
  useEffect(() => {
    if (isNew) {
      const initialData: ModelData = {
        id: 'new',
        ...fields.reduce((acc, field) => {
          if (field.type === 'relation' || field.type === 'multirelation') {
            acc[field.name] = [];
          } else {
            acc[field.name] = '';
          }
          return acc;
        }, {} as Record<string, string | RelationItem[]>)
      };
      setFormData(initialData);
      setIsLoading(false);
    } else {
      const fetchData = async () => {
        try {
          const items = await fetchModelList(modelRoute);
          const item = items.find((i: { id: string }) => i.id === id);

          if (item) {
            const initialData: ModelData = {
              id: item.id,
              ...fields.reduce((acc, field) => {
                const value = item[field.name];
                if (field.type === 'relation' || field.type === 'multirelation') {
                  if (Array.isArray(value)) {
                    acc[field.name] = value.map((v: Record<string, unknown>) => ({
                      id: String(v.id),
                      ...v,
                    }));
                  } else if (value && typeof value === 'object') {
                    const objValue = value as Record<string, unknown>;
                    acc[field.name] = [{
                      id: String(objValue.id),
                      ...objValue,
                    }];
                  } else {
                    acc[field.name] = [];
                  }
                } else {
                  acc[field.name] = value || '';
                }
                return acc;
              }, {} as Record<string, string | RelationItem[]>)
            };
            setFormData(initialData);
          }
        } catch (err) {
          console.error('データの読み込みに失敗しました:', err);
          setError('データの読み込みに失敗しました');
        } finally {
          setIsLoading(false);
        }
      };

      fetchData();
    }
  }, [isNew, id]);

  const handleChange = (name: string, value: string | number | RelationItem[]) => {
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
      if (field.required) {
        const value = formData?.[field.name];
        if (Array.isArray(value) && value.length === 0) {
          newErrors[field.name] = '必須項目です';
        } else if (!value) {
          newErrors[field.name] = '必須項目です';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !formData) {
      alert('入力内容にエラーがあります。各項目を確認してください。');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const input: ModelInput = {};
      
      if (newImages.length > 0) {
        input.images = newImages;
      }
      
      fields.forEach((field) => {
        const value = formData[field.name];
        
        if (field.type === 'relation' && Array.isArray(value) && value.length > 0) {
          const idFieldName = `${field.name}Id`;
          const relationItem = value[0];
          if (relationItem && relationItem.id) {
            input[idFieldName] = Number(relationItem.id);
          }
        } else if (field.type === 'multirelation' && Array.isArray(value)) {
          const idFieldName = `${field.name.replace(/s$/, '')}s`;
          const ids = value
            .map(item => {
              if (typeof item === 'object' && item !== null && 'id' in item && typeof item.id === 'string') {
                return parseInt(item.id, 10);
              }
              return null;
            })
            .filter((id): id is number => id !== null);
          input[idFieldName] = ids;
        } else if (field.type === 'number') {
          input[field.name] = value === '' ? null : Number(value);
        } else if (field.type !== 'image_upload' && value !== undefined && value !== null) {
          input[field.name] = value;
        }
      });

      if (isNew) {
        await createModel(modelRoute, input);
      } else {
        await updateModel(modelRoute, id, input);
      }

      router.push(`/${modelRoute}`);
    } catch (err) {
      console.error('保存に失敗しました:', err);
      if (err instanceof ApolloError) {
        const messages = err.graphQLErrors.map((e) => e.message).join('\n');
        setError(messages || err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('不明なエラーが発生しました');
      }
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
            {isNew ? `${displayName}新規作成` : `${displayName}編集`}
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
          <TextField
            id="menuName"
            name="menuName"
            label="メニュー名"
            value={(formData?.menuName as string) || ''}
            onChange={(e) => handleChange('menuName', e.target.value)}
            required={true}
            error={errors.menuName}
            fullWidth
          />

          <TextField
            id="price"
            name="price"
            label="価格"
            type="number"
            value={formData?.price !== undefined ? String(formData.price) : ''}
            onChange={(e) => handleChange('price', e.target.value ? Number(e.target.value) : '')}
            required={false}
            error={errors.price}
            fullWidth
          />

          <TextArea
            id="description"
            name="description"
            label="説明"
            value={(formData?.description as string) || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            required={false}
            error={errors.description}
            fullWidth
          />

          <MultiSelect
            id="menuCategory"
            label="メニューカテゴリー"
            modelName="menuCategories"
            labelField="name"
            selectedValues={(formData?.menuCategory as RelationItem[]) || []}
            onChange={(values) => handleChange('menuCategory', values)}
            required={false}
            error={errors.menuCategory}
            fullWidth
            maxSelection={1}
          />

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">画像</label>
            <ImageUpload
              onImagesChange={setNewImages}
              existingImages={(Array.isArray(formData?.imageUrl) 
                ? (formData.imageUrl as string[]).map((url) => ({ id: url, url }))
                : [])}
              onDeleteImage={() => {
                // Handle image deletion if needed
              }}
            />
          </div>
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
