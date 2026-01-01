/**
 * ニュースモデルの設定
 */
import React from 'react';
import { ModelConfig, ModelData } from '../modelConfig';
import { formatDateTimeToJapanese } from '@/lib/utils';

export const newsConfig: ModelConfig = {
  columns: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'タイトル', accessorKey: 'title', sortable: true },
    {
      header: '公開日',
      accessorKey: 'publishedAt',
      sortable: true,
      cell: (item: ModelData) => formatDateTimeToJapanese(item.publishedAt as string)
    },
    {
      header: '更新日時',
      accessorKey: 'updatedAt',
      sortable: true,
      cell: (item: ModelData) => formatDateTimeToJapanese(item.updatedAt as string)
    },
  ],
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    { name: 'publishedAt', type: 'datetime', required: true },
    { name: 'status', type: 'select', required: true, enumKey: 'StatusEnum' },
    { name: 'imageUrl', type: 'text' },
    { name: 'category', type: 'relation' },
    { name: 'author', type: 'relation' },
  ],
};
