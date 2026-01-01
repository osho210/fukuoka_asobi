/**
 * 雑誌モデルの設定
 */
import React from 'react';
import { ModelConfig, ModelData } from '../modelConfig';
import { formatDateTimeToJapanese } from '@/lib/utils';

export const magazinesConfig: ModelConfig = {
  columns: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '雑誌名', accessorKey: 'name', sortable: true },
    { header: '出版社', accessorKey: 'publisher', sortable: true },
    { header: '号数', accessorKey: 'issueNumber', sortable: false },
    { header: 'ステータス', accessorKey: 'status', sortable: true },
    {
      header: '発売日',
      accessorKey: 'releaseDate',
      sortable: true,
      cell: (item: ModelData) => formatDateTimeToJapanese(item.releaseDate as string)
    },
  ],
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'publisher', type: 'text' },
    { name: 'issueNumber', type: 'text' },
    { name: 'releaseDate', type: 'datetime' },
    { name: 'salesInfo', type: 'text' },
    { name: 'salesUrl', type: 'text' },
    { name: 'coverImageUrl', type: 'text' },
    { name: 'description', type: 'textarea' },
    { name: 'status', type: 'select', required: true, enumKey: 'MagazineStatusEnum' },
  ],
};
