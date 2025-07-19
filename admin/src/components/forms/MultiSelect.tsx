import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';
import { modelRouteMap } from '@/lib/modelRouteMap';

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
  name?: string;
  label: string;
  modelName: string;
  labelField: string;
  selectedValues: RelationItem[];
  onChange: (values: RelationItem[]) => void;
  required?: boolean;
  error?: string;
  fullWidth?: boolean;
  maxSelection?: number;
  filter?: {
    field: string;
    values: (string | number)[];
  };
}

// クエリ結果の型定義
interface QueryResult {
  [key: string]: {
    id: string;
    [key: string]: string | number | boolean | null;
  }[];
}

const snakeToCamel = (s: string) => {
  return s.replace(/(_\w)/g, (m) => m[1].toUpperCase());
};

const snakeToPascal = (str: string) => {
  const camel = snakeToCamel(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

// 各モデルのクエリを動的に生成
const generateQuery = (modelName: string, labelField: string, filterField?: string) => {
  const routeName = modelRouteMap[modelName] || modelName;
  const operationName = snakeToPascal(routeName);
  const queryFieldName = snakeToCamel(routeName);

  let extraFields = '';
  if (filterField && filterField.includes('.')) {
    const fields = filterField.split('.').slice(0, -1);
    if (fields.length > 0) {
      let result = '';
      for (const field of fields) {
        result += `${field} { `;
      }
      // 最終的なフィールドとしてidを要求
      result += 'id';
      // 開いた括弧の数だけ閉じる
      for (let i = 0; i < fields.length; i++) {
        result += ' }';
      }
      extraFields = result;
    }
  }

  return gql`
    query Get${operationName} {
      ${queryFieldName} {
        id
        ${labelField}
        ${extraFields}
      }
    }
  `;
};

export const MultiSelect: React.FC<MultiSelectProps> = ({
  id,
  label,
  modelName,
  labelField,
  selectedValues = [],
  onChange,
  required = false,
  error,
  fullWidth = false,
  maxSelection,
  filter,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [localSelectedValues, setLocalSelectedValues] = useState<RelationItem[]>(selectedValues || []);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const query = useMemo(() => generateQuery(modelName, labelField, filter?.field), [modelName, labelField, filter?.field]);

  const { data, loading } = useQuery<QueryResult>(query, {
    onCompleted: () => {
      // フィルターが変更されたら、選択済みの値をクリアする
      // ただし、初回の読み込み時やフィルター値がない場合はクリアしない
      if (filter?.values && filter.values.length > 0) {
        setLocalSelectedValues([]);
        onChange([]);
      }
    }
  });

  // selectedValuesが変更されたらlocalSelectedValuesを更新
  useEffect(() => {
    // 外部からの変更を尊重するが、フィルター適用中は更新しない
    if (!filter?.values || filter.values.length === 0) {
      setLocalSelectedValues(selectedValues || []);
    }
  }, [selectedValues, filter?.values]);

  useEffect(() => {
    const routeName = modelRouteMap[modelName] || modelName;
    const queryFieldName = snakeToCamel(routeName);
    if (data && data[queryFieldName]) {
      let items = data[queryFieldName];

      // Client-side filtering
      if (filter?.field && filter.values && filter.values.length > 0) {
        items = items.filter(item => {
          const fieldParts = filter.field.split('.');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          let value: any = item;
          for (const part of fieldParts) {
            if (value === null || typeof value !== 'object' || !value.hasOwnProperty(part)) {
              return false;
            }
            value = value[part];
          }
          if (typeof value === 'string' || typeof value === 'number') {
            return filter.values.includes(value);
          }
          return false;
        });
      }

      const fetchedOptions = items
        .map(item => ({
          value: item.id,
          label: item[labelField] as string | null,
        }))
        .filter((option): option is Option => option.label != null && option.label !== '');
      setOptions(fetchedOptions);
    } else if (!loading) {
      // データがない場合や、フィルターで結果が0件の場合
      setOptions([]);
    }
  }, [data, loading, modelName, labelField, filter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggleOption = (value: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    let newValues: RelationItem[];
    const isSelected = localSelectedValues.some(item => item.id === value);

    if (isSelected) {
      newValues = localSelectedValues.filter(item => item.id !== value);
    } else {
      if (maxSelection && localSelectedValues.length >= maxSelection) {
        if (maxSelection === 1) {
          const option = options.find(opt => opt.value === value);
          if (option) {
            const newItem: RelationItem = { __typename: modelName, id: value, [labelField]: option.label };
            newValues = [newItem];
          } else {
            newValues = [...localSelectedValues];
          }
        } else {
          return;
        }
      } else {
        const option = options.find(opt => opt.value === value);
        if (option) {
          const newItem: RelationItem = { __typename: modelName, id: value, [labelField]: option.label };
          newValues = [...localSelectedValues, newItem];
        } else {
          newValues = [...localSelectedValues];
        }
      }
    }
    setLocalSelectedValues(newValues);
    onChange(newValues);
  };

  const getSelectedLabels = () => {
    return localSelectedValues
      .map(item => item[labelField] || options.find(opt => opt.value === item.id)?.label || '')
      .filter(Boolean)
      .join(', ');
  };

  const handleClearAll = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLocalSelectedValues([]);
    onChange([]);
  };

  const filteredOptions = options.filter(option =>
    option.label && option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`admin-form-field ${fullWidth ? 'admin-w-full' : ''}`} ref={dropdownRef}>
      <label htmlFor={id} className="admin-form-label">
        {label}
        {required && <span className="admin-text-red-500">*</span>}
      </label>

      <div className="admin-multiselect-container">
        <div
          className={`admin-multiselect-trigger ${isOpen ? 'admin-multiselect-trigger-active' : ''} ${error ? 'admin-form-control-error' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
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
            className={`admin-h-5 admin-w-5 admin-transition-transform ${isOpen ? 'admin-rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>

        {isOpen && (
          <div className="admin-multiselect-dropdown">
            <div className="admin-multiselect-search-wrapper">
              <input
                type="text"
                placeholder="検索..."
                className="admin-multiselect-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            {loading ? (
              <div className="admin-multiselect-loading">
                <div className="admin-multiselect-spinner"></div>
                読み込み中...
              </div>
            ) : filteredOptions.length === 0 ? (
              <div className="admin-multiselect-empty">該当するオプションがありません</div>
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
                  {filteredOptions.map(option => {
                    const isSelected = localSelectedValues.some(item => item.id === option.value);
                    return (
                      <div
                        key={option.value}
                        className={`admin-multiselect-option ${isSelected ? 'admin-multiselect-option-selected' : ''}`}
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

      {localSelectedValues.length > 0 && (
        <div className="admin-selected-chips admin-mt-2 admin-flex admin-flex-wrap admin-gap-2">
          {localSelectedValues.map(item => {
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
