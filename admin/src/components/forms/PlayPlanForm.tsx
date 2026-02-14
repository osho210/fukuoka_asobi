'use client';

import { useState, useEffect } from 'react';
import PlanDetailForm from './PlanDetailForm';
import ImageUpload from './ImageUpload';
import ImagePropertiesEditor from '../ImagePropertiesEditor';
import '@/styles/play-plans.css';
import { Spot, RecommendedFor, ImageProperty } from '@/__generated__/graphql';

export interface ExistingImage {
  id: string;
  url: string;
}

export interface PlanDetailFormData {
  id?: string;
  stepNumber: number;
  stepName: string;
  stepDescription?: string;
  plannerTitle?: string;
  spotId?: string;
  comment?: string;
  startTime?: string;
  endTime?: string;
  durationMinutes?: number;
  budget?: string;
  notes?: string;
  travelDetails?: Array<{
    id?: string;
    sequenceNumber: number;
    travelMethod?: string;
    travelTime?: string;
    notes?: string;
  }>;
}

export interface PlayPlanFormData {
  planName: string;
  catchCopy?: string;
  subtitle?: string;
  leadText?: string;
  departure?: string;
  departureTime?: string;
  travelMethodToFirstSpot?: string;
  travelTimeToFirstSpot?: string;
  description?: string;
  status: string;
  tripType: string;
  totalBudget?: string;
  location?: string;
  startTime?: string;
  endTime?: string;
  imageUrl?: string;
  imageUrls?: ExistingImage[];
  imageProperties?: ImageProperty[];
  newImages?: string[];
  deleteImageIds?: string[];
  tags?: string;
  recommendUsers: string[];
  isRecommended?: boolean;
  isPublic?: boolean;
  planDetails: PlanDetailFormData[];
  plannerTitle?: string;
  plannerDescription?: string;
}

interface PlayPlanFormProps {
  initialData: PlayPlanFormData;
  spots: Spot[];
  recommendedFors: RecommendedFor[];
  districts: { id: string; districtName: string }[];
  onSubmit: (data: PlayPlanFormData) => void;
  onCancel: () => void;
  isSubmitting: boolean;
  submitButtonText: string;
}

