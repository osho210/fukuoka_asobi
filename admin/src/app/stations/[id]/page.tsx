'use client';

export const runtime = 'edge';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ApolloError } from '@apollo/client';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/TextField';
import { TextArea } from '@/components/forms/TextArea';
import { ToggleSwitch } from '@/components/forms/ToggleSwitch';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { ModelInput, createModel, updateModel, deleteModel, fetchModelList } from '@/lib/modelGraphQL';
import { getModelDisplayName } from '@/lib/modelConfig';

// モデルデータの型定義
interface ModelData {
  id: string;
  name?: string;
  trainLine?: string;
  description?: string;
  active?: boolean;
  [key: string]: string | number | boolean | object | null | undefined;
}

/**
 * 駅詳細・編集ページ
 */
export default function StationsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const modelRoute = 'stations';
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
        name: '',
        trainLine: '',
        description: '',
        active: false,
      });
      setIsLoading(false);
    } else {
      const fetchData = async () => {
        try {
          const items = await fetchModelList(modelRoute);
          const item = items.find((i: { id: string }) => i.id === id);

          if (item) {
            setFormData({
              id: item.id,
              name: item.name || '',
              trainLine: item.trainLine || '',
              description: item.description || '',
              active: Boolean(item.active),
            });
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

  const handleChange = (name: string, value: string | boolean) => {
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

    if (!formData?.name) {
      newErrors.name = '必須項目です';
    }
    if (!formData?.trainLine) {
      newErrors.trainLine = '必須項目です';
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
        name: formData.name,
        trainLine: formData.trainLine,
        description: formData.description || null,
        active: formData.active,
      };

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
            id="name"
            name="name"
            label="駅名"
            value={(formData.name as string) || ''}
            onChange={(e) => handleChange('name', e.target.value)}
            required={true}
            error={errors.name}
            fullWidth
          />

          <TextField
            id="trainLine"
            name="trainLine"
            label="路線名"
            value={(formData.trainLine as string) || ''}
            onChange={(e) => handleChange('trainLine', e.target.value)}
            required={true}
            error={errors.trainLine}
            fullWidth
          />

          <TextArea
            id="description"
            name="description"
            label="説明"
            value={(formData.description as string) || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            required={false}
            error={errors.description}
            fullWidth
          />

          <ToggleSwitch
            id="active"
            name="active"
            label="アクティブ"
            checked={Boolean(formData.active)}
            onChange={(checked) => handleChange('active', checked)}
            required={false}
            error={errors.active}
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
