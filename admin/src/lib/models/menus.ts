/**
 * メニューモデルの設定
 */
import React from 'react';
import { ModelConfig, ModelData } from '../modelConfig';

export const menusConfig: ModelConfig = {
  columns: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'menuName', sortable: true },
    {
      header: '画像',
      accessorKey: 'imageUrl',
      sortable: false,
      cell: (item: ModelData) => {
        if (
          item.imageUrl &&
          typeof item.imageUrl === 'object' &&
          'url' in item.imageUrl
        ) {
          return React.createElement('img', {
            src: (item.imageUrl as { url: string }).url,
            alt: item.menuName as string,
            style: { width: '40px', height: 'auto' },
          });
        }
        return '画像なし';
      },
    },
  ],
  fields: [
    { name: 'menuName', type: 'text', required: true },
    { name: 'price', type: 'number' },
    { name: 'description', type: 'textarea' },
    { name: 'image', type: 'image_upload' },
    { name: 'menuCategory', type: 'relation', required: false },
  ],
};