export default function PlayPlanForm({
  initialData,
  spots,
  recommendedFors,
  districts,
  onSubmit,
  onCancel,
  isSubmitting,
  submitButtonText,
}: PlayPlanFormProps) {
  const [formData, setFormData] = useState<PlayPlanFormData>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isManualBudget, setIsManualBudget] = useState<boolean>(false);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  /**
   * 新しい画像と既存画像から ImageProperty を生成します
   * @param newImages - Base64エンコードされた新規画像
   * @param existingImages - 既存画像の配列
   * @param currentProperties - 現在の画像プロパティ
   * @returns ImageProperty の配列
   */
  const generateImageProperties = (
    newImages?: string[],
    existingImages?: ExistingImage[],
    currentProperties?: ImageProperty[]
  ) => {
    const properties: ImageProperty[] = [];

    if (existingImages && currentProperties) {
      existingImages.forEach((img) => {
        const existing = currentProperties.find(p => p.attachmentId === img.id);
        if (existing) {
          properties.push({
            attachmentId: existing.attachmentId,
            url: img.url,
            isSelected: existing.isSelected,
            comment: existing.comment || null,
            position: existing.position,
          });
        } else {
          properties.push({
            attachmentId: img.id,
            url: img.url,
            isSelected: false,
            comment: null,
            position: properties.length,
          });
        }
      });
    }

    if (newImages) {
      newImages.forEach((img, idx) => {
        properties.push({
          attachmentId: `new-${idx}-${Date.now()}`,
          url: img,
          isSelected: false,
          comment: null,
          position: properties.length,
        });
      });
    }

    return properties;
  };

  /**
   * 各spotの総予算を計算する関数
   * @param planDetails - プラン詳細の配列
   * @returns 総予算の合計
   */
  const calculateTotalBudget = (planDetails: PlanDetailFormData[]): number => {
    return planDetails.reduce((total, detail) => {
      const budget = parseFloat(detail.budget || '0');
      return total + (isNaN(budget) ? 0 : budget);
    }, 0);
  };

  const calculatedBudget = calculateTotalBudget(formData.planDetails);
  const budgetDifference = (parseFloat(formData.totalBudget || '0') - calculatedBudget);

  /**
   * バックエンドのmutation定義に基づく必須フィールドの定義
   * mutation定義: create_or_update_play_plan_with_details.rb を参照
   */
  const REQUIRED_FIELDS: Set<keyof PlayPlanFormData> = new Set([
    'planName',                    // required: true
    'catchCopy',                   // required: true
    'subtitle',                    // required: true
    'leadText',                    // required: true
    'description',                 // required: true
    'departure',                   // required: true
    'departureTime',               // required: true
    'travelMethodToFirstSpot',     // required: true
    'travelTimeToFirstSpot',       // required: true
    'status',                      // required: true
    'tripType',                    // required: true
    'totalBudget',                 // required: true
    'location',                    // required: true
    'startTime',                   // required: true
    'endTime',                     // required: true
    'tags',                        // required: true
    'plannerTitle',                // required: true
    'plannerDescription',          // required: true
  ]);

  const OPTIONAL_FIELDS: Set<keyof PlayPlanFormData> = new Set([
    'imageUrl',
    'imageUrls',
    'imageProperties',
    'newImages',
    'deleteImageIds',
    'recommendUsers',
    'isRecommended',
  ]);

  /**
   * 個別フィールドのバリデーションを実行します
   * バックエンドのrequired設定に合わせて実装
   * @param field - フィールド名
   * @param value - 入力値
   * @returns エラーメッセージ（エラーがない場合はnull）
   */
  const validateField = (field: keyof PlayPlanFormData, value: unknown): string | null => {
    const stringValue = String(value ?? '').trim();

    // 必須フィールド（バックエンドで required: true）
    if (REQUIRED_FIELDS.has(field)) {
      switch (field) {
        case 'planName':
          return !stringValue ? 'プラン名は必須です' : null;
        case 'catchCopy':
          return !stringValue ? 'キャッチコピーは必須です' : null;
        case 'subtitle':
          return !stringValue ? 'サブタイトルは必須です' : null;
        case 'leadText':
          return !stringValue ? 'リードテキストは必須です' : null;
        case 'description':
          return !stringValue ? 'プラン説明は必須です' : null;
        case 'departure':
          return !stringValue ? '集合場所は必須です' : null;
        case 'departureTime':
          return !stringValue ? '集合時間は必須です' : null;
        case 'travelMethodToFirstSpot':
          return !stringValue ? '最初の目的地までの移動手段は必須です' : null;
        case 'travelTimeToFirstSpot':
          return !stringValue ? '最初の目的地までの移動時間は必須です' : null;
        case 'status':
          return !value ? 'ステータスは必須です' : null;
        case 'tripType':
          return !value ? '旅行タイプは必須です' : null;
        case 'totalBudget':
          return !value ? '総予算は必須です' : null;
        case 'location':
          return !stringValue ? 'エリアは必須です' : null;
        case 'startTime':
          return !stringValue ? '開始時刻は必須です' : null;
        case 'endTime':
          return !stringValue ? '終了時刻は必須です' : null;
        case 'tags':
          return !stringValue ? 'タグは必須です' : null;
        case 'plannerTitle':
          return !stringValue ? 'プランナータイトルは必須です' : null;
        case 'plannerDescription':
          return !stringValue ? 'プランナー説明は必須です' : null;
        default:
          return null;
      }
    }

    // オプションフィールド（バックエンドで required: false）
    if (OPTIONAL_FIELDS.has(field)) {
      return null;
    }

    return null;
  };

  /**
   * フィールド入力時のハンドラー（リアルタイムバリデーション付き）
   * @param field - フィールド名
   * @param value - 入力値
   */
  const handleInputChangeWithValidation = (field: keyof PlayPlanFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // リアルタイムバリデーションを実行
    const error = validateField(field, value);
    setErrors(prev => {
      if (error) {
        return { ...prev, [field]: error };
      } else {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
    });
  };

  const handlePlanDetailsChange = (planDetails: PlanDetailFormData[]) => {
    const newCalculatedBudget = calculateTotalBudget(planDetails);
    setFormData(prev => ({
      ...prev,
      planDetails,
      totalBudget: isManualBudget ? prev.totalBudget : newCalculatedBudget.toString(),
    }));
  };

  const handlePlanEndTimeChange = (endTime: string) => {
    setFormData(prev => ({
      ...prev,
      endTime,
    }));
  };

  const handleTotalBudgetChange = (value: string) => {
    setIsManualBudget(true);
    handleInputChangeWithValidation('totalBudget', value);
  };

  const resetToCalculatedBudget = () => {
    setIsManualBudget(false);
    setFormData(prev => ({
      ...prev,
      totalBudget: calculatedBudget.toString(),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // 必須フィールドのバリデーション（バックエンドのrequired: trueに対応）
    if (!formData.planName?.trim()) {
      newErrors.planName = 'プラン名は必須です';
    }
    if (!formData.catchCopy?.trim()) {
      newErrors.catchCopy = 'キャッチコピーは必須です';
    }
    if (!formData.subtitle?.trim()) {
      newErrors.subtitle = 'サブタイトルは必須です';
    }
    if (!formData.leadText?.trim()) {
      newErrors.leadText = 'リードテキストは必須です';
    }
    if (!formData.description?.trim()) {
      newErrors.description = 'プラン説明は必須です';
    }
    if (!formData.departure?.trim()) {
      newErrors.departure = '集合場所は必須です';
    }
    if (!formData.departureTime) {
      newErrors.departureTime = '集合時間は必須です';
    }
    if (!formData.travelMethodToFirstSpot) {
      newErrors.travelMethodToFirstSpot = '最初の目的地までの移動手段は必須です';
    }
    if (!formData.travelTimeToFirstSpot) {
      newErrors.travelTimeToFirstSpot = '最初の目的地までの移動時間は必須です';
    }
    if (!formData.status) {
      newErrors.status = 'ステータスは必須です';
    }
    if (!formData.tripType) {
      newErrors.tripType = '旅行タイプは必須です';
    }
    if (!formData.totalBudget) {
      newErrors.totalBudget = '総予算は必須です';
    }
    if (!formData.location?.trim()) {
      newErrors.location = 'エリアは必須です';
    }
    if (!formData.startTime) {
      newErrors.startTime = '開始時刻は必須です';
    }
    if (!formData.endTime) {
      newErrors.endTime = '終了時刻は必須です';
    }
    if (!formData.tags?.trim()) {
      newErrors.tags = 'タグは必須です';
    }
    if (!formData.plannerTitle?.trim()) {
      newErrors.plannerTitle = 'プランナータイトルは必須です';
    }
    if (!formData.plannerDescription?.trim()) {
      newErrors.plannerDescription = 'プランナー説明は必須です';
    }

    // プラン詳細のバリデーション
    if (formData.planDetails.length === 0) {
      newErrors.planDetails = '少なくとも1つのステップが必要です';
    }

    formData.planDetails.forEach((detail, index) => {
      if (!detail.stepName.trim()) {
        newErrors[`planDetails.${index}.stepName`] = 'ステップ名は必須です';
      }
    });

    // 日付の整合性チェック
    if (formData.startTime && formData.endTime) {
      if (new Date(`2000-01-01T${formData.startTime}`) >= new Date(`2000-01-01T${formData.endTime}`)) {
        newErrors.endTime = '終了時刻は開始時刻より後である必要があります';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * フォームデータをクリーンアップして送信します
   * 空の値をundefinedに変換し、GraphQLエラーを防止します
   * @param data - 送信するフォームデータ
   * @returns クリーンアップされたデータ
   */
  const cleanFormData = (data: PlayPlanFormData): PlayPlanFormData => {
    return {
      ...data,
      catchCopy: data.catchCopy?.trim() || undefined,
      subtitle: data.subtitle?.trim() || undefined,
      leadText: data.leadText?.trim() || undefined,
      description: data.description?.trim() || undefined,
      tags: data.tags?.trim() || undefined,
      location: data.location?.trim() || undefined,
      plannerTitle: data.plannerTitle?.trim() || undefined,
      plannerDescription: data.plannerDescription?.trim() || undefined,
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const cleanedData = cleanFormData(formData);
    onSubmit(cleanedData);
  };

  return (
    <form onSubmit={handleSubmit} className="play-plan-form">
      <div className="play-plan-form__section">
        <h2 className="play-plan-form__section-title">公開情報</h2>
        <div className="play-plan-form__grid">
          <div className="play-plan-form__field">
            <label className="play-plan-form__checkbox-item">
              <input
                type="checkbox"
                id="isRecommended"
                checked={formData.isRecommended || false}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    isRecommended: e.target.checked,
                  }));
                }}
                className="play-plan-form__checkbox"
              />
              <span className="play-plan-form__checkbox-label">編集部おすすめに設定</span>
            </label>
          </div>
          <div className="play-plan-form__field">
            <label className="play-plan-form__checkbox-item">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic ?? false}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    isPublic: e.target.checked,
                  }));
                }}
                className="play-plan-form__checkbox"
              />
              <span className="play-plan-form__checkbox-label">公開する（チェックすると検索結果に表示されます）</span>
            </label>
          </div>
        </div>

        <h2 className="play-plan-form__section-title">基本情報</h2>
        <div className="play-plan-form__grid">
          <div className="play-plan-form__field">
            <label htmlFor="planName" className="play-plan-form__label play-plan-form__label--required">
              プラン名
            </label>
            <input
              type="text"
              id="planName"
              value={formData.planName}
              onChange={(e) => handleInputChangeWithValidation('planName', e.target.value)}
              className={`play-plan-form__input ${errors.planName ? 'play-plan-form__input--error' : ''}`}
              placeholder="プラン名を入力"
            />
            {errors.planName && <p className="play-plan-form__error">{errors.planName}</p>}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="catchCopy" className="play-plan-form__label play-plan-form__label--required">
              キャッチコピー
            </label>
            <input
              type="text"
              id="catchCopy"
              value={formData.catchCopy || ''}
              onChange={(e) => handleInputChangeWithValidation('catchCopy', e.target.value)}
              className={`play-plan-form__input ${errors.catchCopy ? 'play-plan-form__input--error' : ''}`}
              placeholder="キャッチコピーを入力"
            />
            {errors.catchCopy && <p className="play-plan-form__error">{errors.catchCopy}</p>}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="subtitle" className="play-plan-form__label play-plan-form__label--required">
              サブタイトル
            </label>
            <input
              type="text"
              id="subtitle"
              value={formData.subtitle || ''}
              onChange={(e) => handleInputChangeWithValidation('subtitle', e.target.value)}
              className={`play-plan-form__input ${errors.subtitle ? 'play-plan-form__input--error' : ''}`}
              placeholder="サブタイトルを入力"
            />
            {errors.subtitle && <p className="play-plan-form__error">{errors.subtitle}</p>}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="leadText" className="play-plan-form__label play-plan-form__label--required">
              リードテキスト
            </label>
            <textarea
              id="leadText"
              rows={4}
              value={formData.leadText || ''}
              onChange={(e) => handleInputChangeWithValidation('leadText', e.target.value)}
              className={`play-plan-form__input ${errors.leadText ? 'play-plan-form__input--error' : ''}`}
              placeholder="リードテキストを入力"
            />
            {errors.leadText && <p className="play-plan-form__error">{errors.leadText}</p>}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="location" className="play-plan-form__label play-plan-form__label--required">
              エリア選択
            </label>
            <select
              id="location"
              value={formData.location || ''}
              onChange={(e) => handleInputChangeWithValidation('location', e.target.value)}
              className={`play-plan-form__select ${errors.location ? 'play-plan-form__select--error' : ''}`}
            >
              <option value="">選択してください</option>
              {districts?.map((district) => (
                <option key={district.id} value={district.districtName}>
                  {district.districtName}
                </option>
              ))}
            </select>
            {errors.location && <p className="play-plan-form__error">{errors.location}</p>}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="description" className="play-plan-form__label play-plan-form__label--required">
              プラン説明
            </label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChangeWithValidation('description', e.target.value)}
              rows={4}
              className={`play-plan-form__textarea ${errors.description ? 'play-plan-form__input--error' : ''}`}
              placeholder="プランの説明を入力"
            />
            {errors.description && <p className="play-plan-form__error">{errors.description}</p>}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="status" className="play-plan-form__label play-plan-form__label--required">
              ステータス
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChangeWithValidation('status', e.target.value)}
              className={`play-plan-form__select ${errors.status ? 'play-plan-form__select--error' : ''}`}
            >
              <option value="">選択してください</option>
              <option value="DRAFT">下書き</option>
              <option value="PUBLISHED">公開</option>
            </select>
            {errors.status && <p className="play-plan-form__error">{errors.status}</p>}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="tripType" className="play-plan-form__label play-plan-form__label--required">
              旅行タイプ
            </label>
            <select
              id="tripType"
              value={formData.tripType}
              onChange={(e) => handleInputChangeWithValidation('tripType', e.target.value)}
              className={`play-plan-form__select ${errors.tripType ? 'play-plan-form__select--error' : ''}`}
            >
              <option value="">選択してください</option>
              <option value="DAY_TRIP">日帰り</option>
              <option value="OVERNIGHT">泊まり</option>
            </select>
            {errors.tripType && <p className="play-plan-form__error">{errors.tripType}</p>}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="departure" className="play-plan-form__label play-plan-form__label--required">
              集合場所
            </label>
            <input
              type="text"
              id="departure"
              value={formData.departure || ''}
              onChange={(e) => handleInputChangeWithValidation('departure', e.target.value)}
              className={`play-plan-form__input ${errors.departure ? 'play-plan-form__input--error' : ''}`}
              placeholder="集合場所を入力"
            />
            {errors.departure && <p className="play-plan-form__error">{errors.departure}</p>}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="departureTime" className="play-plan-form__label play-plan-form__label--required">
              集合時間
            </label>
            <input
              type="time"
              id="departureTime"
              value={formData.departureTime || ''}
              onChange={(e) => handleInputChangeWithValidation('departureTime', e.target.value)}
              className={`play-plan-form__input ${errors.departureTime ? 'play-plan-form__input--error' : ''}`}
            />
            {errors.departureTime && <p className="play-plan-form__error">{errors.departureTime}</p>}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="travelMethodToFirstSpot" className="play-plan-form__label play-plan-form__label--required">
              最初の目的地までの移動手段
            </label>
            <select
              id="travelMethodToFirstSpot"
              value={formData.travelMethodToFirstSpot || ''}
              onChange={(e) => handleInputChangeWithValidation('travelMethodToFirstSpot', e.target.value)}
              className={`play-plan-form__select ${errors.travelMethodToFirstSpot ? 'play-plan-form__select--error' : ''}`}
            >
              <option value="">選択してください</option>
              <option value="徒歩">徒歩</option>
              <option value="電車">電車</option>
              <option value="車">車</option>
              <option value="自転車">自転車</option>
              <option value="その他">その他</option>
            </select>
            {errors.travelMethodToFirstSpot && <p className="play-plan-form__error">{errors.travelMethodToFirstSpot}</p>}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="travelTimeToFirstSpot" className="play-plan-form__label play-plan-form__label--required">
              最初の目的地までの移動時間（分）
            </label>
            <input
              type="number"
              id="travelTimeToFirstSpot"
              value={formData.travelTimeToFirstSpot || ''}
              onChange={(e) => handleInputChangeWithValidation('travelTimeToFirstSpot', e.target.value)}
              className={`play-plan-form__input ${errors.travelTimeToFirstSpot ? 'play-plan-form__input--error' : ''}`}
              placeholder="移動時間を入力"
              min="0"
            />
            {errors.travelTimeToFirstSpot && <p className="play-plan-form__error">{errors.travelTimeToFirstSpot}</p>}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="totalBudget" className="play-plan-form__label play-plan-form__label--required">
              総予算
            </label>
            <div className="play-plan-form__budget-container">
              <input
                type="number"
                id="totalBudget"
                value={formData.totalBudget || ''}
                onChange={(e) => handleTotalBudgetChange(e.target.value)}
                className={`play-plan-form__input ${errors.totalBudget ? 'play-plan-form__input--error' : ''}`}
                placeholder="予算を入力"
                min="0"
              />
              {!isManualBudget && (
                <button
                  type="button"
                  onClick={() => setIsManualBudget(true)}
                  className="play-plan-form__budget-manual-btn"
                  title="手動調整モードに切り替え"
                >
                  手動調整
                </button>
              )}
              {isManualBudget && (
                <button
                  type="button"
                  onClick={resetToCalculatedBudget}
                  className="play-plan-form__budget-auto-btn"
                  title="自動計算に戻す"
                >
                  自動計算に戻す
                </button>
              )}
            </div>
            <div className="play-plan-form__budget-info">
              <p className="play-plan-form__budget-calculated">
                計算値: ¥{calculatedBudget.toLocaleString()}
              </p>
              {isManualBudget && budgetDifference !== 0 && (
                <p className={`play-plan-form__budget-difference ${budgetDifference > 0 ? 'play-plan-form__budget-difference--positive' : 'play-plan-form__budget-difference--negative'}`}>
                  差分: {budgetDifference > 0 ? '+' : ''}¥{budgetDifference.toLocaleString()}
                </p>
              )}
            </div>
            {errors.totalBudget && <p className="play-plan-form__error">{errors.totalBudget}</p>}
          </div>

          <div className="play-plan-form__field play-plan-form__field--full-width">
            <label className="play-plan-form__label">画像</label>
            <ImageUpload
              onImagesChange={(base64Images) => {
                const updatedProperties = generateImageProperties(
                  base64Images,
                  formData.imageUrls,
                  formData.imageProperties
                );
                setFormData(prev => ({
                  ...prev,
                  newImages: base64Images,
                  imageProperties: updatedProperties,
                }));
              }}
              onDeleteImage={(id) => {
                setFormData(prev => ({
                  ...prev,
                  deleteImageIds: [...(prev.deleteImageIds || []), id],
                }));
              }}
              existingImages={formData.imageUrls || []}
            />
          </div>

          <div className="play-plan-form__field play-plan-form__field--full-width">
            <ImagePropertiesEditor
              imageProperties={(formData.imageProperties || [])}
              onChange={(properties) => {
                setFormData(prev => ({
                  ...prev,
                  imageProperties: properties,
                }));
              }}
              maxSelected={3}
            />
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="startTime" className="play-plan-form__label play-plan-form__label--required">
              開始時刻
            </label>
            <input
              type="time"
              id="startTime"
              value={formData.startTime || ''}
              onChange={(e) => handleInputChangeWithValidation('startTime', e.target.value)}
              className={`play-plan-form__input ${errors.startTime ? 'play-plan-form__input--error' : ''}`}
            />
            {errors.startTime && <p className="play-plan-form__error">{errors.startTime}</p>}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="endTime" className="play-plan-form__label play-plan-form__label--required">
              終了時刻
            </label>
            <input
              type="time"
              id="endTime"
              value={formData.endTime || ''}
              onChange={(e) => handleInputChangeWithValidation('endTime', e.target.value)}
              className={`play-plan-form__input ${errors.endTime ? 'play-plan-form__input--error' : ''}`}
            />
            {errors.endTime && <p className="play-plan-form__error">{errors.endTime}</p>}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="tags" className="play-plan-form__label play-plan-form__label--required">
              タグ
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags || ''}
              onChange={(e) => handleInputChangeWithValidation('tags', e.target.value)}
              className={`play-plan-form__input ${errors.tags ? 'play-plan-form__input--error' : ''}`}
              placeholder="タグをカンマ区切りで入力"
            />
            {errors.tags && <p className="play-plan-form__error">{errors.tags}</p>}
          </div>

          <div className="play-plan-form__field">
            <label className="play-plan-form__label">おすすめ対象</label>
            <div className="play-plan-form__checkbox-grid">
              {recommendedFors.map((recommendedFor) => (
                <label key={recommendedFor.id} className="play-plan-form__checkbox-item">
                  <input
                    type="checkbox"
                    checked={formData.recommendUsers.includes(recommendedFor.id)}
                    onChange={(e) => {
                      const newIds = e.target.checked
                        ? [...formData.recommendUsers, recommendedFor.id]
                        : formData.recommendUsers.filter(id => id !== recommendedFor.id);
                      handleInputChangeWithValidation('recommendUsers', newIds);
                    }}
                    className="play-plan-form__checkbox"
                  />
                  <span className="play-plan-form__checkbox-label">{recommendedFor.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className='play-plan-planner-content'>
            <h2 className="play-plan-form__section-title">プランナーコンテンツ</h2>
            <div className="play-plan-form__field">
              <label htmlFor="plannerTitle" className="play-plan-form__label play-plan-form__label--required">
                プランナータイトル
              </label>
              <input
                type="text"
                id="plannerTitle"
                value={formData.plannerTitle || ''}
                onChange={(e) => handleInputChangeWithValidation('plannerTitle', e.target.value)}
                className={`play-plan-form__input ${errors.plannerTitle ? 'play-plan-form__input--error' : ''}`}
                placeholder="プランナーのタイトルを入力"
              />
              {errors.plannerTitle && <p className="play-plan-form__error">{errors.plannerTitle}</p>}
            </div>
            <div className="play-plan-form__field">
              <label htmlFor="plannerDescription" className="play-plan-form__label play-plan-form__label--required">
                プランナー説明
              </label>
              <textarea
                id="plannerDescription"
                value={formData.plannerDescription || ''}
                onChange={(e) => handleInputChangeWithValidation('plannerDescription', e.target.value)}
                rows={4}
                className={`play-plan-form__textarea ${errors.plannerDescription ? 'play-plan-form__input--error' : ''}`}
                placeholder="プランナーの説明を入力"
              />
              {errors.plannerDescription && <p className="play-plan-form__error">{errors.plannerDescription}</p>}
            </div>
          </div>
        </div>
      </div>

      <div className="play-plan-form__section">
        <h2 className="play-plan-form__section-title">プラン詳細</h2>
        <PlanDetailForm
          planDetails={formData.planDetails}
          spots={spots}
          onChange={handlePlanDetailsChange}
          onEndTimeChange={handlePlanEndTimeChange}
          errors={errors}
          departureTime={formData.departureTime}
          travelTimeToFirstSpot={formData.travelTimeToFirstSpot}
        />
        {errors.planDetails && <p className="play-plan-form__error">{errors.planDetails}</p>}
      </div>

      <div className="play-plan-form__actions">
        <button
          type="button"
          onClick={onCancel}
          className="play-plan-form__button play-plan-form__button--cancel"
          disabled={isSubmitting}
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="play-plan-form__button play-plan-form__button--submit"
        >
          {isSubmitting ? '処理中...' : submitButtonText}
        </button>
      </div>
    </form>
  );
}