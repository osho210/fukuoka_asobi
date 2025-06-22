'use client';

import { useState, useEffect, useMemo } from 'react';
import { MultiSelect } from '@/components/forms/MultiSelect';
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
import { GET_DISTRICTS } from '@/graphql/queries/getDistricts';
import { GET_CATEGORIES } from '@/graphql/queries/getCategories';
import { GET_AREAS } from '@/graphql/queries/getAreas';
import { GET_HASHTAGS } from '@/graphql/queries/getHashtags';
import { GET_PURPOSES } from '@/graphql/queries/getPurposes';
import { GET_SPOT_AMBIANCES } from '@/graphql/queries/getSpotAmbiances';
import { GET_MENUS } from '@/graphql/queries/getMenus';
import { GET_EVENT_CATEGORIES } from '@/graphql/queries/getEventCategories';
import { modelDisplayNames, fieldDisplayNames, modelFields } from '@/lib/modelConstants';

// 選択項目の型定義（MultiSelectコンポーネントと同じ定義）
interface RelationItem {
  __typename?: string;
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

// モデルデータの型定義
interface ModelData {
  id: string;
  [key: string]: string | number | boolean | object | null | number[] | RelationItem[];
}

// 関連データの型定義（RelationItemと互換性を持たせる）
interface RelationData {
  id: string;
  [key: string]: string | number | boolean | object | null | undefined;
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

  // Enumデータの取得
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

  // マスタデータの取得
  const { data: districtsData } = useQuery(GET_DISTRICTS);
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const { data: areasData } = useQuery(GET_AREAS);
  const { data: hashtagsData } = useQuery(GET_HASHTAGS);
  const { data: purposesData } = useQuery(GET_PURPOSES);
  const { data: spotAmbiancesData } = useQuery(GET_SPOT_AMBIANCES);
  const { data: menusData } = useQuery(GET_MENUS);
  const { data: eventCategoriesData } = useQuery(GET_EVENT_CATEGORIES);

  // useMemo でマッピングをキャッシュ
  type EnumOption = { value: string; label: string };
  type OptionsMap = { [key: string]: EnumOption[] };

