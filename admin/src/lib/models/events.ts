/**
 * イベントモデルの設定
 */
import { ModelConfig, ModelData } from '../modelConfig';
import { formatDateTimeToJapanese } from '@/lib/utils';

export const eventsConfig: ModelConfig = {
  columns: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'タイトル', accessorKey: 'title', sortable: true },
    { header: '場所', accessorKey: 'location', sortable: false },
    {
      header: '開始日時',
      accessorKey: 'startDatetime',
      sortable: true,
      cell: (item: ModelData) => formatDateTimeToJapanese(item.startDatetime as string)
    },
    {
      header: '終了日時',
      accessorKey: 'endDatetime',
      sortable: true,
      cell: (item: ModelData) => formatDateTimeToJapanese(item.endDatetime as string)
    },
  ],
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'location', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'price', type: 'text', required: false },
    { name: 'organizer', type: 'text', required: false },
    { name: 'contactEmail', type: 'text', required: false },
    { name: 'contactPhone', type: 'text', required: false },
    { name: 'capacity', type: 'number', required: false },
    { name: 'sourceUrl', type: 'text', required: false },
    { name: 'bannerImage', type: 'text', required: false },
    { name: 'isOnline', type: 'boolean', required: false },
    { name: 'eventCategory', type: 'relation', required: false },
    { name: 'status', type: 'select', required: true, enumKey: 'StatusEnum' },
    { name: 'startDatetime', type: 'datetime', required: false },
    { name: 'endDatetime', type: 'datetime', required: false },
  ],
};
