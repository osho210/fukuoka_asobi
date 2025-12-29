'use client';

import { useState, useEffect, useMemo } from 'react';
import { MultiSelect, RelationItem } from '@/components/forms/MultiSelect';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/TextField';
import { TextArea } from '@/components/forms/TextArea';
import { Select } from '@/components/forms/Select';
import { ToggleSwitch } from '@/components/forms/ToggleSwitch';
import { DateTimePicker } from '@/components/forms/DateTimePicker';
import { FileUpload } from '@/components/forms/FileUpload';
import ImageUpload from '@/components/forms/ImageUpload';
import SingleImageUpload from '@/components/forms/SingleImageUpload';
import { Save, Trash2, Search } from 'lucide-react';
import { ModelInput, PlanDetailInput, createModel, updateModel, deleteModel, updatePlanDetails } from '@/lib/modelGraphQL';
import { useQuery } from '@apollo/client';
import { useEnumOptions } from '@/hooks/useEnumOptions';
import { GET_DISTRICTS } from '@/graphql/queries/getDistricts';
import { GET_CATEGORIES } from '@/graphql/queries/getCategories';
import { GET_AREAS } from '@/graphql/queries/getAreas';
import { GET_HASHTAGS } from '@/graphql/queries/getHashtags';
import { GET_PURPOSES } from '@/graphql/queries/getPurposes';
import { GET_SPOT_AMBIANCES } from '@/graphql/queries/getSpotAmbiances';
import { GET_MENUS } from '@/graphql/queries/getMenus';
import { GET_MENU_CATEGORIES } from '@/graphql/queries/getMenuCategories';
import { GET_EVENT_CATEGORIES } from '@/graphql/queries/getEventCategories';
import { GET_MAGAZINES } from '@/graphql/queries/getMagazines';
import { modelDisplayNames, fieldDisplayNames, modelConfigs, ModelData } from '@/lib/modelConstants';
import { OpeningHour } from '@/__generated__/graphql';

// 関連データの型定義（RelationItemと互換性を持たせる）
interface RelationData {
  id: string;
  [key: string]: string | number | boolean | object | null | undefined;
}

interface SpotMagazine {
  id?: string;
  magazine: {
    id: string;
    name?: string;
  };
  publicationFeature?: string;
  pageNumber?: number | null;
  notes?: string;
  _destroy?: boolean;
}

// OpeningHourを拡張した型（削除フラグを追加）
interface OpeningHourWithDestroy extends Partial<OpeningHour> {
  dayOfWeek: string;
  isClosedDay: boolean;
  openTime?: string | null;
  closeTime?: string | null;
  id?: string;
  _destroy?: boolean;
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
  // 子モデルの状態管理を追加
  const [childModels, setChildModels] = useState<Record<string, ModelData[]>>({});
  const [spotMagazines, setSpotMagazines] = useState<SpotMagazine[]>([]);
  const [openingHours, setOpeningHours] = useState<OpeningHourWithDestroy[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  // isLoadingは現在使用していないため削除
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [nearestStationLoading, setNearestStationLoading] = useState(false);
  const [selectedMenuCategories, setSelectedMenuCategories] = useState<RelationItem[]>([]);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('ファイルのアップロードに失敗しました');
      }

