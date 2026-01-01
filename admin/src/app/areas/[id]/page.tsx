'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ApolloError } from '@apollo/client';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/TextField';
import { MultiSelect } from '@/components/forms/MultiSelect';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { ModelInput, createModel, updateModel, deleteModel, fetchModelList } from '@/lib/modelGraphQL';
import { getModelDisplayName } from '@/lib/modelConfig';

// 選択項目の型定義
interface RelationItem {
  __typename?: string;
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

// モデルデータの型定義
interface ModelData {
  id: string;
  areaName?: string;
  district?: RelationItem[];
  [key: string]: string | number | boolean | object | null | undefined | RelationItem[];
}

/**
 * エリア詳細・編集ページ
 */
export default function AreasDetailPage() {
  const params = useParams();
  const router = useRouter();
  const modelRoute = 'areas';
  const id = params?.id as string;
  const isNew = id === 'new';

  const [formData, setFormData] = useState<ModelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const displayName = getModelDisplayName(modelRoute);

  // データ取得（編集時）または初期化（新規作成時）
  useEffect(() => {
    if (isNew) {
      setFormData({
        id: 'new',
        areaName: '',
        district: [],
      });
      setIsLoading(false);
    } else {
      const fetchData = async () => {
        try {
          const items = await fetchModelList(modelRoute);
          const item = items.find((i: { id: string }) => i.id === id);

          if (item) {
            const districtValue = item.district;
            const initialData: ModelData = {
              id: item.id,
              areaName: item.areaName || '',
              district: districtValue && typeof districtValue === 'object'
                ? [{ id: String((districtValue as Record<string, unknown>).id), ...(districtValue as Record<string, unknown>) }]
                : [],
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

  const handleChange = (name: string, value: string | RelationItem[]) => {
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

    if (!formData?.areaName) {
      newErrors.areaName = '必須項目です';
    }
    if (!formData?.district || (formData.district as RelationItem[]).length === 0) {
      newErrors.district = '必須項目です';
    }

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
      const input: ModelInput = {
        areaName: formData.areaName,
      };
      
      // district relation
      if (formData.district && Array.isArray(formData.district) && formData.district.length > 0) {
        const relationItem = formData.district[0];
        if (relationItem && relationItem.id) {
          input.districtId = Number(relationItem.id);
        }
      }

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
            id="areaName"
            name="areaName"
            label="エリア名"
            value={(formData.areaName as string) || ''}
            onChange={(e) => handleChange('areaName', e.target.value)}
            required={true}
            error={errors.areaName}
            fullWidth
          />

          <MultiSelect
            id="district"
            label="地区"
            modelName="districts"
            labelField="districtName"
            selectedValues={(formData.district as RelationItem[]) || []}
            onChange={(values) => handleChange('district', values)}
            required={true}
            error={errors.district}
            fullWidth
            maxSelection={1}
          />
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
