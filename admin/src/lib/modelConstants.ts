/**
 * モデル関連の定数を定義するファイル
 */

// 各モデルの列定義
export interface ColumnDefinition {
  header: string;
  accessorKey: string;
  sortable: boolean;
}

// モデルフィールド定義
export interface ModelField {
  name: string;
  type: string;
  required?: boolean;
  enumKey?: string;
}

// モデル名の日本語表示
export const modelDisplayNames: Record<string, string> = {
  areas: 'エリア',
  categories: 'カテゴリー',
  districts: '地区',
  hashtags: 'ハッシュタグ',
  menus: 'メニュー',
  purposes: '目的',
  recommended_fors: 'おすすめ対象',
  spot_ambiances: '雰囲気',
  spots: 'スポット',
  play_plans: '遊びプラン',
  events: 'イベント',
  news: 'ニュース',
};

// 各モデルの列定義
export const columnConfigs: Record<string, ColumnDefinition[]> = {
  areas: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'areaName', sortable: true },
    { header: '地区', accessorKey: 'district.districtName', sortable: false },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  categories: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'name', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  districts: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'districtName', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  hashtags: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'hashtagName', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  menus: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'menuName', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  purposes: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'purposeName', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  recommended_fors: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'name', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  spot_ambiances: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'ambianceName', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  spots: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'spotName', sortable: true },
    { header: '住所', accessorKey: 'address', sortable: false },
    { header: '地区', accessorKey: 'district.districtName', sortable: false },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  play_plans: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'planName', sortable: true },
    { header: 'ステータス', accessorKey: 'status', sortable: true },
    { header: '作成者', accessorKey: 'user.username', sortable: false },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  events: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'タイトル', accessorKey: 'title', sortable: true },
    { header: '場所', accessorKey: 'location', sortable: false },
    { header: '開始日時', accessorKey: 'startDatetime', sortable: true },
    { header: '終了日時', accessorKey: 'endDatetime', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  news: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'タイトル', accessorKey: 'title', sortable: true },
    { header: '公開日', accessorKey: 'publishedAt', sortable: true },
    { header: '更新日時', accessorKey: 'updatedAt', sortable: true },
  ],
  stations: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '駅名', accessorKey: 'name', sortable: true },
    { header: '路線名', accessorKey: 'trainLine', sortable: true },
    { header: '説明', accessorKey: 'description', sortable: false },
    { header: '有効', accessorKey: 'active', sortable: true },
  ]
};

// 各モデルのフィールド定義
export const modelFields: Record<string, ModelField[]> = {
  areas: [
    { name: 'areaName', type: 'text', required: true },
    { name: 'district', type: 'relation', required: true },
  ],
  categories: [
    { name: 'name', type: 'text', required: true },
  ],
  districts: [
    { name: 'districtName', type: 'text', required: true },
  ],
  hashtags: [
    { name: 'hashtagName', type: 'text', required: true },
  ],
  menus: [
    { name: 'menuName', type: 'text', required: true },
  ],
  purposes: [
    { name: 'purposeName', type: 'text', required: true },
  ],
  recommended_fors: [
    { name: 'name', type: 'text', required: true },
  ],
  spot_ambiances: [
    { name: 'ambianceName', type: 'text', required: true },
  ],
  spots: [
    { name: 'spotName', type: 'text', required: true },
    { name: 'address', type: 'text', required: true },
    { name: 'district', type: 'relation', required: true },
    { name: 'phoneNumber', type: 'text' },
    { name: 'website', type: 'text' },
    { name: 'catchphrase', type: 'text' },
    { name: 'isRainyOk', type: 'boolean' },
    { name: 'isClosed', type: 'boolean' },
    { name: 'nearestStation', type: 'text' },
    { name: 'imageUrl', type: 'text' },
    { name: 'minPeople', type: 'number' },
    { name: 'maxPeople', type: 'number' },
    { name: 'recommendedFor1', type: 'text' },
    { name: 'recommendedFor2', type: 'text' },
    { name: 'reviewCount', type: 'number' },
    { name: 'reviewRating', type: 'number' },
    { name: 'instagramUrl', type: 'text' },
    { name: 'spotType', type: 'select', required: true, enumKey: 'SpotTypeEnum' },
    { name: 'budgetRange', type: 'select', required: true, enumKey: 'BudgetRangeEnum' },
  ],
  news: [
    { name: 'title', type: 'text', required: true },
    { name: 'body', type: 'textarea', required: true },
    { name: 'publishedAt', type: 'datetime', required: true },
    { name: 'status', type: 'select', required: true, enumKey: 'StatusEnum' },
    { name: 'imageUrl', type: 'text' },
    { name: 'category', type: 'relation' },
    { name: 'author', type: 'relation' },
    { name: 'createdAt', type: 'datetime', required: true },
  ],
  stations: [
    { name: 'name', type: 'text', required: true },
    { name: 'trainLine', type: 'select', required: true, enumKey: 'TrainLineTypeEnum' },
    { name: 'description', type: 'textarea' },
    { name: 'active', type: 'boolean' },
  ],
};

// フィールド名の日本語表示
export const fieldDisplayNames: Record<string, string> = {
  areaName: 'エリア名',
  district: '地区',
  name: '名前',
  districtName: '地区名',
  hashtagName: 'ハッシュタグ名',
  menuName: 'メニュー名',
  purposeName: '目的名',
  ambianceName: '雰囲気名',
  spotName: 'スポット名',
  address: '住所',
  phoneNumber: '電話番号',
  instagramUrl: 'Instagram URL',
  website: 'ウェブサイト',
  catchphrase: 'キャッチフレーズ',
  isRainyOk: '雨天可否',
  budgetRange: '予算感',
  isClosed: '営業中',
  nearestStation: '最寄り駅',
  imageUrl: '画像URL',
  minPeople: '最小人数',
  maxPeople: '最大人数',
  recommendedFor1: 'おすすめ対象1',
  recommendedFor2: 'おすすめ対象2',
  reviewCount: 'レビュー数',
  reviewRating: 'レビュー評価',
  spotType: 'スポットタイプ',
  planName: 'プラン名',
  trainLine: '路線名',
  status: 'ステータス',
  title: 'タイトル',
  location: '場所',
  startDatetime: '開始日時',
  endDatetime: '終了日時',
  publishedAt: '公開日',
  updatedAt: '更新日時',
};
