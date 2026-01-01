import React from 'react';

// このコンポーネント内で扱う持ち物の型を定義
export type EditableBelonging = {
    id?: number; // 既存レコードのID
    name: string;
    note?: string | null;
    sort_order: number;
    _destroy?: boolean; // 削除フラグ
};

type BelongingsEditorProps = {
    belongings: EditableBelonging[];
    onChange: (belongings: EditableBelonging[]) => void;
};

const BelongingsEditor: React.FC<BelongingsEditorProps> = ({ belongings, onChange }) => {
    const handleAddRow = () => {
        const maxSortOrder = belongings.length > 0
            ? Math.max(...belongings.map(b => b.sort_order || 0))
            : 0;
        const newBelongings = [
            ...belongings,
            {
                name: '',
                note: '',
                sort_order: maxSortOrder + 1,
            },
        ];
        onChange(newBelongings);
    };

    const handleRemoveRow = (index: number) => {
        const newBelongings = belongings
            .map((belonging, i) => {
                if (i === index) {
                    // 既存のレコードの場合は_destroyフラグを立てる
                    if (belonging.id) {
                        return { ...belonging, _destroy: true };
                    }
                    // 新規追加された行の場合はnullを返す
                    return null;
                }
                return belonging;
            })
            .filter((b): b is EditableBelonging => b !== null); // nullを除去
        onChange(newBelongings);
    };

    const handleChange = (
        index: number,
        field: keyof EditableBelonging,
        value: string | number
    ) => {
        const newBelongings = belongings.map((belonging, i) => {
            if (i === index) {
                return { ...belonging, [field]: value };
            }
            return belonging;
        });
        onChange(newBelongings);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">持ち物</label>
            <div className="overflow-x-auto">
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                                項目名
                            </th>
                            <th className="border border-gray-300 px-4 py-2 text-left text-sm font-medium">
                                備考
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
                        {belongings.map((belonging, index) => (
                            <tr key={index} className={belonging._destroy ? 'opacity-50 bg-red-50' : ''}>
                                <td className="border border-gray-300 px-4 py-2">
                                    <input
                                        type="text"
                                        value={belonging.name}
                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                        placeholder="例：アウター、帽子"
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={belonging._destroy}
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <input
                                        type="text"
                                        value={belonging.note || ''}
                                        onChange={(e) => handleChange(index, 'note', e.target.value)}
                                        placeholder="追加の情報"
                                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={belonging._destroy}
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <input
                                        type="number"
                                        value={belonging.sort_order}
                                        onChange={(e) => handleChange(index, 'sort_order', parseInt(e.target.value, 10))}
                                        className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        disabled={belonging._destroy}
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2 text-center">
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveRow(index)}
                                        className={`text-sm font-medium ${belonging._destroy
                                                ? 'text-gray-400 cursor-not-allowed'
                                                : 'text-red-600 hover:text-red-900'
                                            }`}
                                        disabled={belonging._destroy}
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
                項目を追加
            </button>
        </div>
    );
};

export default BelongingsEditor;
