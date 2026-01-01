/**
 * 駅モデルの設定
 */
import { ModelConfig } from '../modelConfig';

export const stationsConfig: ModelConfig = {
  columns: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '駅名', accessorKey: 'name', sortable: true },
    { header: '路線名', accessorKey: 'trainLine', sortable: true },
    { header: '説明', accessorKey: 'description', sortable: false },
    { header: '有効', accessorKey: 'active', sortable: true },
  ],
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'trainLine', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    { name: 'active', type: 'boolean' },
  ],
};
