'use client';

import { useState } from 'react';
import TravelDetailForm from './TravelDetailForm';
import '@/styles/play-plans.css';
import { Spot, TravelDetail, PlanDetail } from '@/__generated__/graphql';

interface PlanDetailFormProps {
  planDetails: PlanDetail[];
  spots: Spot[];
  onChange: (planDetails: PlanDetail[]) => void;
  onEndTimeChange?: (endTime: string) => void;
  errors: Record<string, string>;
  departureTime?: string;
  travelTimeToFirstSpot?: string;
}


// 時刻文字列を分に変換する関数
const timeToMinutes = (timeString: string): number => {
  if (!timeString) return 0;
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
};

// 分を時刻文字列に変換する関数
const minutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
};

// 開始時刻と滞在時間から終了時刻を計算
const calculateEndTime = (startTime: string, durationMinutes: number): string => {
  if (!startTime || !durationMinutes) return '';
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = startMinutes + durationMinutes;
  return minutesToTime(endMinutes);
};

// 開始時刻と終了時刻から滞在時間を計算
const calculateDuration = (startTime: string, endTime: string): number => {
  if (!startTime || !endTime) return 0;
  const startMinutes = timeToMinutes(startTime);
  const endMinutes = timeToMinutes(endTime);
  return Math.max(0, endMinutes - startMinutes);
};

// 移動詳細の移動時間の合計を計算
const calculateTotalTravelTime = (travelDetails: TravelDetail[]): number => {
  return travelDetails.reduce((total, detail) => {
    const travelTime = parseInt(detail.travelTime || '0', 10);
    return total + (isNaN(travelTime) ? 0 : travelTime);
  }, 0);
};