      const { fileName } = await response.json();
      handleChange('imageFilename', fileName);
    } catch (error) {
      console.error(error);
      setError('ファイルのアップロードに失敗しました');
    }
  };

  const handleImageRemove = () => {
    handleChange('imageFilename', null);
  };

  const handleDeleteImage = (id: string) => {
    setDeletedImageIds(prev => [...prev, id]);
  };

  const handleFetchNearestStation = async () => {
    setNearestStationLoading(true);
    // TODO: Implement station search logic
    console.log("Fetching nearest station...");
    // Simulating an API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setNearestStationLoading(false);
  };

  const fieldLabel = modelDisplayNames[modelRoute] || modelRoute;
  const fields = useMemo(() => modelConfigs[modelRoute]?.fields || [], [modelRoute]);

  // Enumデータの取得
  const { options: spotTypeOptions } = useEnumOptions("SpotTypeEnum");
  const { options: budgetOptions } = useEnumOptions("BudgetTypeRangeEnum");
  const { options: trainLineOptions } = useEnumOptions("TrainLineEnum");
  const { options: statusOptions } = useEnumOptions("StatusEnum");
  const { options: tripTypeOptions } = useEnumOptions("TripTypeEnum");
  const { options: priceLevelOptions } = useEnumOptions("PriceLevelEnum");
  const { options: businessStatusOptions } = useEnumOptions("BusinessStatusEnum");
  const { options: magazineStatusOptions } = useEnumOptions("MagazineStatusEnum");
  const { options: layoutBucketShiftOptions } = useEnumOptions("LayoutBucketShiftEnum");
  const { options: LayoutBucketTiltEnumOptions } = useEnumOptions("LayoutBucketTiltEnum");
  const { options: LayoutBucketDepthEnumOptions } = useEnumOptions("LayoutBucketDepthEnum");
  const { options: WeatherEnumOptions } = useEnumOptions("WeatherEnum");
  const { options: LayoutBucketStatusOptions } = useEnumOptions("LayoutBucketStatusEnum");
  const { options: BucketListItemStatusEnum } = useEnumOptions("BucketListItemStatusEnum");


  // マスタデータの取得
  const { data: districtsData } = useQuery(GET_DISTRICTS);
  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const { data: areasData } = useQuery(GET_AREAS);
  const { data: hashtagsData } = useQuery(GET_HASHTAGS);
  const { data: purposesData } = useQuery(GET_PURPOSES);
  const { data: spotAmbiancesData } = useQuery(GET_SPOT_AMBIANCES);
  const { data: menusData } = useQuery(GET_MENUS);
  const { data: menuCategoriesData } = useQuery(GET_MENU_CATEGORIES);
  const { data: eventCategoriesData } = useQuery(GET_EVENT_CATEGORIES);
  const { data: magazinesData } = useQuery(GET_MAGAZINES);

  // useMemo でマッピングをキャッシュ
  type EnumOption = { value: string; label: string };
  type OptionsMap = { [key: string]: EnumOption[] };

  // Enumオプションのマッピング
  const enumOptions = useMemo<OptionsMap>(() => ({
    SpotTypeEnum: spotTypeOptions,
    BudgetRangeEnum: budgetOptions,
    TrainLineTypeEnum: trainLineOptions,
    StatusEnum: statusOptions,
    TripTypeEnum: tripTypeOptions,
    PriceLevelEnum: priceLevelOptions,
    BusinessStatusTypeEnum: businessStatusOptions,
    MagazineStatusEnum: magazineStatusOptions,
    LayoutBucketShiftEnum: layoutBucketShiftOptions,
    LayoutBucketTiltEnum: LayoutBucketTiltEnumOptions,
    LayoutBucketDepthEnum: LayoutBucketDepthEnumOptions,
    LayoutBucketStatusEnum: LayoutBucketStatusOptions,
    WeatherEnum: WeatherEnumOptions,
    BucketListItemStatusEnum: BucketListItemStatusEnum,
  }), [spotTypeOptions, budgetOptions, trainLineOptions, statusOptions, tripTypeOptions, priceLevelOptions, businessStatusOptions, magazineStatusOptions, layoutBucketShiftOptions, LayoutBucketTiltEnumOptions, LayoutBucketDepthEnumOptions, WeatherEnumOptions, LayoutBucketStatusOptions, BucketListItemStatusEnum]);

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
    menuCategory: menuCategoriesData?.menuCategories.map((category: { id: string, name: string }) => ({
      value: category.id,
      label: category.name,
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
    magazines: magazinesData?.magazines.map((magazine: { id: string, name: string }) => ({
      value: magazine.id,
      label: magazine.name,
    })) ?? [],
  }), [districtsData, categoriesData, areasData, hashtagsData, purposesData, spotAmbiancesData, menusData, menuCategoriesData, eventCategoriesData, magazinesData]);

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

      // 子モデルのデータを設定
      const newChildModels: Record<string, ModelData[]> = {};

      // モデルフィールドから子モデルを探す
      fields.forEach(field => {
        if (field.type === 'childModel' && field.name && initialData[field.name]) {
          // 子モデルのデータを取得
          const childModelData = initialData[field.name] as ModelData[];
          if (Array.isArray(childModelData)) {
            newChildModels[field.name] = childModelData;
          }
        }
      });

      // 子モデルのデータがあれば状態を更新
      if (Object.keys(newChildModels).length > 0) {
        setChildModels(newChildModels);
      }

      // 雑誌掲載情報のデータを設定
      if (modelRoute === 'spots' && initialData?.spotMagazines) {
        setSpotMagazines(initialData.spotMagazines as SpotMagazine[]);
      }
      // 営業時間のデータを設定
      if (modelRoute === 'spots' && initialData?.openingHours) {
        const dayOfWeekMap: { [key: string]: string } = {
          '日': 'Sunday',
          '月': 'Monday',
          '火': 'Tuesday',
          '水': 'Wednesday',
          '木': 'Thursday',
          '金': 'Friday',
          '土': 'Saturday',
        };

        const formattedOpeningHours = (initialData.openingHours as OpeningHour[]).map(oh => ({
          ...oh,
          dayOfWeek: dayOfWeekMap[oh.dayOfWeek] || oh.dayOfWeek,
          openTime: oh.openTime ? new Date(oh.openTime).toTimeString().slice(0, 5) : null,
          closeTime: oh.closeTime ? new Date(oh.closeTime).toTimeString().slice(0, 5) : null,
        }));
        setOpeningHours(formattedOpeningHours);
      }
    }
  }, [isOpen, initialData, modelRoute, fields]);

  const handleChange = (name: string, value: string | boolean | number | null | RelationData | string[] | number[] | RelationItem[]) => {
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
    // その他のモデルの場合の通常処理
    const input: ModelInput = {};

    if (newImages.length > 0) {
      input.images = newImages;
    }
    if (deletedImageIds.length > 0) {
      input.deleteImageIds = deletedImageIds;
    }

    // フォームデータからGraphQLミューテーション用のデータを作成
    fields
      .filter(field => field.type !== 'opening_hours_editor' && field.type !== 'spot_magazines_editor')
      .forEach((field) => {
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
        } else if (field.type === 'datetime') {
          // datetime型のフィールドの場合、ISO8601形式の文字列として設定
          if (value !== undefined && value !== null && value !== '') {
            // 既にISO8601形式の文字列であることを確認
            try {
              // 日付として解析できるか確認
              const date = new Date(value as string);
              if (!isNaN(date.getTime())) {
                // 有効な日付の場合はそのまま設定
                input[fieldName] = value as string;
              }
            } catch (e) {
              console.error(`日付変換エラー (${fieldName}):`, e);
            }
          }
        } else if (field.type === 'number') {
          if (value !== undefined && value !== null && value !== '') {
            const num = parseFloat(value as string);
            if (!isNaN(num)) {
              input[fieldName] = num;
            }
          }
        } else {
          // 通常のフィールドの場合はそのまま設定
          if (value !== undefined && value !== null) {
            input[fieldName] = value as string | number | boolean;
          }
        }
      });

    // 雑誌掲載情報のデータを追加
    if (modelRoute === 'spots') {
      input.spotMagazinesAttributes = spotMagazines.map(sm => ({
        id: sm.id,
        magazineId: sm.magazine.id,
        publicationFeature: sm.publicationFeature,
        pageNumber: sm.pageNumber,
        notes: sm.notes,
        _destroy: sm._destroy
      }));

      input.openingHoursAttributes = openingHours.map(oh => ({
        id: oh.id,
        dayOfWeek: oh.dayOfWeek,
        openTime: oh.openTime,
        closeTime: oh.closeTime,
        isClosedDay: oh.isClosedDay,
      }));
    }

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

        // 子モデルの更新（play_plansの場合のみ）
        if (modelRoute === 'play_plans' && childModels.planDetails && childModels.planDetails.length > 0) {
          // PlanDetailInputの形式に変換
          const planDetailInputs: PlanDetailInput[] = childModels.planDetails.map(detail => {
            // spotフィールドがある場合はspotIdに変換し、spotフィールドを削除
            let spotId = detail.spotId as string;
            if (detail.spot && typeof detail.spot === 'object' && 'id' in detail.spot) {
              spotId = detail.spot.id as string;
            }

            // 新しいオブジェクトを作成（PlanDetailInputの全フィールドを含む）
            return {
              id: detail.id as string,
              stepNumber: detail.stepNumber as number,
              stepName: detail.stepName as string,
              stepDescription: detail.stepDescription as string,
              startTime: detail.startTime as string,
              endTime: detail.endTime as string,
              durationMinutes: detail.durationMinutes as number,
              plannerTitle: detail.plannerTitle as string,
              budget: detail.budget as number,
              spotId: spotId,
              comment: detail.comment as string,
              notes: (detail.notes as string) || ''
            };
          });

          // PlanDetailsの更新
          await updatePlanDetails(modelId!, planDetailInputs);
        }
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
              case 'childModel':
                return (
                  <div key={fieldName} className="admin-child-model admin-col-span-2">
                    <h3 className="admin-text-lg admin-font-semibold admin-mb-4">{fieldLabel}</h3>

                    {childModels[fieldName]?.map((item, index) => (
                      <div key={item.id || index} className="admin-child-model-item admin-mb-6 admin-p-4 admin-bg-gray-50 admin-rounded-md">
                        <h4 className="admin-text-md admin-font-medium admin-mb-3">
                          {fieldName === 'planDetails' ? `ステップ ${item.stepNumber || index + 1}` : `項目 ${index + 1}`}
                        </h4>

                        <div className="admin-grid admin-grid-cols-2 admin-gap-4">
                          {field.fields?.map((childField) => {
                            const childFieldName = childField.name;
                            const childFieldLabel = fieldDisplayNames[childFieldName] || childFieldName;
                            const childValue = item[childFieldName];

                            switch (childField.type) {
                              case 'text':
                                return (
                                  <TextField
                                    key={`${fieldName}-${index}-${childFieldName}`}
                                    id={`${fieldName}-${index}-${childFieldName}`}
                                    name={`${fieldName}-${index}-${childFieldName}`}
                                    label={childFieldLabel}
                                    value={childValue as string || ''}
                                    onChange={(e) => {
                                      const updatedModels = [...childModels[fieldName]];
                                      updatedModels[index] = {
                                        ...updatedModels[index],
                                        [childFieldName]: e.target.value
                                      };
                                      setChildModels({
                                        ...childModels,
                                        [fieldName]: updatedModels
                                      });
                                    }}
                                    required={childField.required}
                                    fullWidth
                                  />
                                );
                              case 'textarea':
                                return (
                                  <TextArea
                                    key={`${fieldName}-${index}-${childFieldName}`}
                                    id={`${fieldName}-${index}-${childFieldName}`}
                                    name={`${fieldName}-${index}-${childFieldName}`}
                                    label={childFieldLabel}
                                    value={childValue as string || ''}
                                    onChange={(e) => {
                                      const updatedModels = [...childModels[fieldName]];
                                      updatedModels[index] = {
                                        ...updatedModels[index],
                                        [childFieldName]: e.target.value
                                      };
                                      setChildModels({
                                        ...childModels,
                                        [fieldName]: updatedModels
                                      });
                                    }}
                                    required={childField.required}
                                    fullWidth
                                  />
                                );
                              case 'number':
                                return (
                                  <TextField
                                    key={`${fieldName}-${index}-${childFieldName}`}
                                    id={`${fieldName}-${index}-${childFieldName}`}
                                    name={`${fieldName}-${index}-${childFieldName}`}
                                    label={childFieldLabel}
                                    value={childValue as string || ''}
                                    onChange={(e) => {
                                      const updatedModels = [...childModels[fieldName]];
                                      updatedModels[index] = {
                                        ...updatedModels[index],
                                        [childFieldName]: e.target.value ? Number(e.target.value) : null
                                      };
                                      setChildModels({
                                        ...childModels,
                                        [fieldName]: updatedModels
                                      });
                                    }}
                                    type="number"
                                    required={childField.required}
                                    fullWidth
                                  />
                                );
                              case 'datetime':
                                return (
                                  <DateTimePicker
                                    key={`${fieldName}-${index}-${childFieldName}`}
                                    id={`${fieldName}-${index}-${childFieldName}`}
                                    name={`${fieldName}-${index}-${childFieldName}`}
                                    label={childFieldLabel}
                                    value={childValue as string || ''}
                                    onChange={(val) => {
                                      const updatedModels = [...childModels[fieldName]];
                                      updatedModels[index] = {
                                        ...updatedModels[index],
                                        [childFieldName]: val
                                      };
                                      setChildModels({
                                        ...childModels,
                                        [fieldName]: updatedModels
                                      });
                                    }}
                                    required={childField.required}
                                    fullWidth
                                  />
                                );
                              case 'relation':
                                // スポット選択などのリレーションフィールド
                                // TODO: 実装が必要
                                return (
                                  <div key={`${fieldName}-${index}-${childFieldName}`} className="admin-col-span-2">
                                    <p className="admin-text-sm admin-text-gray-500">
                                      {childFieldLabel}のリレーション選択は現在実装中です
                                    </p>
                                  </div>
                                );
                              default:
                                return null;
                            }
                          })}
                        </div>

                        <div className="admin-mt-3 admin-flex admin-justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              const updatedModels = [...childModels[fieldName]];
                              updatedModels.splice(index, 1);
                              setChildModels({
                                ...childModels,
                                [fieldName]: updatedModels
                              });
                            }}
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 admin-mr-1" />
                            削除
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        // 新しい子モデル項目を追加
                        const newItem: ModelData = {
                          id: `temp-${Date.now()}`,
                          // PlanDetailの場合は初期値を設定
                          ...(fieldName === 'planDetails' ? {
                            stepNumber: (childModels[fieldName]?.length || 0) + 1,
                            stepName: '',
                            stepDescription: ''
                          } : {})
                        };

                        setChildModels({
                          ...childModels,
                          [fieldName]: [...(childModels[fieldName] || []), newItem]
                        });
                      }}
                      className="admin-mt-2"
                    >
                      {fieldName === 'planDetails' ? 'ステップを追加' : '項目を追加'}
                    </Button>
                  </div>
                );
              case 'image_upload': {
                // Menuモデルの場合は単一画像アップロード
                if (modelRoute === 'menus') {
                  return (
                    <div key={fieldName} className="admin-col-span-2">
                      <SingleImageUpload
                        label={fieldLabel}
                        existingImageUrl={formData?.imageUrl as string || null}
                        onImageChange={(base64Image) => {
                          handleChange('image', base64Image);
                        }}
                        onDeleteImage={() => {
                          handleChange('deleteImage', true);
                        }}
                      />
                    </div>
                  );
                }

                // Spotモデルなどの複数画像アップロード
                const existingImages = (formData?.image_urls as { id: string; url: string }[] | undefined) || [];
                return (
                  <div key={fieldName} className="admin-col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{fieldLabel}</label>
                    <ImageUpload
                      onImagesChange={setNewImages}
                      onDeleteImage={handleDeleteImage}
                      existingImages={existingImages}
                    />
                  </div>
                );
              }
              case 'file':
                return (
                  <FileUpload
                    key={fieldName}
                    label={fieldLabel}
                    fileName={value as string || null}
                    onUpload={handleImageUpload}
                    onRemove={handleImageRemove}
                    required={field.required}
                    error={error}
                  />
                );
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
              case 'multiSelect': {
                const relationModelName = field.relationModel;
                if (!relationModelName) return null;

                const relationConfig = modelConfigs[relationModelName];
                if (!relationConfig) return null;

                const labelField = relationConfig.fields.find(f => f.name === 'name' || f.name.endsWith('Name'))?.name || 'id';
                const isMenuField = modelRoute === 'spots' && fieldName === 'menus';

                return (
                  <div key={fieldName} className="admin-col-span-2">
                    {isMenuField && (
                      <div className="admin-mb-4">
                        <MultiSelect
                          id="menu-category-filter"
                          label="メニューカテゴリーで絞り込む"
                          modelName="menu_categories"
                          labelField="name"
                          selectedValues={selectedMenuCategories}
                          onChange={(values) => setSelectedMenuCategories(values)}
                          fullWidth
                        />
                      </div>
                    )}
                    <MultiSelect
                      id={fieldName}
                      label={fieldLabel}
                      modelName={relationModelName}
                      labelField={labelField}
                      selectedValues={(value as RelationItem[]) || []}
                      onChange={(values: RelationItem[]) => {
                        handleChange(fieldName, values);
                      }}
                      required={field.required}
                      error={error}
                      fullWidth
                      filter={isMenuField && selectedMenuCategories.length > 0 ? { field: 'menuCategory.id', values: selectedMenuCategories.map(c => c.id) } : undefined}
                    />
                  </div>
                );
              }
              case 'datetime':
                return (
                  <DateTimePicker
                    key={fieldName}
                    id={fieldName}
                    name={fieldName}
                    label={fieldLabel}
                    value={value as string || ''}
                    onChange={(val) => handleChange(fieldName, val)}
                    required={field.required}
                    error={error}
                    fullWidth
                  />
                );
              case 'opening_hours_editor': {
                const dayOfWeekOptions = [
                  { value: 'Monday', label: '月曜日' },
                  { value: 'Tuesday', label: '火曜日' },
                  { value: 'Wednesday', label: '水曜日' },
                  { value: 'Thursday', label: '木曜日' },
                  { value: 'Friday', label: '金曜日' },
                  { value: 'Saturday', label: '土曜日' },
                  { value: 'Sunday', label: '日曜日' },
                ];

                return (
                  <div key={fieldName} className="admin-col-span-2">
                    <h3 className="admin-text-lg admin-font-semibold admin-mb-4">{fieldLabel}</h3>
                    {openingHours.map((hour, index) => !hour._destroy && (
                      <div key={hour.id || `new-${index}`} className="admin-child-model-item admin-mb-6 admin-p-4 admin-bg-gray-50 admin-rounded-md">
                        <div className="admin-grid admin-grid-cols-2 admin-gap-4">
                          <Select
                            id={`opening-hour-${index}-day`}
                            name={`opening-hour-${index}-day`}
                            label="曜日"
                            value={hour.dayOfWeek}
                            onChange={(val) => {
                              const newOpeningHours = [...openingHours];
                              newOpeningHours[index] = { ...newOpeningHours[index], dayOfWeek: val };
                              setOpeningHours(newOpeningHours);
                            }}
                            options={dayOfWeekOptions}
                            required
                            fullWidth
                          />
                          <ToggleSwitch
                            id={`opening-hour-${index}-is-closed`}
                            name={`opening-hour-${index}-is-closed`}
                            label="定休日"
                            checked={hour.isClosedDay}
                            onChange={(checked) => {
                              const newOpeningHours = [...openingHours];
                              newOpeningHours[index] = { ...newOpeningHours[index], isClosedDay: checked };
                              setOpeningHours(newOpeningHours);
                            }}
                          />
                          {!hour.isClosedDay && (
                            <>
                              <TextField
                                id={`opening-hour-${index}-open-time`}
                                name={`opening-hour-${index}-open-time`}
                                label="開始時間"
                                type="time"
                                value={hour.openTime || ''}
                                onChange={(e) => {
                                  const newOpeningHours = [...openingHours];
                                  newOpeningHours[index] = { ...newOpeningHours[index], openTime: e.target.value };
                                  setOpeningHours(newOpeningHours);
                                }}
                                fullWidth
                              />
                              <TextField
                                id={`opening-hour-${index}-close-time`}
                                name={`opening-hour-${index}-close-time`}
                                label="終了時間"
                                type="time"
                                value={hour.closeTime || ''}
                                onChange={(e) => {
                                  const newOpeningHours = [...openingHours];
                                  newOpeningHours[index] = { ...newOpeningHours[index], closeTime: e.target.value };
                                  setOpeningHours(newOpeningHours);
                                }}
                                fullWidth
                              />
                            </>
                          )}
                        </div>
                        <div className="admin-mt-3 admin-flex admin-justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              const newOpeningHours = [...openingHours];
                              if (hour.id) {
                                newOpeningHours[index]._destroy = true;
                              } else {
                                newOpeningHours.splice(index, 1);
                              }
                              setOpeningHours(newOpeningHours);
                            }}
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 admin-mr-1" />
                            削除
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setOpeningHours([...openingHours, { dayOfWeek: 'Monday', isClosedDay: false }]);
                      }}
                      className="admin-mt-2"
                    >
                      営業時間を追加
                    </Button>
                  </div>
                );
              }
              case 'spot_magazines_editor':
                return (
                  <div key={fieldName} className="admin-col-span-2">
                    <h3 className="admin-text-lg admin-font-semibold admin-mb-4">{fieldLabel}</h3>
                    {spotMagazines.map((spotMagazine, index) => !spotMagazine._destroy && (
                      <div key={spotMagazine.id || `new-${index}`} className="admin-child-model-item admin-mb-6 admin-p-4 admin-bg-gray-50 admin-rounded-md">
                        <div className="admin-grid admin-grid-cols-2 admin-gap-4">
                          <Select
                            id={`spot-magazine-${index}-magazine`}
                            name={`spot-magazine-${index}-magazine`}
                            label="雑誌"
                            value={spotMagazine.magazine?.id || ''}
                            onChange={(val) => {
                              const newSpotMagazines = [...spotMagazines];
                              newSpotMagazines[index] = { ...newSpotMagazines[index], magazine: { id: val } };
                              setSpotMagazines(newSpotMagazines);
                            }}
                            options={relationOptions['magazines'] || []}
                            required
                            fullWidth
                          />
                          <TextField
                            id={`spot-magazine-${index}-publication-feature`}
                            name={`spot-magazine-${index}-publication-feature`}
                            label="掲載特集"
                            value={spotMagazine.publicationFeature || ''}
                            onChange={(e) => {
                              const newSpotMagazines = [...spotMagazines];
                              newSpotMagazines[index] = { ...newSpotMagazines[index], publicationFeature: e.target.value };
                              setSpotMagazines(newSpotMagazines);
                            }}
                            fullWidth
                          />
                          <TextField
                            id={`spot-magazine-${index}-page-number`}
                            name={`spot-magazine-${index}-page-number`}
                            label="掲載ページ"
                            type="number"
                            value={spotMagazine.pageNumber || ''}
                            onChange={(e) => {
                              const newSpotMagazines = [...spotMagazines];
                              newSpotMagazines[index] = { ...newSpotMagazines[index], pageNumber: e.target.value ? parseInt(e.target.value, 10) : null };
                              setSpotMagazines(newSpotMagazines);
                            }}
                            fullWidth
                          />
                          <TextArea
                            id={`spot-magazine-${index}-notes`}
                            name={`spot-magazine-${index}-notes`}
                            label="備考"
                            value={spotMagazine.notes || ''}
                            onChange={(e) => {
                              const newSpotMagazines = [...spotMagazines];
                              newSpotMagazines[index] = { ...newSpotMagazines[index], notes: e.target.value };
                              setSpotMagazines(newSpotMagazines);
                            }}
                            fullWidth
                          />
                        </div>
                        <div className="admin-mt-3 admin-flex admin-justify-end">
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              const newSpotMagazines = [...spotMagazines];
                              if (spotMagazine.id) {
                                newSpotMagazines[index]._destroy = true;
                              } else {
                                newSpotMagazines.splice(index, 1);
                              }
                              setSpotMagazines(newSpotMagazines);
                            }}
                            size="sm"
                          >
                            <Trash2 className="h-4 w-4 admin-mr-1" />
                            削除
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setSpotMagazines([...spotMagazines, { magazine: { id: '' } }]);
                      }}
                      className="admin-mt-2"
                    >
                      雑誌を追加
                    </Button>
                  </div>
                );
              case 'number':
                const isLongitudeField = fieldName === 'longitude';
                return (
                  <div key={fieldName} className={isLongitudeField ? "admin-flex admin-items-end admin-gap-2" : ""}>
                    <TextField
                      id={fieldName}
                      name={fieldName}
                      label={fieldLabel}
                      type="number"
                      value={value !== undefined && value !== null ? String(value) : ''}
                      onChange={(e) => handleChange(fieldName, e.target.value ? Number(e.target.value) : null)}
                      required={field.required}
                      error={error}
                      fullWidth
                    />
                    {isLongitudeField && modelRoute === 'spots' && (
                      <Button
                        type="button"
                        onClick={handleFetchNearestStation}
                        disabled={nearestStationLoading}
                        className="admin-mb-1"
                      >
                        <Search className="h-4 w-4 admin-mr-1" />
                        {nearestStationLoading ? '検索中...' : '最寄駅を検索'}
                      </Button>
                    )}
                  </div>
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
