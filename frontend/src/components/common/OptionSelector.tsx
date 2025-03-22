import React from 'react';
import { useOptions } from '@/lib/hooks/useOptions';

interface OptionSelectorProps {
  type: 'theme' | 'transportation' | 'category';
  value: string;
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

/**
 * テーマ、移動手段、カテゴリーの選択肢を表示するセレクトボックスコンポーネント
 */
export const OptionSelector: React.FC<OptionSelectorProps> = ({
  type,
  value,
  onChange,
  label,
  className = '',
}) => {
  const { themeOptions, transportationOptions, categoryOptions, loading, error } = useOptions();

  // 選択肢の取得
  const getOptions = () => {
    switch (type) {
      case 'theme':
        return themeOptions;
      case 'transportation':
        return transportationOptions;
      case 'category':
        return categoryOptions;
      default:
        return [];
    }
  };

  // ラベルの取得
  const getLabel = () => {
    if (label) return label;

    switch (type) {
      case 'theme':
        return 'テーマ';
      case 'transportation':
        return '移動手段';
      case 'category':
        return 'カテゴリー';
      default:
        return '';
    }
  };

  if (loading) return <div>読み込み中...</div>;
  if (error) return <div>エラーが発生しました: {error.message}</div>;

  const options = getOptions();

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {getLabel()}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      >
        <option value="">選択してください</option>
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};
