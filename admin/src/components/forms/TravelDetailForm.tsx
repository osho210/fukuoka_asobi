'use client';

import '@/styles/play-plans.css';

type TravelDetailFormData = {
  id?: string;
  sequenceNumber: number;
  travelMethod?: string;
  travelTime?: string;
  notes?: string;
};

interface TravelDetailFormProps {
  travelDetails: TravelDetailFormData[];
  onChange: (travelDetails: TravelDetailFormData[]) => void;
  stepIndex: number;
  errors: Record<string, string>;
}

const TRAVEL_METHODS = [
  { value: '徒歩', label: '徒歩' },
  { value: '電車', label: '電車' },
  { value: '車', label: '車' },
  { value: '自転車', label: '自転車' },
  { value: 'その他', label: 'その他' },
];

export default function TravelDetailForm({
  travelDetails,
  onChange,
  stepIndex,
  errors,
}: TravelDetailFormProps) {
  const addTravelDetail = () => {
    const newTravelDetail: TravelDetailFormData = {
      sequenceNumber: travelDetails.length + 1,
      travelMethod: '徒歩',
      travelTime: '',
      notes: '',
    };

    onChange([...travelDetails, newTravelDetail]);
  };

  const removeTravelDetail = (index: number) => {
    if (confirm('この移動詳細を削除してもよろしいですか？')) {
      const newTravelDetails = travelDetails
        .filter((_, i) => i !== index)
        .map((detail, i) => ({
          ...detail,
          sequenceNumber: i + 1,
        }));

      onChange(newTravelDetails);
    }
  };

  const updateTravelDetail = (index: number, field: keyof TravelDetailFormData, value: string | number) => {
    const newTravelDetails = [...travelDetails];
    newTravelDetails[index] = {
      ...newTravelDetails[index],
      [field]: value,
    };
    onChange(newTravelDetails);
  };

  const moveTravelDetail = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;

    if (newIndex < 0 || newIndex >= travelDetails.length) {
      return;
    }

    const newTravelDetails = [...travelDetails];
    [newTravelDetails[index], newTravelDetails[newIndex]] = [newTravelDetails[newIndex], newTravelDetails[index]];

    // シーケンス番号を更新
    newTravelDetails.forEach((detail, i) => {
      detail.sequenceNumber = i + 1;
    });

    onChange(newTravelDetails);
  };

  if (travelDetails.length === 0) {
    return (
      <div className="travel-detail-form__empty">
        <p className="travel-detail-form__empty-text">移動詳細が登録されていません</p>
        <button
          type="button"
          onClick={addTravelDetail}
          className="travel-detail-form__empty-button"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          移動詳細を追加
        </button>
      </div>
    );
  }

  return (
    <div className="travel-detail-form">
      {travelDetails.map((detail, index) => (
        <div key={index} className="travel-detail-form__item">
          <div className="travel-detail-form__item-header">
            <span className="travel-detail-form__item-title">
              移動 {detail.sequenceNumber}
            </span>
            <div className="travel-detail-form__item-actions">
              <button
                type="button"
                onClick={() => moveTravelDetail(index, 'up')}
                disabled={index === 0}
                className="travel-detail-form__item-action"
                title="上に移動"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => moveTravelDetail(index, 'down')}
                disabled={index === travelDetails.length - 1}
                className="travel-detail-form__item-action"
                title="下に移動"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => removeTravelDetail(index)}
                className="travel-detail-form__item-action travel-detail-form__item-action--delete"
                title="削除"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div className="travel-detail-form__item-grid">
            <div className="travel-detail-form__field">
              <label className="travel-detail-form__label travel-detail-form__label--required">
                移動方法
              </label>
              <select
                value={detail.travelMethod}
                onChange={(e) => updateTravelDetail(index, 'travelMethod', e.target.value)}
                className={`travel-detail-form__select ${
                  errors[`planDetails[${stepIndex}].travelDetails[${index}].travelMethod`]
                    ? 'travel-detail-form__select--error'
                    : ''
                }`}
              >
                {TRAVEL_METHODS.map((method) => (
                  <option key={method.value} value={method.value}>
                    {method.label}
                  </option>
                ))}
              </select>
              {errors[`planDetails[${stepIndex}].travelDetails[${index}].travelMethod`] && (
                <p className="travel-detail-form__error">
                  {errors[`planDetails[${stepIndex}].travelDetails[${index}].travelMethod`]}
                </p>
              )}
            </div>

            <div className="travel-detail-form__field">
              <label className="travel-detail-form__label">
                移動時間（分）
              </label>
              <input
                type="number"
                value={detail.travelTime || ''}
                onChange={(e) => updateTravelDetail(index, 'travelTime', e.target.value)}
                className="travel-detail-form__input"
                placeholder="時間"
                min="0"
              />
            </div>

            <div className="travel-detail-form__field">
              <label className="travel-detail-form__label">
                メモ
              </label>
              <input
                type="text"
                value={detail.notes || ''}
                onChange={(e) => updateTravelDetail(index, 'notes', e.target.value)}
                className="travel-detail-form__input"
                placeholder="メモを入力"
              />
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addTravelDetail}
        className="travel-detail-form__add-button"
      >
        <div className="travel-detail-form__add-button-content">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>移動詳細を追加</span>
        </div>
      </button>
    </div>
  );
}
