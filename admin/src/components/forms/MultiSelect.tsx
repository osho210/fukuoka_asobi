import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

// 選択項目の型定義
interface RelationItem {
  __typename?: string;
  id: string;
  [key: string]: string | number | boolean | null | undefined;
}

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  id: string;
  name?: string; // 使用していないのでオプショナルに変更
  label: string;
  modelName: string;
  labelField: string;
  selectedValues: RelationItem[];
  onChange: (values: RelationItem[]) => void;
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
  const [localSelectedValues, setLocalSelectedValues] = useState<RelationItem[]>(selectedValues || []);

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
        value: item.id,
        label: item[labelField] as string,
      }));
      setOptions(fetchedOptions);
    }
  }, [data, modelName, labelField]);

  // 選択状態の切り替え
  const handleToggleOption = (value: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let newValues: RelationItem[];

    // 選択済みかどうかを確認
    const isSelected = localSelectedValues.some(item => item.id === value);

    if (isSelected) {
      // 選択済みの場合は削除
      newValues = localSelectedValues.filter(item => item.id !== value);
    } else {
      // 未選択の場合は追加
      const option = options.find(opt => opt.value === value);
      if (option) {
        const newItem: RelationItem = {
          __typename: modelName,
          id: value,
          [labelField]: option.label
        };
        newValues = [...localSelectedValues, newItem];
      } else {
        newValues = [...localSelectedValues];
      }
    }

    setLocalSelectedValues(newValues);
    onChange(newValues);
  };

  // 選択されたオプションのラベルを取得
  const getSelectedLabels = () => {
    return localSelectedValues
      .map(item => {
        // 直接labelFieldの値を使用するか、optionsから検索
        return item[labelField] || options.find(opt => opt.value === item.id)?.label || '';
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
                    const isSelected = localSelectedValues.some(item => item.id === option.value);
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

      {/* 選択項目のチップを表示 */}
      {localSelectedValues.length > 0 && (
        <div className="admin-selected-chips admin-mt-2 admin-flex admin-flex-wrap admin-gap-2">
          {localSelectedValues.map(item => {
            // 直接labelFieldの値を使用するか、optionsから検索
            const label = item[labelField] || options.find(opt => opt.value === item.id)?.label || '';
            if (!label) return null;

            return (
              <div key={item.id} className="admin-chip admin-bg-gray-100 admin-px-2 admin-py-1 admin-rounded-full admin-text-sm admin-flex admin-items-center">
                <span className="admin-mr-1">{label}</span>
                <button
                  type="button"
                  className="admin-chip-remove admin-text-gray-500 admin-hover:admin-text-gray-700"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const newValues = localSelectedValues.filter(v => v.id !== item.id);
                    setLocalSelectedValues(newValues);
                    onChange(newValues);
                  }}
                >
                  <svg className="admin-h-4 admin-w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {error && <div className="admin-text-red-500 admin-text-sm admin-mt-1">{error}</div>}
    </div>
  );
};
