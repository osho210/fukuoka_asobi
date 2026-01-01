/**
 * カテゴリーモデルの設定
 */
import { ModelConfig } from '../modelConfig';

export const categoriesConfig: ModelConfig = {
  columns: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'name', sortable: true },
  ],
  fields: [
    { name: 'name', type: 'text', required: true },
  ],
};
