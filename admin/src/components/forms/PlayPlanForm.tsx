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

  /** * 日時をISO形式から入力用の文字列に変換する関数
   * @param isoString - ISO形式の日時文字列
   * @returns 入力用の文字列（YYYY-MM-DDTHH:mm）
   */
  const calculatedBudget = calculateTotalBudget(formData.planDetails);

  // 手動入力値と計算値の差分
  const budgetDifference = (parseFloat(formData.totalBudget || '0') - calculatedBudget);

  const handleInputChange = (field: keyof PlayPlanFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // エラーをクリア
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: '',
      }));
    }
  };

  const handlePlanDetailsChange = (planDetails: PlanDetailFormData[]) => {
    const newCalculatedBudget = calculateTotalBudget(planDetails);

    setFormData(prev => ({
      ...prev,
      planDetails,
      totalBudget: isManualBudget ? prev.totalBudget : newCalculatedBudget.toString(),
    }));
  };

  // 最後のステップの終了時刻を受け取ってプランの終了時刻を更新
  const handlePlanEndTimeChange = (endTime: string) => {
    setFormData(prev => ({
      ...prev,
      endTime,
    }));
  };

  // 総予算の手動入力処理
  const handleTotalBudgetChange = (value: string) => {
    setIsManualBudget(true);
    handleInputChange('totalBudget', value);
  };

  // 自動計算に戻すボタンの処理
  const resetToCalculatedBudget = () => {
    setIsManualBudget(false);
    setFormData(prev => ({
      ...prev,
      totalBudget: calculatedBudget.toString(),
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.planName.trim()) {
      newErrors.planName = 'プラン名は必須です';
    }

    if (!formData.status) {
      newErrors.status = 'ステータスは必須です';
    }

    if (!formData.departure) {
      newErrors.departure = '出発地点は必須です';
    }

    if (!formData.tripType) {
      newErrors.tripType = '旅行タイプは必須です';
    }

    if (formData.planDetails.length === 0) {
      newErrors.planDetails = '少なくとも1つのステップが必要です';
    }

    if (!formData.totalBudget) {
      newErrors.totalBudget = '総予算は入力必須です';
    }

    // プラン詳細のバリデーション
    formData.planDetails.forEach((detail, index) => {
      if (!detail.stepName.trim()) {
        newErrors[`planDetails.${index}.stepName`] = 'ステップ名は必須です';
      }
    });

    // 日付の整合性チェック
    if (formData.startTime && formData.endTime) {
      if (new Date(formData.startTime) >= new Date(formData.endTime)) {
        newErrors.endTime = '終了日は開始日より後である必要があります';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="play-plan-form">
      {/* 基本情報 */}
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
              onChange={(e) => handleInputChange('planName', e.target.value)}
              className={`play-plan-form__input ${errors.planName ? 'play-plan-form__input--error' : ''
                }`}
              placeholder="プラン名を入力"
            />
            {errors.planName && (
              <p className="play-plan-form__error">{errors.planName}</p>
            )}
          </div>
          <div className="play-plan-form__field">
            <label htmlFor="catchCopy" className="play-plan-form__label">
              キャッチコピー
            </label>
            <input
              type="text"
              id="catchCopy"
              value={formData.catchCopy || ''}
              onChange={(e) => handleInputChange('catchCopy', e.target.value)}
              className="play-plan-form__input"
              placeholder="キャッチコピーを入力"
            />
          </div>
          <div className="play-plan-form__field">
            <label htmlFor="subtitle" className="play-plan-form__label">
              サブタイトル
            </label>
            <input
              type="text"
              id="subtitle"
              value={formData.subtitle || ''}
              onChange={(e) => handleInputChange('subtitle', e.target.value)}
              className="play-plan-form__input"
              placeholder="サブタイトルを入力"
            />
          </div>
          <div className="play-plan-form__field">
            <label htmlFor="leadText" className="play-plan-form__label">
              リードテキスト
            </label>
            <textarea
              id="leadText"
              rows={4}
              value={formData.leadText || ''}
              onChange={(e) => handleInputChange('leadText', e.target.value)}
              className="play-plan-form__input"
              placeholder="リードテキストを入力"
            />
          </div>
          <div className="play-plan-form__field">
            <label htmlFor="districts" className="play-plan-form__label">
              エリア選択
            </label>
            <select
              id="location"
              value={formData.location || ''}
              onChange={(e) => handleInputChange('location', e.target.value)}
              className="play-plan-form__select"
            >
              <option value="">選択してください</option>
              {districts?.map((district) => (
                <option key={district.id} value={district.districtName}>
                  {district.districtName}
                </option>
              ))}
            </select>
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="description" className="play-plan-form__label">
              プラン説明
            </label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={4}
              className="play-plan-form__textarea"
              placeholder="プランの説明を入力"
            />
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="status" className="play-plan-form__label play-plan-form__label--required">
              ステータス
            </label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className={`play-plan-form__select ${errors.status ? 'play-plan-form__select--error' : ''
                }`}
            >
              <option value="DRAFT">下書き</option>
              <option value="PUBLISHED">公開</option>
            </select>
            {errors.status && (
              <p className="play-plan-form__error">{errors.status}</p>
            )}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="tripType" className="play-plan-form__label play-plan-form__label--required">
              旅行タイプ
            </label>
            <select
              id="tripType"
              value={formData.tripType}
              onChange={(e) => handleInputChange('tripType', e.target.value)}
              className={`play-plan-form__select ${errors.tripType ? 'play-plan-form__select--error' : ''
                }`}
            >
              <option value="DAY_TRIP">日帰り</option>
              <option value="OVERNIGHT">泊まり</option>
            </select>
            {errors.tripType && (
              <p className="play-plan-form__error">{errors.tripType}</p>
            )}
          </div>
          <div className="play-plan-form__field">
            <label htmlFor="departure" className="play-plan-form__label">
              集合場所
            </label>
            <input
              type="text"
              id="departure"
              value={formData.departure || ''}
              onChange={(e) => handleInputChange('departure', e.target.value)}
              className="play-plan-form__input"
              placeholder="集合場所を入力"
            />
            {errors.departure && (
              <p className="play-plan-form__error">{errors.departure}</p>
            )}
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="departureTime" className="play-plan-form__label">
              集合時間
            </label>
            <input
              type="time"
              id="departureTime"
              value={formData.departureTime || ''}
              onChange={(e) => handleInputChange('departureTime', e.target.value)}
              className="play-plan-form__input"
            />
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="travelMethodToFirstSpot" className="play-plan-form__label">
              最初の目的地までの移動手段
            </label>
            <select
              id="travelMethodToFirstSpot"
              value={formData.travelMethodToFirstSpot || ''}
              onChange={(e) => handleInputChange('travelMethodToFirstSpot', e.target.value)}
              className="play-plan-form__select"
            >
              <option value="">選択してください</option>
              <option value="徒歩">徒歩</option>
              <option value="電車">電車</option>
              <option value="車">車</option>
              <option value="自転車">自転車</option>
              <option value="その他">その他</option>
            </select>
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="travelTimeToFirstSpot" className="play-plan-form__label">
              最初の目的地までの移動時間（分）
            </label>
            <input
              type="number"
              id="travelTimeToFirstSpot"
              value={formData.travelTimeToFirstSpot || ''}
              onChange={(e) => handleInputChange('travelTimeToFirstSpot', e.target.value)}
              className="play-plan-form__input"
              placeholder="移動時間を入力"
              min="0"
            />
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
            {errors.totalBudget && (
              <p className="play-plan-form__error">{errors.totalBudget}</p>
            )}
          </div>

          <div className="play-plan-form__field play-plan-form__field--full-width">
            <label className="play-plan-form__label">
              画像
            </label>
            <ImageUpload
              onImagesChange={(base64Images) => {
                setFormData(prev => ({
                  ...prev,
                  newImages: base64Images,
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

          {/* 画像プロパティ編集 */}
          {formData.imageProperties && formData.imageProperties.length > 0 && (
            <div className="play-plan-form__field play-plan-form__field--full-width">
              <ImagePropertiesEditor
                imageProperties={formData.imageProperties}
                onChange={(properties) => {
                  setFormData(prev => ({
                    ...prev,
                    imageProperties: properties,
                  }));
                }}
                maxSelected={3}
              />
            </div>
          )}

          <div className="play-plan-form__field">
            <label htmlFor="startTime" className="play-plan-form__label">
              開始時刻
            </label>
            <input
              type="time"
              id="startTime"
              value={formData.startTime || ''}
              onChange={(e) => handleInputChange('startTime', e.target.value)}
              className="play-plan-form__input"
            />
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="endTime" className="play-plan-form__label">
              終了時刻
            </label>
            <input
              type="time"
              id="endTime"
              value={formData.endTime || ''}
              onChange={(e) => handleInputChange('endTime', e.target.value)}
              className={`play-plan-form__input ${errors.endTime ? 'play-plan-form__input--error' : ''
                }`}
            />
            {errors.endTime && (
              <p className="play-plan-form__error">{errors.endTime}</p>
            )}
          </div>
        </div>

        <div className="play-plan-form__field">
          <label htmlFor="tags" className="play-plan-form__label">
            タグ
          </label>
          <input
            type="text"
            id="tags"
            value={formData.tags || ''}
            onChange={(e) => handleInputChange('tags', e.target.value)}
            className="play-plan-form__input"
            placeholder="タグをカンマ区切りで入力"
          />
        </div>

        <div className="play-plan-form__field">
          <label className="play-plan-form__label">
            おすすめ対象
          </label>
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
                    handleInputChange('recommendUsers', newIds);
                  }}
                  className="play-plan-form__checkbox"
                />
                <span className="play-plan-form__checkbox-label">{recommendedFor.name}</span>
              </label>
            ))}
          </div>
        </div>

        {/* プランナーコンテンツ */}
        <div className='play-plan-planner-content'>
          <h2 className="play-plan-form__section-title">プランナーコンテンツ</h2>
          <div className="play-plan-form__field">
            <label htmlFor="plannerTitle" className="play-plan-form__label">
              プランナータイトル
            </label>
            <input
              type="text"
              id="plannerTitle"
              value={formData.plannerTitle || ''}
              onChange={(e) => handleInputChange('plannerTitle', e.target.value)}
              className="play-plan-form__input"
              placeholder="プランナーのタイトルを入力"
            />
            {errors.plannerDescription && (
              <p className="play-plan-form__error">{errors.plannerDescription}</p>
            )}
          </div>
          <div className="play-plan-form__field">
            <label htmlFor="plannerDescription" className="play-plan-form__label">
              プランナー説明
            </label>
            <textarea
              id="plannerDescription"
              value={formData.plannerDescription || ''}
              onChange={(e) => handleInputChange('plannerDescription', e.target.value)}
              rows={4}
              className="play-plan-form__textarea"
              placeholder="プランナーの説明を入力"
            />
          </div>
          {errors.plannerTitle && (
            <p className="play-plan-form__error">{errors.plannerTitle}</p>
          )}
        </div>
      </div>

      {/* プラン詳細 */}
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

        {errors.planDetails && (
          <p className="play-plan-form__error">{errors.planDetails}</p>
        )}
      </div>

      {/* 送信ボタン */}
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


// "startDatetime": "2025-08-01T15:40:00.000Z",
// "endDatetime": "2025-08-02T17:40:00.000Z",
// "startDatetime": "2025-07-31T21:40:00.000Z",
// "endDatetime": "2025-08-01T23:40:00.000Z",
