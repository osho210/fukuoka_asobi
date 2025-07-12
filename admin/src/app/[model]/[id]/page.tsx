'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/TextField';
import { TextArea } from '@/components/forms/TextArea';
import { Select } from '@/components/forms/Select';
import { ToggleSwitch } from '@/components/forms/ToggleSwitch';
import { MultiSelect } from '@/components/forms/MultiSelect';
import { GooglePlacesSearch, GooglePlace, SyncedSpot } from '@/components/GooglePlacesSearch';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { createModel, updateModel, deleteModel } from '@/lib/modelGraphQL';
import { ModelInput } from '@/lib/modelGraphQL';

// 選択項目の型定義（MultiSelectコンポーネントと同じ定義）
interface RelationItem {
  __typename?: string;
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

// モデルデータの型定義
interface ModelData {
  id: string;
  [key: string]: string | number | boolean | object | null | string[] | number[] | RelationItem[];
}

// 関連データの型定義（RelationItemと互換性を持たせる）
interface RelationData {
  id: string;
  [key: string]: string | number | boolean | object | null | undefined;
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

    // Google Places API関連フィールド
    { name: 'googlePlaceId', type: 'text' },
    { name: 'latitude', type: 'number' },
    { name: 'longitude', type: 'number' },
    { name: 'reviewRating', type: 'number' },
    { name: 'reviewCount', type: 'number' },
    { name: 'businessStatus', type: 'select' },
    { name: 'priceLevel', type: 'select' },
    { name: 'primaryType', type: 'text' },
    { name: 'primaryTypeDisplayName', type: 'text' },
    { name: 'internationalPhoneNumber', type: 'text' },
    { name: 'shortFormattedAddress', type: 'text' },
    { name: 'googleMapsUri', type: 'text' },
    { name: 'timeZoneId', type: 'text' },

    // サービス提供情報
    { name: 'takeout', type: 'boolean' },
    { name: 'delivery', type: 'boolean' },
    { name: 'dineIn', type: 'boolean' },
    { name: 'reservable', type: 'boolean' },
    { name: 'servesBreakfast', type: 'boolean' },
    { name: 'servesLunch', type: 'boolean' },
    { name: 'servesDinner', type: 'boolean' },
    { name: 'servesBrunch', type: 'boolean' },
    { name: 'servesBeer', type: 'boolean' },
    { name: 'servesWine', type: 'boolean' },
    { name: 'servesVegetarianFood', type: 'boolean' },
    { name: 'outdoorSeating', type: 'boolean' },
    { name: 'liveMusic', type: 'boolean' },
    { name: 'menuForChildren', type: 'boolean' },
    { name: 'servesCocktails', type: 'boolean' },
    { name: 'servesDessert', type: 'boolean' },
    { name: 'servesCoffee', type: 'boolean' },
    { name: 'goodForChildren', type: 'boolean' },
    { name: 'allowsDogs', type: 'boolean' },
    { name: 'restroom', type: 'boolean' },
    { name: 'goodForGroups', type: 'boolean' },
    { name: 'goodForWatchingSports', type: 'boolean' },

    // 関連データ
    { name: 'menu', type: 'multirelation', modelName: 'Menu', labelField: 'menuName' },
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

  // Google Places API関連
  googlePlaceId: 'Google Place ID',
  latitude: '緯度',
  longitude: '経度',
  reviewRating: '評価',
  reviewCount: 'レビュー数',
  businessStatus: '営業状況',
  priceLevel: '価格帯',
  primaryType: '主要タイプ',
  primaryTypeDisplayName: '主要タイプ表示名',
  internationalPhoneNumber: '国際電話番号',
  shortFormattedAddress: '短縮住所',
  googleMapsUri: 'Google Maps URI',
  timeZoneId: 'タイムゾーンID',

