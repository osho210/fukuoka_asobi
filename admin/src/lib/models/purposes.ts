/**
 * 目的モデルの設定
 */
import { ModelConfig } from '../modelConfig';

export const purposesConfig: ModelConfig = {
  columns: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'purposeName', sortable: true },
  ],
  fields: [
    { name: 'purposeName', type: 'text', required: true },
  ],
};
