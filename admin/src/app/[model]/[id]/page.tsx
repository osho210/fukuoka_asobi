'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ApolloError, useLazyQuery } from '@apollo/client';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/TextField';
import { TextArea } from '@/components/forms/TextArea';
import { Select } from '@/components/forms/Select';
import { ToggleSwitch } from '@/components/forms/ToggleSwitch';
import { MultiSelect } from '@/components/forms/MultiSelect';
import OpeningHoursEditor, { EditableOpeningHour } from '@/components/forms/OpeningHoursEditor';
import ImageUpload from '@/components/forms/ImageUpload';
import { GooglePlacesSearch, GooglePlace, SyncedSpot } from '@/components/GooglePlacesSearch';
import { ArrowLeft, Save, Trash2, Search } from 'lucide-react';
import { createModel, updateModel, deleteModel } from '@/lib/modelGraphQL';
import { GET_NEAREST_STATION } from '@/graphql/queries/getNearestStation';
import { GetNearestStationQuery, GetNearestStationQueryVariables } from '@/__generated__/graphql';
import { ModelInput } from '@/lib/modelGraphQL';
import { useEnumOptions } from '@/hooks/useEnumOptions';

// 選択項目の型定義（MultiSelectコンポーネントと同じ定義）
interface RelationItem {
  __typename?: string;
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

// モデルデータの型定義
interface ModelData {
  id: string;
  openingHours?: EditableOpeningHour[];
  [key: string]: string | number | boolean | object | null | undefined | string[] | number[] | RelationItem[] | EditableOpeningHour[];
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
  magazines: '雑誌マスタ',
};

// 各モデルのフィールド定義
const modelFields: Record<string, { name: string; type: string; required?: boolean; enumKey?: string, modelName?: string; labelField?: string }[]> = {
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
    { name: 'description', type: 'textarea', required: false },
    { name: 'address', type: 'text', required: true },
    { name: 'phoneNumber', type: 'text' },
    { name: 'website', type: 'text' },
    { name: 'catchphrase', type: 'text' },
    { name: 'isRainyOk', type: 'boolean' },
    { name: 'budgetRange', type: 'select', required: true },
    { name: 'spotType', type: 'select', required: true, enumKey: 'SpotTypeEnum' },
    { name: 'minPeople', type: 'number', required: true },
    { name: 'maxPeople', type: 'number' },
    { name: 'recommendedFor1', type: 'text' },
    { name: 'recommendedFor2', type: 'text' },
    { name: 'instagramUrl', type: 'text', required: true },

    // Google Places API関連フィールド
    { name: 'googlePlaceId', type: 'text', required: true },
    { name: 'latitude', type: 'number', required: true },
    { name: 'longitude', type: 'number', required: true },
    { name: 'reviewRating', type: 'number' },
    { name: 'reviewCount', type: 'number' },
    { name: 'businessStatus', type: 'select' },
    { name: 'priceLevel', type: 'select', enumKey: 'PriceLevelEnum' },
    { name: 'primaryType', type: 'text' },
    { name: 'primaryTypeDisplayName', type: 'text' },
    { name: 'internationalPhoneNumber', type: 'text' },
    { name: 'shortFormattedAddress', type: 'text' },
    { name: 'googleMapsUri', type: 'text' },
    { name: 'googleTypes', type: 'textarea' },
    { name: 'generativeSummary', type: 'textarea' },
    { name: 'editorialSummary', type: 'textarea' },
    { name: 'priceRangeStartAmount', type: 'number' },
    { name: 'priceRangeEndAmount', type: 'number' },
    { name: 'pureServiceAreaBusiness', type: 'boolean' },

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

    // Payment Options
    { name: 'acceptsCreditCards', type: 'boolean' },
    { name: 'acceptsDebitCards', type: 'boolean' },
    { name: 'acceptsCashOnly', type: 'boolean' },
    { name: 'acceptsNfc', type: 'boolean' },

    // Parking Options
    { name: 'freeParkingLot', type: 'boolean' },
    { name: 'paidParkingLot', type: 'boolean' },
    { name: 'freeStreetParking', type: 'boolean' },
    { name: 'paidStreetParking', type: 'boolean' },
    { name: 'valetParking', type: 'boolean' },
    { name: 'freeGarageParking', type: 'boolean' },
    { name: 'paidGarageParking', type: 'boolean' },

    // 営業時間
    { name: 'openingHours', type: 'opening_hours_editor' },

    // 最寄駅
    { name: 'nearestStation', type: 'text' },

    // 関連データ
    { name: 'hashtag', type: 'multirelation', modelName: 'hashtags', labelField: 'hashtagName', required: true },
    { name: 'purpose', type: 'multirelation', modelName: 'Purpose', labelField: 'purposeName', required: true },
    { name: 'spotAmbiances', type: 'multirelation', modelName: 'spotAmbiances', labelField: 'ambianceName', required: true },
    { name: 'categories', type: 'multirelation', modelName: 'categories', labelField: 'name', required: true },
    { name: 'menu', type: 'multirelation', modelName: 'Menu', labelField: 'menuName' },
    { name: 'areas', type: 'multirelation', modelName: 'Area', labelField: 'areaName', required: true },
    { name: 'district', type: 'relation', modelName: 'District', labelField: 'districtName', required: true },
    { name: 'images', type: 'image_upload' },
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
  description: '説明',
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

  // Payment Options
  acceptsCreditCards: 'クレジットカード可',
  acceptsDebitCards: 'デビットカード可',
  acceptsCashOnly: '現金のみ',
  acceptsNfc: 'NFC決済可',

  // Parking Options
  freeParkingLot: '無料駐車場あり',
  paidParkingLot: '有料駐車場あり',
  freeStreetParking: '無料路上駐車あり',
  paidStreetParking: '有料路上駐車あり',
  valetParking: 'バレーパーキングあり',
  freeGarageParking: '無料ガレージ駐車あり',
  paidGarageParking: '有料ガレージ駐車あり',
  openingHours: '営業時間',
  nearestStation: '最寄駅',

  // Google Places API 詳細フィールド
  googleTypes: 'Google業種リスト',
  generativeSummary: 'AI要約',
  editorialSummary: '店舗の紹介(詳細)',
  priceRangeStartAmount: '価格下限',
  priceRangeEndAmount: '価格上限',
  images: '画像',
};

export default function ModelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const modelRoute = params?.model as string;
  const id = params?.id as string;
  const isNew = id === 'new';

