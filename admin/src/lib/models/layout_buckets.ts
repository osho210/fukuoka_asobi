/**
 * レイアウトバケットモデルの設定
 */
import { ModelConfig } from '../modelConfig';

export const layoutBucketsConfig: ModelConfig = {
  columns: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'キー', accessorKey: 'key', sortable: true },
    { header: '名前', accessorKey: 'name', sortable: true },
    { header: 'テンプレ', accessorKey: 'templateKey', sortable: false },
    { header: 'ステータス', accessorKey: 'status', sortable: true },
  ],
  fields: [
    { name: 'key', type: 'text', required: true },
    { name: 'name', type: 'text', required: true },
    { name: 'templateKey', type: 'text', required: true },
    { name: 'themeKey', type: 'text', required: false },
    { name: 'shift', type: 'select', required: true, enumKey: 'LayoutBucketShiftEnum' },
    { name: 'tilt', type: 'select', required: true, enumKey: 'LayoutBucketTiltEnum' },
    { name: 'depth', type: 'select', required: true, enumKey: 'LayoutBucketDepthEnum' },
    { name: 'status', type: 'select', required: true, enumKey: 'LayoutBucketStatusEnum' },
    { name: 'sortOrder', type: 'number', required: true },
  ],
};