  // サービス提供情報
  takeout: 'テイクアウト',
  delivery: 'デリバリー',
  dineIn: '店内飲食',
  reservable: '予約可能',
  servesBreakfast: '朝食提供',
  servesLunch: '昼食提供',
  servesDinner: '夕食提供',
  servesBrunch: 'ブランチ提供',
  servesBeer: 'ビール提供',
  servesWine: 'ワイン提供',
  servesVegetarianFood: 'ベジタリアン料理',
  outdoorSeating: '屋外席',
  liveMusic: 'ライブ音楽',
  menuForChildren: '子供向けメニュー',
  servesCocktails: 'カクテル提供',
  servesDessert: 'デザート提供',
  servesCoffee: 'コーヒー提供',
  goodForChildren: '子供向け',
  allowsDogs: 'ペット可',
  restroom: 'トイレ',
  goodForGroups: 'グループ向け',
  goodForWatchingSports: 'スポーツ観戦向け',
};

// 選択肢の定義
const selectOptions: Record<string, { value: string; label: string }[]> = {
  budgetRange: [
    { value: '安い', label: '安い' },
    { value: '普通', label: '普通' },
    { value: '高い', label: '高い' },
  ],
  businessStatus: [
    { value: 'unspecified', label: '未指定' },
    { value: 'operational', label: '営業中' },
    { value: 'closed_temporarily', label: '一時休業' },
    { value: 'closed_permanently', label: '閉店' },
  ],
  priceLevel: [
    { value: 'unspecified', label: '未指定' },
    { value: 'free', label: '無料' },
    { value: 'inexpensive', label: '安価' },
    { value: 'moderate', label: '普通' },
    { value: 'expensive', label: '高価' },
    { value: 'very_expensive', label: '非常に高価' },
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
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fieldLabel = modelDisplayNames[modelRoute] || modelRoute;
  const fields = modelFields[modelRoute] || [];

  // 新規作成時の初期データ設定
  useEffect(() => {
    if (isNew) {
      const initialData: ModelData = {
        id: 'new',
        ...fields.reduce((acc, field) => {
          switch (field.type) {
            case 'boolean':
              acc[field.name] = false;
              break;
            case 'multirelation':
              acc[field.name] = [];
              break;
            default:
              acc[field.name] = '';
          }
          return acc;
        }, {} as Record<string, string | boolean | RelationItem[]>)
      };
      setFormData(initialData);
      setIsLoading(false);
    }
  }, [isNew, fields]);

  const handleChange = (name: string, value: string | number | boolean | RelationData | string[] | number[] | RelationItem[]) => {
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

        input[idFieldName] = ids;
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
              case 'number':
                return (
                  <TextField
                    key={fieldName}
                    id={fieldName}
                    name={fieldName}
                    label={fieldLabel}
                    type="number"
                    value={value !== undefined ? String(value) : undefined}
                    onChange={(e) => handleChange(fieldName, Number(e.target.value))}
                    required={field.required}
                    error={error}
                    fullWidth
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
                  <>

                    <MultiSelect
                      key={fieldName}
                      id={fieldName}
                      label={fieldLabel}
                      modelName={field.modelName || ''}
                      labelField={field.labelField || ''}
                      selectedValues={(value as RelationItem[]) || []}
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
                    {value}

                  </>
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
                    selectedValues={(value as RelationItem[]) || []}
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

      {/* Google Places検索（スポットの場合のみ表示） */}
      {modelRoute === 'spots' && (
        <div className="admin-mt-6">
          <GooglePlacesSearch
            spotId={isNew ? undefined : id}
            onPlaceSelect={(place: GooglePlace) => {
              // 新規作成時・編集時ともに、選択した場所の情報をフォームに自動入力
              if (formData) {
                setFormData(prev => {
                  if (!prev) return null;
                  const newFormData = { ...prev };

                  // Google Place APIから取得した値でフォームを更新
                  // 値が存在する場合のみ更新する
                  const updateField = <K extends keyof ModelData>(key: K, value: ModelData[K]) => {
                    if (value !== undefined && value !== null) {
                      newFormData[key] = value;
                    }
                  };

                  updateField('spotName', place.name || '');
                  updateField('address', place.formattedAddress || '');
                  updateField('phoneNumber', place.nationalPhoneNumber || '');
                  updateField('website', place.websiteUri || '');
                  updateField('googlePlaceId', place.placeId || '');
                  updateField('latitude', place.location?.latitude || null);
                  updateField('longitude', place.location?.longitude || null);
                  updateField('reviewRating', place.rating || null);
                  updateField('reviewCount', place.userRatingCount || null);
                  updateField('businessStatus', place.businessStatus || '');
                  updateField('priceLevel', place.priceLevel || '');
                  updateField('primaryType', place.primaryType || '');
                  updateField('primaryTypeDisplayName', place.primaryTypeDisplayName || '');
                  updateField('internationalPhoneNumber', place.internationalPhoneNumber || '');
                  updateField('shortFormattedAddress', place.shortFormattedAddress || '');
                  updateField('googleMapsUri', place.googleMapsUri || '');

                  // サービス提供情報 (boolean)
                  updateField('takeout', place.takeout || false);
                  updateField('delivery', place.delivery || false);
                  updateField('dineIn', place.dineIn || false);
                  updateField('reservable', place.reservable || false);
                  updateField('servesBreakfast', place.servesBreakfast || false);
                  updateField('servesLunch', place.servesLunch || false);
                  updateField('servesDinner', place.servesDinner || false);
                  updateField('servesBrunch', place.servesBrunch || false);
                  updateField('servesBeer', place.servesBeer || false);
                  updateField('servesWine', place.servesWine || false);
                  updateField('servesCocktails', place.servesCocktails || false);
                  updateField('servesDessert', place.servesDessert || false);
                  updateField('servesCoffee', place.servesCoffee || false);
                  updateField('outdoorSeating', place.outdoorSeating || false);
                  updateField('liveMusic', place.liveMusic || false);
                  updateField('menuForChildren', place.menuForChildren || false);
                  updateField('goodForChildren', place.goodForChildren || false);
                  updateField('allowsDogs', place.allowsDogs || false);
                  updateField('restroom', place.restroom || false);
                  updateField('goodForGroups', place.goodForGroups || false);
                  updateField('goodForWatchingSports', place.goodForWatchingSports || false);

                  return newFormData;
                });
              }
            }}
            onSyncComplete={(syncedSpot: SyncedSpot) => {
              // 編集時：同期完了後にフォームデータを更新
              if (!isNew) {
                setFormData(prev => {
                  if (!prev) return null;
                  // 同期で返ってきた値でフォームデータを上書きする
                  // syncedSpotに存在しないキーは元の値を維持する
                  const updatedData = { ...prev };
                  for (const key in syncedSpot) {
                    if (Object.prototype.hasOwnProperty.call(syncedSpot, key)) {
                      const value = syncedSpot[key as keyof SyncedSpot];
                      if (value !== null && value !== undefined) {
                        (updatedData as ModelData)[key] = value;
                      }
                    }
                  }
                  return updatedData;
                });
              }
            }}
          />
        </div>
      )}
    </div>
  );
}
