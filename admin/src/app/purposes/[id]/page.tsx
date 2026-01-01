'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ApolloError } from '@apollo/client';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/TextField';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { ModelInput, createModel, updateModel, deleteModel, fetchModelList } from '@/lib/modelGraphQL';
import { purposesConfig } from '@/lib/models/purposes';
import { getModelDisplayName, getFieldDisplayName } from '@/lib/modelConfig';

// モデルデータの型定義
interface ModelData {
  id: string;
  [key: string]: string | number | boolean | object | null | undefined;
}

/**
 * 目的詳細・編集ページ
 */
export default function PurposesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const modelRoute = 'purposes';
  const id = params?.id as string;
  const isNew = id === 'new';

  const [formData, setFormData] = useState<ModelData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const displayName = getModelDisplayName(modelRoute);
  const fields = purposesConfig.fields;

  // データ取得（編集時）または初期化（新規作成時）
  useEffect(() => {
    if (isNew) {
      const initialData: ModelData = {
        id: 'new',
        ...fields.reduce((acc, field) => {
          acc[field.name] = '';
          return acc;
        }, {} as Record<string, string>)
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
                acc[field.name] = item[field.name] || '';
                return acc;
              }, {} as Record<string, string>)
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

  const handleChange = (name: string, value: string) => {
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
        if (!value) {
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
      
      fields.forEach((field) => {
        const value = formData[field.name];
        if (value !== undefined && value !== null) {
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
          {fields.map((field) => {
            const value = formData[field.name];
            const fieldError = errors[field.name];
            const label = getFieldDisplayName(field.name);

            return (
              <TextField
                key={field.name}
                id={field.name}
                name={field.name}
                label={label}
                value={value as string || ''}
                onChange={(e) => handleChange(field.name, e.target.value)}
                required={field.required}
                error={fieldError}
                fullWidth
              />
            );
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
