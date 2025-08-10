'use client';

import { useState, useEffect } from 'react';
import PlanDetailForm from './PlanDetailForm';
import ImageUpload from './ImageUpload';
import '@/styles/play-plans.css';

interface Spot {
  id: string;
  spotName: string;
  priceRangeAverage?: number | null;
}

interface RecommendedFor {
  id: string;
  name: string;
}

interface TravelDetail {
  id?: string;
  sequenceNumber: number;
  travelMethod: string;
  travelTime?: string;
  notes?: string;
}

interface PlanDetail {
  id?: string;
  stepNumber: number;
  stepName: string;
  stepDescription?: string;
  spotId?: string;
  comment?: string;
  startDatetime?: string;
  endDatetime?: string;
  budget?: string;
  notes?: string;
  travelDetails: TravelDetail[];
}

interface ExistingImage {
  id: string;
  url: string;
}

interface PlayPlanFormData {
  planName: string;
  description?: string;
  status: string;
  tripType: string;
  totalBudget?: string;
  location?: string;
  startDatetime?: string;
  endDatetime?: string;
  imageUrl?: string;
  imageUrls?: ExistingImage[];
  newImages?: string[];
  deleteImageIds?: string[];
  tags?: string;
  recommendUsers: string[];
  planDetails: PlanDetail[];
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
  const calculateTotalBudget = (planDetails: PlanDetail[]): number => {
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

  const handlePlanDetailsChange = (planDetails: PlanDetail[]) => {
    const newCalculatedBudget = calculateTotalBudget(planDetails);

    setFormData(prev => ({
      ...prev,
      planDetails,
      totalBudget: isManualBudget ? prev.totalBudget : newCalculatedBudget.toString(),
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

    // 日時の整合性チェック
    if (formData.startDatetime && formData.endDatetime) {
      if (new Date(formData.startDatetime) >= new Date(formData.endDatetime)) {
        newErrors.endDatetime = '終了日時は開始日時より後である必要があります';
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

          <div className="play-plan-form__field">
            <label htmlFor="startDatetime" className="play-plan-form__label">
              開始日時
            </label>
            <input
              type="datetime-local"
              id="startDatetime"
              value={formData.startDatetime || ''}
              onChange={(e) => handleInputChange('startDatetime', e.target.value)}
              className="play-plan-form__input"
            />
          </div>

          <div className="play-plan-form__field">
            <label htmlFor="endDatetime" className="play-plan-form__label">
              終了日時
            </label>
            <input
              type="datetime-local"
              id="endDatetime"
              value={formData.endDatetime || ''}
              onChange={(e) => handleInputChange('endDatetime', e.target.value)}
              className={`play-plan-form__input ${errors.endDatetime ? 'play-plan-form__input--error' : ''
                }`}
            />
            {errors.endDatetime && (
              <p className="play-plan-form__error">{errors.endDatetime}</p>
            )}
          </div>
        </div>

        <div className="play-plan-form__field">
          <label htmlFor="description" className="play-plan-form__label">
            説明
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
      </div>

      {/* プラン詳細 */}
      <div className="play-plan-form__section">
        <h2 className="play-plan-form__section-title">プラン詳細</h2>

        <PlanDetailForm
          planDetails={formData.planDetails}
          spots={spots}
          onChange={handlePlanDetailsChange}
          errors={errors}
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
