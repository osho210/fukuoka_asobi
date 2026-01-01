/**
 * 雰囲気モデルの設定
 */
import { ModelConfig } from '../modelConfig';

export const spotAmbiancesConfig: ModelConfig = {
  columns: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'ambianceName', sortable: true },
  ],
  fields: [
    { name: 'ambianceName', type: 'text', required: true },
  ],
};
