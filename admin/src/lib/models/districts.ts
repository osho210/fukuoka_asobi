/**
 * 地区モデルの設定
 */
import { ModelConfig } from '../modelConfig';

export const districtsConfig: ModelConfig = {
  columns: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'districtName', sortable: true },
  ],
  fields: [
    { name: 'districtName', type: 'text', required: true },
  ],
};
