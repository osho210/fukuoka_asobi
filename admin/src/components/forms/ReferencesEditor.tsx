import React from 'react';

// このコンポーネント内で扱う参考資料の型を定義
export type EditableReference = {
    id?: number; // 既存レコードのID
    title?: string | null;
    url: string;
    reference_type: string;
    sort_order: number;
    _destroy?: boolean; // 削除フラグ
};

type ReferencesEditorProps = {
    references: EditableReference[];
    onChange: (references: EditableReference[]) => void;
};

const REFERENCE_TYPES = [
    { value: 'official', label: '公式サイト' },
    { value: 'map', label: '地図' },
    { value: 'article', label: '記事' },
    { value: 'reservation', label: '予約' },
    { value: 'other', label: 'その他' },
];

const ReferencesEditor: React.FC<ReferencesEditorProps> = ({ references, onChange }) => {
    const handleAddRow = () => {
        const maxSortOrder = references.length > 0
            ? Math.max(...references.map(r => r.sort_order || 0))
            : 0;
        const newReferences = [
            ...references,
            {
                title: '',
                url: '',
                reference_type: 'other',
                sort_order: maxSortOrder + 1,
            },
        ];
        onChange(newReferences);
    };

    const handleRemoveRow = (index: number) => {
        const newReferences = references
            .map((reference, i) => {
                if (i === index) {
                    // 既存のレコードの場合は_destroyフラグを立てる
                    if (reference.id) {
                        return { ...reference, _destroy: true };
                    }
                    // 新規追加された行の場合はnullを返す
                    return null;
                }
                return reference;
            })
            .filter((r): r is EditableReference => r !== null); // nullを除去
        onChange(newReferences);
    };

    const handleChange = (
        index: number,
        field: keyof EditableReference,
        value: string | number
    ) => {
        const newReferences = references.map((reference, i) => {
            if (i === index) {
                return { ...reference, [field]: value };
            }
            return reference;
        });
        onChange(newReferences);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">参考資料</label>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                                タイトル
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                                URL
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                                種別
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                                順序
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-center text-sm font-medium">
                                操作
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {references.map((reference, index) => (
                            <tr key={index} className={reference._destroy ? 'opacity-50 bg-red-50' : ''}>
                                <td className="border border-gray-300 px-4 py-2">
                                    <input
                                        type="text"
                                        value={reference.title || ''}
                                        onChange={(e) => handleChange(index, 'title', e.target.value)}
                                        placeholder="例：公式サイト"
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={reference._destroy}
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <input
                                        type="url"
                                        value={reference.url}
                                        onChange={(e) => handleChange(index, 'url', e.target.value)}
                                        placeholder="https://example.com"
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={reference._destroy}
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <select
                                        value={reference.reference_type}
                                        onChange={(e) => handleChange(index, 'reference_type', e.target.value)}
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={reference._destroy}
                                    >
                                        {REFERENCE_TYPES.map((type) => (
                                            <option key={type.value} value={type.value}>
                                                {type.label}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <input
                                        type="number"
                                        value={reference.sort_order}
                                        onChange={(e) => handleChange(index, 'sort_order', parseInt(e.target.value, 10))}
                                        className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={reference._destroy}
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRow(index)}
                                        className={`text-sm font-medium ${reference._destroy
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-red-600 hover:text-red-900'
                                            }`}
                                        disabled={reference._destroy}
                                    >
                                        削除
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <button
                type="button"
                onClick={handleAddRow}
                className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                資料を追加
            </button>
        </div>
    );
};

export default ReferencesEditor;