  // Enumオプションのマッピング
  const enumOptions = useMemo<OptionsMap>(() => ({
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

  // マスタとformフィールドの紐付けを行う
  // フィールド名をキーにして、マスタデータの選択肢を生成
  const relationOptions = useMemo<OptionsMap>(() => ({
    district: districtsData?.districts.map((district: { id: string, districtName: string }) => ({
      value: district.id,
      label: district.districtName,
    })) ?? [],
    category: categoriesData?.categories.map((category: { id: string, name: string }) => ({
      value: category.id,
      label: category.name,
    })) ?? [],
    area: areasData?.areas.map((area: { id: string, areaName: string }) => ({
      value: area.id,
      label: area.areaName,
    })) ?? [],
    hashtags: hashtagsData?.hashtags.map((hashtag: { id: string, hashtagName: string }) => ({
      value: hashtag.id,
      label: hashtag.hashtagName,
    })) ?? [],
    purpose: purposesData?.purposes.map((purpose: { id: string, purposeName: string }) => ({
      value: purpose.id,
      label: purpose.purposeName,
    })) ?? [],
    spotAmbiances: spotAmbiancesData?.spotAmbiances.map((ambiance: { id: string, ambianceName: string }) => ({
      value: ambiance.id,
      label: ambiance.ambianceName,
    })) ?? [],
    menus: menusData?.menus.map((menu: { id: string, menuName: string }) => ({
      value: menu.id,
      label: menu.menuName,
    })) ?? [],
    eventCategory: eventCategoriesData?.eventCategories.map((eventCategory: { id: string, name: string }) => ({
      value: eventCategory.id,
      label: eventCategory.name,
    })) ?? [],
    // eventCategoryIdフィールド用のオプション（eventCategoryと同じ内容）
    eventCategoryId: eventCategoriesData?.eventCategories.map((eventCategory: { id: string, name: string }) => ({
      value: eventCategory.id,
      label: eventCategory.name,
    })) ?? [],
  }), [districtsData, categoriesData, areasData, hashtagsData, purposesData, spotAmbiancesData, menusData, eventCategoriesData]);

  console.log(eventCategoriesData);
  // モーダルが開かれたときに初期データをセット
  useEffect(() => {
    if (isOpen && initialData) {
      // relationフィールドの処理
      const processedData = { ...initialData };

      // eventsモデルの場合の特別処理
      if (modelRoute === 'events') {
          // eventCategoryIdをオブジェクト形式に変換
          if (processedData.eventCategoryId) {
            const categoryId = processedData.eventCategoryId;
            processedData.eventCategoryId = { id: categoryId };

            // eventCategoryフィールドも同様に設定（districtのように表示するため）
            processedData.eventCategory = { id: categoryId };
          }
      }

      setFormData(processedData);
    }
  }, [isOpen, initialData, modelRoute]);

  const handleChange = (name: string, value: string | boolean | RelationData | string[] | number[] | RelationItem[]) => {
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
      } else if (field.type === 'multiSelect' && Array.isArray(value)) {
        // 配列の場合は、各要素を適切に処理して数値の配列に変換
        const ids = value.map(item => {
          if (typeof item === 'object' && item !== null && 'id' in item) {
            // RelationItemの場合はidプロパティを数値に変換
            return Number((item as RelationItem).id);
          } else if (typeof item === 'string') {
            // 文字列の場合は数値に変換
            return Number(item);
          } else if (typeof item === 'number') {
            // 数値の場合はそのまま
            return item;
          }
          // その他の場合は0（エラー防止）
          return 0;
        });

        input[fieldName] = ids;
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
                const enumOpts = enumOptions[field.enumKey!] || [];
                return (
                  <Select
                    key={field.name}
                    id={field.name}
                    name={field.name}
                    label={fieldDisplayNames[field.name]}
                    value={value as string}
                    onChange={(val) => handleChange(field.name, val)}
                    options={enumOpts}
                    required={field.required}
                    error={error}
                    fullWidth
                  />
                );
              case 'relation':
                // マスタデータの選択肢を取得
                const relationName = fieldName.endsWith('s') ? fieldName.slice(0, -1) : fieldName;
                const relationOpts = relationOptions[relationName] || [];

                return (
                  <Select
                    key={fieldName}
                    id={fieldName}
                    name={fieldName}
                    label={fieldLabel}
                    value={(value as RelationData)?.id || ''}
                    onChange={(val) => handleChange(fieldName, { id: val } as RelationData)}
                    options={relationOpts}
                    required={field.required}
                    error={error}
                    fullWidth
                  />
                );
              case 'multiSelect':
                const multiRelationName = fieldName.endsWith('s') ? fieldName.slice(0, -1) : fieldName;

                return (
                  <MultiSelect
                    key={fieldName}
                    id={fieldName}
                    label={fieldLabel}
                    // ここではデータ一覧を取得するためにマスタ取得用のモデル名を渡す必要がある
                    // 例えばspotAmbianceのような
                    modelName={multiRelationName.charAt(0).toUpperCase() + multiRelationName.slice(1)}
                    labelField={multiRelationName === 'hashtag' ? 'hashtagName' :
                      multiRelationName === 'area' ? 'areaName' :
                        multiRelationName === 'spotAmbiance' ? 'ambianceName' :
                          multiRelationName === 'purpose' ? 'purposeName' :
                            multiRelationName === 'menu' ? 'menuName' : 'name'}
                    selectedValues={(value as RelationItem[]) || []}
                    onChange={(values: RelationItem[]) => {
                      // graphqlで更新する再はfield名で更新する必要がある
                      handleChange(fieldName, values);
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
