/**
 * モデル関連の定数を定義するファイル
 */
import { formatDateTimeToJapanese } from '@/lib/utils';

// モデルデータの型定義
export interface ModelData {
  id: string;
  [key: string]: string | number | boolean | object | null | undefined;
}

// 各モデルの列定義
export interface ColumnDefinition {
  header: string;
  accessorKey: string;
  sortable: boolean;
  cell?: (item: ModelData) => React.ReactNode;
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
  stations: '駅',
  eventCategories: 'イベントカテゴリー',
};

// 各モデルの列定義
export const columnConfigs: Record<string, ColumnDefinition[]> = {
  areas: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'areaName', sortable: true },
    { header: '地区', accessorKey: 'district.districtName', sortable: false },
  ],
  categories: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'name', sortable: true },
  ],
  districts: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'districtName', sortable: true },
  ],
  hashtags: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'hashtagName', sortable: true },
  ],
  menus: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'menuName', sortable: true },
  ],
  purposes: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'purposeName', sortable: true },
  ],
  recommended_fors: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'name', sortable: true },
  ],
  spot_ambiances: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'ambianceName', sortable: true },
  ],
  spots: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'spotName', sortable: true },
    { header: '住所', accessorKey: 'address', sortable: false },
    { header: '地区', accessorKey: 'district.districtName', sortable: false },
  ],
  play_plans: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '名前', accessorKey: 'planName', sortable: true },
    { header: 'ステータス', accessorKey: 'status', sortable: true },
    { header: '作成者', accessorKey: 'user.username', sortable: false },
  ],
  events: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'タイトル', accessorKey: 'title', sortable: true },
    { header: '場所', accessorKey: 'location', sortable: false },
    {
      header: '開始日時',
      accessorKey: 'startDatetime',
      sortable: true,
      cell: (item) => formatDateTimeToJapanese(item.startDatetime as string)
    },
    {
      header: '終了日時',
      accessorKey: 'endDatetime',
      sortable: true,
      cell: (item) => formatDateTimeToJapanese(item.endDatetime as string)
    },
  ],
  news: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: 'タイトル', accessorKey: 'title', sortable: true },
    {
      header: '公開日',
      accessorKey: 'publishedAt',
      sortable: true,
      cell: (item) => formatDateTimeToJapanese(item.publishedAt as string)
    },
    {
      header: '更新日時',
      accessorKey: 'updatedAt',
      sortable: true,
      cell: (item) => formatDateTimeToJapanese(item.updatedAt as string)
    },
  ],
  stations: [
    { header: 'ID', accessorKey: 'id', sortable: true },
    { header: '駅名', accessorKey: 'name', sortable: true },
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
    { name: 'phoneNumber', type: 'text' },
    { name: 'website', type: 'text' },
    { name: 'catchphrase', type: 'text' },
    { name: 'nearestStation', type: 'text' },
    { name: 'imageUrl', type: 'text' },
    { name: 'minPeople', type: 'number' },
    { name: 'maxPeople', type: 'number' },
    { name: 'recommendedFor1', type: 'text' },
    { name: 'recommendedFor2', type: 'text' },
    { name: 'reviewCount', type: 'number' },
    { name: 'reviewRating', type: 'number' },
    { name: 'instagramUrl', type: 'text' },
    //  TODO: ここも中間テーブルの回収が必要
    // { name: 'instagramEmbeds', type: 'text' },
    { name: 'spotType', type: 'select', required: true, enumKey: 'SpotTypeEnum' },
    { name: 'budgetRange', type: 'select', required: true, enumKey: 'BudgetRangeEnum' },
    { name: 'district', type: 'relation', required: true },
    { name: 'themes', type: 'multiSelect', required: false }, //TODO: マスタ登録必要 (CRUD)
    { name: 'categories', type: 'multiSelect', required: false },
    { name: 'hashtags', type: 'multiSelect', required: false },
    { name: 'spotAmbiances', type: 'multiSelect', required: false },
    { name: 'purposes', type: 'multiSelect', required: false },
    { name: 'menus', type: 'multiSelect', required: false },
    { name: 'areas', type: 'multiSelect', required: false },
    { name: 'isRainyOk', type: 'boolean' },
    { name: 'isClosed', type: 'boolean' },
    { name: 'parkingAvailable', type: 'boolean' },
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
  events: [
    { name: 'title', type: 'text', required: true },
    { name: 'location', type: 'text', required: true },
    { name: 'description', type: 'textarea' },
    //現状は利用していないので一旦コメントアウト
    // { name: 'recurringRule', type: 'relation', required: false }, //1日限定か、1週間か
    { name: 'price', type: 'text', required: false }, //価格
    { name: 'organizer', type: 'text', required: false }, //主催者
    { name: 'contactEmail', type: 'text', required: false }, //連絡先メールアドレス
    { name: 'contactPhone', type: 'text', required: false }, //連絡先電話番号
    { name: 'capacity', type: 'number', required: false }, //定員
    { name: 'sourceUrl', type: 'text', required: false }, //外部リンク
    { name: 'bannerImage', type: 'text', required: false }, //バナー画像URL
    { name: 'isOnline', type: 'boolean', required: false }, //オンラインイベントかどうか
    { name: 'eventCategory', type: 'relation', required: false }, //イベントカテゴリーID
    { name: 'status', type: 'select', required: true, enumKey: 'StatusEnum' },
    { name: 'startDatetime', type: 'datetime', required: false },
    { name: 'endDatetime', type: 'datetime', required: false },

    // TODO: 中間テーブルを作成して以下項目も連携できるように改修する
    // { name: 'hashtags', type: 'multiSelect', required: false }, //ハッシュタグ
    // { name: 'spotAmbiances', type: 'multiSelect', required: false }, //雰囲気
    // { name: 'purposes', type: 'multiSelect', required: false }, //目的
    // { name: 'areas', type: 'multiSelect', required: false }, //エリア
    // { name: 'themes', type: 'multiSelect', required: false }, //TODO: マスタ登録必要 (CRUD)
    // { name: 'instagramEmbeds', type: 'multiSelect', required: false }, //Instagram 埋め込み
  ]
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
  parkingAvailable: '駐車場あり',
  themes: 'テーマ',
  districtId: '地区ID',
  category: 'カテゴリー',
  hashtags: 'ハッシュタグ',
  instagramEmbeds: 'Instagram 埋め込み',
  spotAmbiances: '雰囲気',
  menus: 'メニュー',
  purposes: '目的',
  eventCategoryId: 'イベントカテゴリー',
  isOnline: 'オンラインイベント',
  sourceUrl: '外部リンク',
  bannerImage: 'バナー画像',
  organizer: '主催者',
  contactEmail: '連絡先メールアドレス',
  contactPhone: '連絡先電話番号',
};