  // 定義済みのenumを呼び出せるフックを使用
  const { options: priceLevelOptions } = useEnumOptions('PriceLevelEnum');
  const { options: spotTypeOptions } = useEnumOptions('SpotTypeEnum');
  const { options: budgetOptions } = useEnumOptions("BudgetTypeRangeEnum");
  // const { options: statusOptions } = useEnumOptions("StatusEnum");
  const { options: businessStatusOptions } = useEnumOptions("BusinessStatusEnum");

  const [getNearestStation, { loading: nearestStationLoading, error: nearestStationError }] = useLazyQuery<GetNearestStationQuery, GetNearestStationQueryVariables>(GET_NEAREST_STATION);

  // 選択肢の定義
  const selectOptions: Record<string, { value: string; label: string }[]> = {
    budgetRange: budgetOptions,
    businessStatus: businessStatusOptions,
    priceLevel: priceLevelOptions,
    spotType: spotTypeOptions,
  };

  const [formData, setFormData] = useState<ModelData | null>(null);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fieldLabel = modelDisplayNames[modelRoute] || modelRoute;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fields = modelFields[modelRoute] || [];

  useEffect(() => {
    if (nearestStationError) {
      alert(`最寄駅の取得に失敗しました: ${nearestStationError.message}`);
    }
  }, [nearestStationError]);