export default function PlanDetailForm({
  planDetails,
  spots,
  onChange,
  onEndTimeChange,
  errors,
  departureTime,
  travelTimeToFirstSpot,
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
      plannerTitle: '',
      plannerDescription: '',
      startTime: '',
      endTime: '',
      durationMinutes: 60,
      budget: '',
      notes: '',
      travelDetails: [],
    };

    const newPlanDetails = [...planDetails, newStep];

    // 新しいステップの時刻を再計算
    const recalculatedPlanDetails = recalculateAllStepTimes(newPlanDetails);
    onChange(recalculatedPlanDetails);

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

  // 集合時間と移動時間から最初のステップの開始時間を計算
  const calculateFirstStepStartTime = (): string => {
    if (!departureTime || !travelTimeToFirstSpot) return '';
    const departureMinutes = timeToMinutes(departureTime);
    const travelMinutes = parseInt(travelTimeToFirstSpot, 10) || 0;
    return minutesToTime(departureMinutes + travelMinutes);
  };

  // 全ステップの時刻を再計算する関数
  const recalculateAllStepTimes = (planDetails: PlanDetail[]): PlanDetail[] => {
    const updatedPlanDetails = [...planDetails];

    // 最初のステップの開始時間を集合時間と移動時間から計算
    if (updatedPlanDetails.length > 0) {
      const firstStepStartTime = calculateFirstStepStartTime();
      if (firstStepStartTime) {
        updatedPlanDetails[0] = {
          ...updatedPlanDetails[0],
          startTime: firstStepStartTime,
          endTime: calculateEndTime(firstStepStartTime, updatedPlanDetails[0].durationMinutes || 60),
        };
      }
    }

    // 2番目以降のステップの時刻を計算
    for (let i = 1; i < updatedPlanDetails.length; i++) {
      const previousStep = updatedPlanDetails[i - 1];
      const currentStep = updatedPlanDetails[i];

      // 前のステップの終了時刻と移動時間から現在のステップの開始時刻を計算
      if (previousStep.endTime) {
        const previousEndMinutes = timeToMinutes(previousStep.endTime);
        const travelTimeMinutes = calculateTotalTravelTime(previousStep.travelDetails);
        const newStartMinutes = previousEndMinutes + travelTimeMinutes;
        const newStartTime = minutesToTime(newStartMinutes);

        updatedPlanDetails[i] = {
          ...currentStep,
          startTime: newStartTime,
          endTime: calculateEndTime(newStartTime, currentStep.durationMinutes || 60),
        };
      }
    }

    return updatedPlanDetails;
  };

  const updateStep = (index: number, field: keyof PlanDetail, value: string | number | TravelDetail[]) => {
    const newPlanDetails = [...planDetails];
    newPlanDetails[index] = {
      ...newPlanDetails[index],
      [field]: value,
    };
    onChange(newPlanDetails);
  };

  // 最後のステップの終了時刻を親コンポーネントに通知
  const notifyEndTimeChange = (updatedPlanDetails: PlanDetail[]) => {
    if (onEndTimeChange && updatedPlanDetails.length > 0) {
      const lastStep = updatedPlanDetails[updatedPlanDetails.length - 1];
      if (lastStep.endTime) {
        onEndTimeChange(lastStep.endTime);
      }
    }
  };

  // 開始時刻変更時の処理（終了時刻を自動計算し、後続ステップも更新）
  const handleStartTimeChange = (index: number, startTime: string) => {
    const newPlanDetails = [...planDetails];
    const currentDetail = newPlanDetails[index];
    const durationMinutes = currentDetail.durationMinutes || 60;

    newPlanDetails[index] = {
      ...currentDetail,
      startTime,
      endTime: calculateEndTime(startTime, durationMinutes),
    };

    // 後続ステップの時刻を再計算
    const recalculatedPlanDetails = recalculateAllStepTimes(newPlanDetails);
    onChange(recalculatedPlanDetails);

    // 最後のステップの終了時刻を親に通知
    notifyEndTimeChange(recalculatedPlanDetails);
  };

  // 滞在時間変更時の処理（終了時刻を自動計算し、後続ステップも更新）
  const handleDurationChange = (index: number, durationMinutes: number) => {
    const newPlanDetails = [...planDetails];
    const currentDetail = newPlanDetails[index];
    const startTime = currentDetail.startTime || '';

    newPlanDetails[index] = {
      ...currentDetail,
      durationMinutes,
      endTime: calculateEndTime(startTime, durationMinutes),
    };

    // 後続ステップの時刻を再計算
    const recalculatedPlanDetails = recalculateAllStepTimes(newPlanDetails);
    onChange(recalculatedPlanDetails);

    // 最後のステップの終了時刻を親に通知
    notifyEndTimeChange(recalculatedPlanDetails);
  };

  // 終了時刻変更時の処理（滞在時間を自動計算し、後続ステップも更新）
  const handleEndTimeChange = (index: number, endTime: string) => {
    const newPlanDetails = [...planDetails];
    const currentDetail = newPlanDetails[index];
    const startTime = currentDetail.startTime || '';

    newPlanDetails[index] = {
      ...currentDetail,
      endTime,
      durationMinutes: calculateDuration(startTime, endTime),
    };

    // 後続ステップの時刻を再計算
    const recalculatedPlanDetails = recalculateAllStepTimes(newPlanDetails);
    onChange(recalculatedPlanDetails);

    // 最後のステップの終了時刻を親に通知
    notifyEndTimeChange(recalculatedPlanDetails);
  };

  // 移動詳細更新時の処理（後続ステップの時刻も更新）
  const updateTravelDetails = (stepIndex: number, travelDetails: TravelDetail[]) => {
    const newPlanDetails = [...planDetails];
    newPlanDetails[stepIndex] = {
      ...newPlanDetails[stepIndex],
      travelDetails,
    };

    // 後続ステップの時刻を再計算
    const recalculatedPlanDetails = recalculateAllStepTimes(newPlanDetails);
    onChange(recalculatedPlanDetails);

    // 最後のステップの終了時刻を親に通知
    notifyEndTimeChange(recalculatedPlanDetails);
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
                    開始時刻
                    {index > 0 && <span className="play-plan-form__label-note">（自動計算）</span>}
                  </label>
                  <input
                    type="time"
                    value={detail.startTime || ''}
                    onChange={(e) => handleStartTimeChange(index, e.target.value)}
                    className="play-plan-form__input"
                    placeholder="例: 10:00"
                    readOnly={index > 0}
                    disabled={index > 0}
                  />
                </div>

                <div className="play-plan-form__field">
                  <label className="play-plan-form__label">
                    滞在時間（分）
                  </label>
                  <input
                    type="number"
                    value={detail.durationMinutes}
                    onChange={(e) => handleDurationChange(index, Number(e.target.value))}
                    className="play-plan-form__input"
                    placeholder="例: 60"
                    min="1"
                  />
                </div>

                <div className="play-plan-form__field">
                  <label className="play-plan-form__label">
                    終了時刻
                  </label>
                  <input
                    type="time"
                    value={detail.endTime || ''}
                    onChange={(e) => handleEndTimeChange(index, e.target.value)}
                    className="play-plan-form__input"
                    placeholder="例: 12:00"
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
                  プランナータイトル
                </label>
                <input
                  type="text"
                  value={detail.plannerTitle || ''}
                  onChange={(e) => updateStep(index, 'plannerTitle', e.target.value)}
                  className="play-plan-form__input"
                  placeholder="プランナーのタイトルを入力"
                />
              </div>
              <div className="play-plan-form__field">
                <label className="play-plan-form__label">
                  プランナーコメント
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
