'use client';

import { useState } from 'react';
import TravelDetailForm from './TravelDetailForm';
import '@/styles/play-plans.css';

interface Spot {
  id: string;
  spotName: string;
  priceRangeAverage?: number | null;
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

interface PlanDetailFormProps {
  planDetails: PlanDetail[];
  spots: Spot[];
  onChange: (planDetails: PlanDetail[]) => void;
  errors: Record<string, string>;
}

const formatDatetimeForInput = (datetime?: string): string => {
  if (!datetime) return '';
  return new Date(datetime).toISOString().slice(0, 16);
};

export default function PlanDetailForm({
  planDetails,
  spots,
  onChange,
  errors,
}: PlanDetailFormProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([0]));

  const toggleStep = (index: number) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSteps(newExpanded);
  };

  const addStep = () => {
    const newStep: PlanDetail = {
      stepNumber: planDetails.length + 1,
      stepName: '',
      stepDescription: '',
      spotId: '',
      comment: '',
      startDatetime: '',
      endDatetime: '',
      budget: '',
      notes: '',
      travelDetails: [],
    };

    const newPlanDetails = [...planDetails, newStep];
    onChange(newPlanDetails);

    // 新しいステップを展開
    setExpandedSteps(prev => new Set([...prev, planDetails.length]));
  };

  const removeStep = (index: number) => {
    if (planDetails.length <= 1) {
      alert('少なくとも1つのステップが必要です');
      return;
    }

    if (confirm('このステップを削除してもよろしいですか？')) {
      const newPlanDetails = planDetails
        .filter((_, i) => i !== index)
        .map((detail, i) => ({
          ...detail,
          stepNumber: i + 1,
        }));

      onChange(newPlanDetails);

      // 展開状態を更新
      const newExpanded = new Set<number>();
      expandedSteps.forEach(stepIndex => {
        if (stepIndex < index) {
          newExpanded.add(stepIndex);
        } else if (stepIndex > index) {
          newExpanded.add(stepIndex - 1);
        }
      });
      setExpandedSteps(newExpanded);
    }
  };

  const moveStep = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= planDetails.length) {
      return;
    }

    const newPlanDetails = [...planDetails];
    [newPlanDetails[index], newPlanDetails[newIndex]] = [newPlanDetails[newIndex], newPlanDetails[index]];

    // ステップ番号を更新
    newPlanDetails.forEach((detail, i) => {
      detail.stepNumber = i + 1;
    });

    onChange(newPlanDetails);

    // 展開状態を更新
    const newExpanded = new Set<number>();
    expandedSteps.forEach(stepIndex => {
      if (stepIndex === index) {
        newExpanded.add(newIndex);
      } else if (stepIndex === newIndex) {
        newExpanded.add(index);
      } else {
        newExpanded.add(stepIndex);
      }
    });
    setExpandedSteps(newExpanded);
  };

  const updateStep = (index: number, field: keyof PlanDetail, value: string | TravelDetail[]) => {
    const newPlanDetails = [...planDetails];
    newPlanDetails[index] = {
      ...newPlanDetails[index],
      [field]: value,
    };
    onChange(newPlanDetails);
  };

  const updateTravelDetails = (stepIndex: number, travelDetails: TravelDetail[]) => {
    updateStep(stepIndex, 'travelDetails', travelDetails);
  };

  const handleSpotChange = (index: number, spotId: string) => {
    const selectedSpot = spots.find(spot => spot.id === spotId);
    const budget = selectedSpot?.priceRangeAverage != null
      ? String(selectedSpot.priceRangeAverage)
      : '';

    // 複数のフィールドを一度に更新
    const newPlanDetails = [...planDetails];
    newPlanDetails[index] = {
      ...newPlanDetails[index],
      spotId,
      budget,
    };
    onChange(newPlanDetails);
  };

  return (
    <div className="plan-detail-form">
      {planDetails.map((detail, index) => (
        <div key={index} className="plan-detail-form__step">
          {/* ステップヘッダー */}
          <div className="plan-detail-form__step-header">
            <button
              type="button"
              onClick={() => toggleStep(index)}
              className="plan-detail-form__step-toggle"
            >
              <span className="plan-detail-form__step-number">
                ステップ {detail.stepNumber}
              </span>
              {detail.stepName && (
                <span className="plan-detail-form__step-name">- {detail.stepName}</span>
              )}
              <svg
                className={`plan-detail-form__step-icon ${expandedSteps.has(index) ? 'plan-detail-form__step-icon--expanded' : ''
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <div className="plan-detail-form__step-actions">
              <button
                type="button"
                onClick={() => moveStep(index, 'up')}
                disabled={index === 0}
                className="plan-detail-form__step-action"
                title="上に移動"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => moveStep(index, 'down')}
                disabled={index === planDetails.length - 1}
                className="plan-detail-form__step-action"
                title="下に移動"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => removeStep(index)}
                className="plan-detail-form__step-action plan-detail-form__step-action--delete"
                title="削除"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* ステップ詳細 */}
          {expandedSteps.has(index) && (
            <div className="plan-detail-form__step-content">
              <div className="play-plan-form__grid">
                <div className="play-plan-form__field">
                  <label className="play-plan-form__label play-plan-form__label--required">
                    ステップ名
                  </label>
                  <input
                    type="text"
                    value={detail.stepName}
                    onChange={(e) => updateStep(index, 'stepName', e.target.value)}
                    className={`play-plan-form__input ${errors[`planDetails.${index}.stepName`] ? 'play-plan-form__input--error' : ''
                      }`}
                    placeholder="ステップ名を入力"
                  />
                  {errors[`planDetails.${index}.stepName`] && (
                    <p className="play-plan-form__error">{errors[`planDetails.${index}.stepName`]}</p>
                  )}
                </div>

                <div className="play-plan-form__field">
                  <label className="play-plan-form__label">
                    スポット
                  </label>
                  <select
                    value={detail.spotId || ''}
                    onChange={(e) => handleSpotChange(index, e.target.value)}
                    className="play-plan-form__select"
                  >
                    <option value="">スポットを選択</option>
                    {spots.map((spot) => (
                      <option key={spot.id} value={spot.id}>
                        {spot.spotName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="play-plan-form__field">
                  <label className="play-plan-form__label">
                    開始日時
                  </label>
                  <input
                    type="datetime-local"
                    value={formatDatetimeForInput(detail.startDatetime) || ''}
                    onChange={(e) => updateStep(index, 'startDatetime', e.target.value)}
                    className="play-plan-form__input"
                  />
                </div>

                <div className="play-plan-form__field">
                  <label className="play-plan-form__label">
                    終了日時
                  </label>
                  <input
                    type="datetime-local"
                    value={formatDatetimeForInput(detail.endDatetime) || ''}
                    onChange={(e) => updateStep(index, 'endDatetime', e.target.value)}
                    className="play-plan-form__input"
                  />
                </div>

                <div className="play-plan-form__field">
                  <label className="play-plan-form__label">
                    予算
                  </label>
                  <input
                    type="number"
                    value={detail.budget || ''}
                    onChange={(e) => updateStep(index, 'budget', e.target.value)}
                    className="play-plan-form__input"
                    placeholder="予算を入力"
                    min="0"
                  />
                </div>
              </div>

              <div className="play-plan-form__field">
                <label className="play-plan-form__label">
                  ステップ説明
                </label>
                <textarea
                  value={detail.stepDescription || ''}
                  onChange={(e) => updateStep(index, 'stepDescription', e.target.value)}
                  rows={3}
                  className="play-plan-form__textarea"
                  placeholder="ステップの説明を入力"
                />
              </div>

              <div className="play-plan-form__field">
                <label className="play-plan-form__label">
                  コメント
                </label>
                <textarea
                  value={detail.comment || ''}
                  onChange={(e) => updateStep(index, 'comment', e.target.value)}
                  rows={2}
                  className="play-plan-form__textarea"
                  placeholder="コメントを入力"
                />
              </div>

              <div className="play-plan-form__field">
                <label className="play-plan-form__label">
                  備考
                </label>
                <textarea
                  value={detail.notes || ''}
                  onChange={(e) => updateStep(index, 'notes', e.target.value)}
                  rows={2}
                  className="play-plan-form__textarea"
                  placeholder="備考を入力"
                />
              </div>

              {/* 移動詳細 */}
              <div className="plan-detail-form__travel-section">
                <h4 className="plan-detail-form__travel-title">移動詳細</h4>
                <TravelDetailForm
                  travelDetails={detail.travelDetails}
                  onChange={(travelDetails: TravelDetail[]) => updateTravelDetails(index, travelDetails)}
                  stepIndex={index}
                  errors={errors}
                />
              </div>
            </div>
          )}
        </div>
      ))}

      {/* ステップ追加ボタン */}
      <button
        type="button"
        onClick={addStep}
        className="plan-detail-form__add-button"
      >
        <div className="plan-detail-form__add-button-content">
          <svg className="detail-form__add-button-content-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>ステップを追加</span>
        </div>
      </button>
    </div>
  );
}