  const handleFetchNearestStation = async () => {
    if (!formData?.latitude || !formData?.longitude) {
      alert('緯度と経度を入力してください。');
      return;
    }

    try {
      const { data } = await getNearestStation({
        variables: {
          latitude: parseFloat(formData.latitude as string),
          longitude: parseFloat(formData.longitude as string),
        },
      });

      if (data?.nearestStation) {
        handleChange('nearestStation', data.nearestStation);
      } else {
        alert('最寄駅が見つかりませんでした。');
      }
    } catch (err) {
      // useEffectでエラーをハンドルするので、ここではログ出力のみ
      console.error('最寄駅の取得に失敗しました:', err);
    }
  };

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
            case 'relation':
            case 'multirelation':
              acc[field.name] = [];
              break;
            case 'opening_hours_editor':
              acc[field.name] = [];
              break;
            default:
              acc[field.name] = '';
          }
          return acc;
        }, {} as Record<string, string | boolean | RelationItem[] | EditableOpeningHour[]>)
      };
      setFormData(initialData);
      setIsLoading(false);
    }
  }, [isNew, fields]);

  const handleChange = (name: string, value: string | number | boolean | RelationData | string[] | number[] | RelationItem[] | EditableOpeningHour[]) => {
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

  const prepareFormData = (): ModelInput => {
    if (!formData) return {};

    const input: ModelInput = {};

    if (newImages.length > 0) {
      input.images = newImages;
    }

    // フォームデータからGraphQLミューテーション用のデータを作成
    fields.forEach((field) => {
      const fieldName = field.name;
      const value = formData?.[fieldName];

      // priceRange関連のフィールドは別途処理するためスキップ
      if (fieldName.startsWith('priceRange')) {
        return;
      }

      if (fieldName === 'openingHours' && Array.isArray(value)) {
        input.openingHoursAttributes = value.map(hour => {
          const { id, dayOfWeek, openTime, closeTime, isClosedDay, _destroy } = hour;
          const attributes: {
            id?: number;
            dayOfWeek: string;
            openTime: string | null;
            closeTime: string | null;
            isClosedDay: boolean;
            _destroy?: boolean;
          } = { dayOfWeek, openTime, closeTime, isClosedDay };
          if (id) {
            attributes.id = id;
          }
          if (_destroy) {
            attributes._destroy = _destroy;
          }
          return attributes;
        });
      } else if (field.type === 'relation' && Array.isArray(value) && value.length > 0) {
        const idFieldName = `${fieldName}Id`;
        const relationItem = value[0];
        if (relationItem && relationItem.id) {
          input[idFieldName] = Number(relationItem.id);
        }
      } else if (field.type === 'multirelation' && Array.isArray(value)) {
        // 複数関連フィールドの場合はIDの配列を設定
        const idFieldName = `${fieldName.replace(/s$/, '')}s`;
        // 配列の場合は、各要素を適切に処理して数値の配列に変換
        const ids = value
          .map(item => {
            if (typeof item === 'object' && item !== null && 'id' in item && typeof item.id === 'string') {
              return parseInt(item.id, 10);
            }
            if (typeof item === 'string') {
              return parseInt(item, 10);
            }
            if (typeof item === 'number') {
              return item;
            }
            return null; // 不正な値はnullにする
          })
          .filter((id): id is number => id !== null); // nullを除外

        input[idFieldName] = ids;
      } else {
        // 通常のフィールド
        if (value !== undefined && value !== null) {
          switch (field.type) {
            case 'number':
              // 空文字列の場合はnull、それ以外は数値に変換
              input[fieldName] = value === '' ? null : Number(value);
              break;
            case 'datetime':
              // 空文字列の場合はnull、それ以外は文字列として扱う
              input[fieldName] = value === '' ? null : (typeof value === 'object' && value !== null ? JSON.stringify(value) : value);
              break;
            case 'boolean':
              input[fieldName] = Boolean(value);
              break;
            case 'text':
            case 'textarea':
            case 'select':
              // 文字列に変換
              if (typeof value !== 'string') {
                input[fieldName] = String(value);
              } else {
                input[fieldName] = value;
              }
              break;
            default:
              // その他の型は、そのまま代入を試みる（relation, multirelationなどはここで処理されない）
              if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' || value === null) {
                input[fieldName] = value;
              }
              break;
          }
        }
      }
    });

    // priceRange関連のフィールドをフラットな構造でinputに追加
    const {
      priceRangeStartAmount,
      priceRangeEndAmount,
    } = formData;

    if (priceRangeStartAmount) {
      input.priceRangeStartAmount = Number(priceRangeStartAmount);
    }
    if (priceRangeEndAmount) {
      input.priceRangeEndAmount = Number(priceRangeEndAmount);
    }
    return input;
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
      if (err instanceof ApolloError) {
        // GraphQLのエラーメッセージを優先的に表示
        const messages = err.graphQLErrors.map((e) => e.message).join('\n');
        setError(messages || err.message);
      } else if (err instanceof Error) {
        // その他のJavaScriptエラー
        setError(err.message);
      } else {
        // 不明なエラー
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
                  updateField('editorialSummary', place.editorialSummary || '');

                  // 価格帯
                  if (place.priceRange) {
                    updateField('priceRangeStartAmount', place.priceRange.startPrice?.amount || null);
                    updateField('priceRangeEndAmount', place.priceRange.endPrice?.amount || null);
                  }

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

                  // Payment Options
                  updateField('acceptsCreditCards', place.paymentOptions?.acceptsCreditCards || false);
                  updateField('acceptsDebitCards', place.paymentOptions?.acceptsDebitCards || false);
                  updateField('acceptsCashOnly', place.paymentOptions?.acceptsCashOnly || false);
                  updateField('acceptsNfc', place.paymentOptions?.acceptsNfc || false);

                  // Parking Options
                  updateField('freeParkingLot', place.parkingOptions?.freeParkingLot || false);
                  updateField('paidParkingLot', place.parkingOptions?.paidParkingLot || false);
                  updateField('freeStreetParking', place.parkingOptions?.freeStreetParking || false);
                  updateField('paidStreetParking', place.parkingOptions?.paidStreetParking || false);
                  updateField('valetParking', place.parkingOptions?.valetParking || false);
                  updateField('freeGarageParking', place.parkingOptions?.freeGarageParking || false);
                  updateField('paidGarageParking', place.parkingOptions?.paidGarageParking || false);

                  // 営業時間を変換して更新
                  if (place.regularOpeningHours?.periods) {
                    const dayMapping: { [key: number]: string } = { 0: '日', 1: '月', 2: '火', 3: '水', 4: '木', 5: '金', 6: '土' };
                    const formattedHours = place.regularOpeningHours.periods.map(period => {
                      const formatTime = (time: { hour: number; minute: number; }) => {
                        const hour = String(time.hour).padStart(2, '0');
                        const minute = String(time.minute).padStart(2, '0');
                        return `${hour}:${minute}`;
                      };
                      return {
                        dayOfWeek: dayMapping[period.open.day],
                        openTime: formatTime(period.open),
                        closeTime: formatTime(period.close),
                        isClosedDay: false,
                      };
                    });
                    updateField('openingHours', formattedHours);
                  } else {
                    // データがない場合は空にする
                    updateField('openingHours', []);
                  }

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
                      if (key === 'openingHours' && Array.isArray(value)) {
                        // openingHoursはEditableOpeningHour形式に変換
                        type SyncedOpeningHour = {
                          id: number;
                          dayOfWeek: string;
                          openTime: string | null;
                          closeTime: string | null;
                          isClosedDay: boolean;
                        };
                        const formattedHours = (value as SyncedOpeningHour[]).map((hour) => ({
                          id: hour.id,
                          dayOfWeek: hour.dayOfWeek,
                          openTime: hour.openTime ? hour.openTime.substring(11, 16) : null,
                          closeTime: hour.closeTime ? hour.closeTime.substring(11, 16) : null,
                          isClosedDay: hour.isClosedDay,
                        }));
                        (updatedData as ModelData)[key] = formattedHours;
                      } else if (value !== null && value !== undefined) {
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
                const isLongitudeField = fieldName === 'longitude';
                return (
                  <div key={fieldName} className={isLongitudeField ? "admin-flex admin-items-end admin-gap-2" : ""}>
                    <TextField
                      id={fieldName}
                      name={fieldName}
                      label={fieldLabel}
                      type="number"
                      value={value !== undefined ? String(value) : ''}
                      onChange={(e) => handleChange(fieldName, e.target.value ? Number(e.target.value) : '')}
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
                return (
                  <MultiSelect
                    key={fieldName}
                    id={fieldName}
                    label={fieldLabel}
                    modelName={field.modelName || ''}
                    labelField={field.labelField || ''}
                    selectedValues={(value as RelationItem[]) || []}
                    onChange={(values) => handleChange(fieldName, values)}
                    required={field.required}
                    error={error}
                    fullWidth
                    maxSelection={1}
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
                    selectedValues={(value as RelationItem[]) || []}
                    onChange={(values) => handleChange(fieldName, values)}
                    required={field.required}
                    error={error}
                    fullWidth
                  />
                );
              case 'opening_hours_editor':
                return (
                  <div key={fieldName} className="col-span-2">
                    <OpeningHoursEditor
                      openingHours={(value as EditableOpeningHour[]) || []}
                      onChange={(hours) => handleChange(fieldName, hours)}
                    />
                  </div>
                );
              case 'image_upload': {
                // formDataから 'images' ではなく 'image_urls' を参照
                const existingImageUrls = (formData?.image_urls as string[] | undefined) || [];
                const existingImages = existingImageUrls.map((url) => ({
                  id: url,
                  url,
                }));
                return (
                  <div key={fieldName} className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">{fieldLabel}</label>
                    <ImageUpload
                      onImagesChange={setNewImages}
                      existingImages={existingImages} onDeleteImage={function (): void {
                        throw new Error('Function not implemented.');
                      }} />
                  </div>
                );
              }
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
