/**
 * エリアモデルの設定
 */
import { ModelConfig } from '../modelConfig';

export const areasConfig: ModelConfig = {
  columns: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'areaName', sortable: true },
    { header: '地区', accessorKey: 'district.districtName', sortable: false },
  ],
  fields: [
    { name: 'areaName', type: 'text', required: true },
    { name: 'district', type: 'relation', required: true },
  ],
};
