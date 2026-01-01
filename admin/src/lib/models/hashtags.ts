/**
 * ハッシュタグモデルの設定
 */
import { ModelConfig } from '../modelConfig';

export const hashtagsConfig: ModelConfig = {
  columns: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'hashtagName', sortable: true },
  ],
  fields: [
    { name: 'hashtagName', type: 'text', required: true },
  ],
};
