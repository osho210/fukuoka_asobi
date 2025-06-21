import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

interface Option {
  value: number;
  label: string;
}

interface MultiSelectProps {
  id: string;
  name?: string; // 使用していないのでオプショナルに変更
  label: string;
  modelName: string;
  labelField: string;
  selectedValues: number[];
  onChange: (values: number[]) => void;
  required?: boolean;
  error?: string;
  fullWidth?: boolean;
}

// 各モデルのクエリを動的に生成
const generateQuery = (modelName: string, labelField: string) => {
  // モデル名をGraphQLクエリに合わせて調整
  // 例: Hashtag -> hashtags, SpotAmbiance -> spotAmbiances
  const queryName = modelName.charAt(0).toLowerCase() + modelName.slice(1) + 's';

  return gql`
    query Get${modelName}Options {
      ${queryName} {
        id
        ${labelField}
      }
    }
  `;
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  // name, // 使用していないのでコメントアウト
  label,
  modelName,
  labelField,
  selectedValues = [],
  onChange,
  required = false,
  error,
  fullWidth = false,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [localSelectedValues, setLocalSelectedValues] = useState<number[]>(selectedValues || []);
  // モデル名からクエリを生成
  const query = generateQuery(modelName, labelField);

  // データ取得
  const { data, loading } = useQuery(query);

  // selectedValuesが変更されたらlocalSelectedValuesを更新
  useEffect(() => {
    setLocalSelectedValues(selectedValues || []);
  }, [selectedValues]);

  // データが取得できたらオプションを設定
  useEffect(() => {
    // モデル名をGraphQLクエリに合わせて調整
    const queryName = modelName.charAt(0).toLowerCase() + modelName.slice(1) + 's';

    if (data && data[queryName]) {
      const fetchedOptions = data[queryName].map((item: { id: string;[key: string]: string | number | boolean }) => ({
        value: Number(item.id),
        label: item[labelField] as string,
      }));
      setOptions(fetchedOptions);
    }
  }, [data, modelName, labelField]);

  // 選択状態の切り替え
  const handleToggleOption = (value: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let newValues: number[];

    if (localSelectedValues.includes(value)) {
      newValues = localSelectedValues.filter(v => v !== value);
    } else {
      newValues = [...localSelectedValues, value];
    }

    setLocalSelectedValues(newValues);
    onChange(newValues);
  };

  // 選択されたオプションのラベルを取得
  const getSelectedLabels = () => {
    return localSelectedValues
      .map(value => {
        const option = options.find(opt => opt.value === value);
        return option ? option.label : '';
      })
      .filter(Boolean)
      .join(', ');
  };

  // すべての選択をクリア
  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalSelectedValues([]);
    onChange([]);
  };

  // ドロップダウンの開閉
  const handleToggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`admin-form-field ${fullWidth ? 'admin-w-full' : ''}`}>
      <label htmlFor={id} className="admin-form-label">
        {label}
        {required && <span className="admin-text-red-500">*</span>}
      </label>

      <div className="admin-multiselect-container">
        <div
          className={`admin-multiselect-trigger ${isOpen ? 'admin-multiselect-trigger-active' : ''} ${error ? 'admin-form-control-error' : ''
            }`}
          onClick={handleToggleDropdown}
        >
          <div className="admin-multiselect-value">
            {localSelectedValues.length > 0 ? (
              localSelectedValues.length <= 3 ? (
                getSelectedLabels()
              ) : (
                <span className="admin-font-medium">{localSelectedValues.length}項目選択中</span>
              )
            ) : (
              <span className="admin-multiselect-placeholder">選択してください</span>
            )}
          </div>
          <svg
            className={`admin-h-5 admin-w-5 admin-transition-transform ${isOpen ? 'admin-rotate-180' : ''
              }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>

        {isOpen && (
          <div className="admin-multiselect-dropdown">
            {loading ? (
              <div className="admin-multiselect-loading">
                <div className="admin-multiselect-spinner"></div>
                読み込み中...
              </div>
            ) : options.length === 0 ? (
              <div className="admin-multiselect-empty">オプションがありません</div>
            ) : (
              <>
                <div className="admin-multiselect-header">
                  <span className="admin-text-sm admin-font-medium">
                    {localSelectedValues.length}項目選択中
                  </span>
                  {localSelectedValues.length > 0 && (
                    <button
                      type="button"
                      className="admin-multiselect-clear"
                      onClick={handleClearAll}
                    >
                      すべてクリア
                    </button>
                  )}
                </div>
                <div className="admin-multiselect-options">
                  {options.map(option => {
                    const isSelected = localSelectedValues.includes(option.value);
                    return (
                      <div
                        key={option.value}
                        className={`admin-multiselect-option ${isSelected ? 'admin-multiselect-option-selected' : ''
                          }`}
                        onClick={(e) => handleToggleOption(option.value, e)}
                      >
                        <div className="admin-multiselect-checkbox">
                          {isSelected && (
                            <svg className="admin-multiselect-checkbox-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          )}
                        </div>
                        <span className={isSelected ? 'admin-font-medium' : ''}>
                          {option.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {error && <div className="admin-text-red-500 admin-text-sm admin-mt-1">{error}</div>}
    </div>
  );
};
