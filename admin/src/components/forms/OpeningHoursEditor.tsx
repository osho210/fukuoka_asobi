import React from 'react';

// このコンポーネント内で扱う営業時間の型を定義
export type EditableOpeningHour = {
  dayOfWeek: string;
  openTime: string | null;
  closeTime: string | null;
  isClosedDay: boolean;
  _destroy?: boolean; // 削除フラグ
  id?: number; // 既存レコードのID
};

type OpeningHoursEditorProps = {
  openingHours: EditableOpeningHour[];
  onChange: (openingHours: EditableOpeningHour[]) => void;
};

const OpeningHoursEditor: React.FC<OpeningHoursEditorProps> = ({ openingHours, onChange }) => {
  const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

  const handleAddRow = () => {
    const newOpeningHours = [...openingHours, { dayOfWeek: 'MONDAY', openTime: '09:00', closeTime: '18:00', isClosedDay: false }];
    onChange(newOpeningHours);
  };

  const handleRemoveRow = (index: number) => {
    const newOpeningHours = openingHours.map((hour, i) => {
      if (i === index) {
        // 既存のレコードの場合は_destroyフラグを立てる
        if (hour.id) {
          return { ...hour, _destroy: true };
        }
        // 新規追加された行の場合は配列から削除
        return null;
      }
      return hour;
    }).filter(Boolean) as EditableOpeningHour[]; // nullを除去
    onChange(newOpeningHours);
  };

  const handleChange = (index: number, field: keyof EditableOpeningHour, value: string | boolean) => {
    const newOpeningHours = openingHours.map((hour, i) => {
      if (i === index) {
        return { ...hour, [field]: value };
      }
      return hour;
    });
    onChange(newOpeningHours);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">営業時間</label>
      {openingHours.map((hour, index) => (
        <div key={index} className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-4">
            <select
              value={hour.dayOfWeek}
              onChange={(e) => handleChange(index, 'dayOfWeek', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>
          <div className="col-span-3">
            <input
              type="time"
              value={hour.openTime || ''}
              onChange={(e) => handleChange(index, 'openTime', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={hour.isClosedDay}
            />
          </div>
          <div className="col-span-3">
            <input
              type="time"
              value={hour.closeTime || ''}
              onChange={(e) => handleChange(index, 'closeTime', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              disabled={hour.isClosedDay}
            />
          </div>
          <div className="col-span-1 flex items-center">
            <input
              type="checkbox"
              checked={hour.isClosedDay}
              onChange={(e) => handleChange(index, 'isClosedDay', e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
             <label className="ml-2 block text-sm text-gray-900">休</label>
          </div>
          <div className="col-span-1">
            <button
              type="button"
              onClick={() => handleRemoveRow(index)}
              className="text-red-600 hover:text-red-900"
            >
              削除
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={handleAddRow}
        className="mt-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        行を追加
      </button>
    </div>
  );
};

export default OpeningHoursEditor;
