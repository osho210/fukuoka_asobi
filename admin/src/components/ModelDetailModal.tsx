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
import { GET_SPOT_TYPE_ENUM, GET_BUDGET_RANGE_ENUM, GET_TRAIN_LINE_ENUM, GET_STATUS_ENUM } from '@/graphql/queries/getEnumTypes';
import { modelDisplayNames, fieldDisplayNames, modelFields } from '@/lib/modelConstants';

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
  const { data: trainLineData } = useQuery(GET_TRAIN_LINE_ENUM, {
    variables: { enumName: "TrainLineTypeEnum" },
  });
  const { data: statusData } = useQuery(GET_STATUS_ENUM, {
    variables: { enumName: "StatusEnum" },
  });

  // useMemo でマッピングをキャッシュ
  type EnumOption = { value: string; label: string };
  type EnumOptionsMap = { [key: string]: EnumOption[] };

  const enumOptions = useMemo<EnumOptionsMap>(() => ({
    SpotTypeEnum: spotTypeData?.__type?.enumValues.map((ev: { name: string, description: string }) => ({
      value: ev.name,
      label: ev.description ?? ev.name,
    })) ?? [],
    BudgetRangeEnum: budgetData?.__type?.enumValues.map((ev: { name: string, description: string }) => ({
      value: ev.name,
      label: ev.description ?? ev.name,
    })) ?? [],
    TrainLineTypeEnum: trainLineData?.__type?.enumValues.map((ev: { name: string, description: string }) => ({
      value: ev.name,
      label: ev.description ?? ev.name,
    })) ?? [],
    StatusEnum: statusData?.__type?.enumValues.map((ev: { name: string, description: string }) => ({
      value: ev.name,
      label: ev.description ?? ev.name,
    })) ?? [],
  }), [spotTypeData, budgetData, trainLineData, statusData]);

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
                // enumKeyが指定されている場合はenumOptionsから取得
                const options = enumOptions[field.enumKey!] || [];
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
