/**
 * モデル関連の定数を定義するファイル
 */
import React from 'react';
import { formatDateTimeToJapanese } from '@/lib/utils';

// モデルデータの型定義
export interface ModelData {
  id: string;
  [key: string]: unknown;
}

// 各モデルの列定義
export interface ColumnDefinition {
  header: string;
  accessorKey: string;
  sortable: boolean;
  cell?: (item: ModelData) => React.ReactNode;
}

// フィルターフィールド定義
export interface FilterField {
  name: string; // フィルター対象のフィールド名 (e.g., menuCategory)
  label: string; // 表示ラベル (e.g., メニューカテゴリー)
  model: string; // 選択肢を取得するためのモデル名 (e.g., menuCategories)
  labelField: string; // 選択肢のラベルとして使用するフィールド名 (e.g., name)
}

// モデルフィールド定義
export interface ModelField {
  name: string;
  type: string;
  required?: boolean;
  enumKey?: string;
  childModel?: string;
  fields?: ModelField[];
  relationModel?: string;
}

// モデルごとの設定をまとめる型
export interface ModelConfig {
  columns: ColumnDefinition[];
  fields: ModelField[];
  filters?: FilterField[];
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
  magazines: '雑誌',
  stations: '駅',
  eventCategories: 'イベントカテゴリー',
  menuCategories: 'メニューカテゴリー',
  direction_cards: '方向性カード',
  experience_cards: '体験カード',
  layout_buckets: 'レイアウトバケット',
  bucket_list_items: '福岡でやりたいこと',
};

// 各モデルの設定を統合
export const modelConfigs: Record<string, ModelConfig> = {
  areas: {
    columns: [
      { header: 'ID', accessorKey: 'id', sortable: true },
      { header: '名前', accessorKey: 'areaName', sortable: true },
      { header: '地区', accessorKey: 'district.districtName', sortable: false },
    ],
    fields: [
      { name: 'areaName', type: 'text', required: true },
      { name: 'district', type: 'relation', required: true },
    ],
  },
  categories: {
    columns: [
      { header: 'ID', accessorKey: 'id', sortable: true },
      { header: '名前', accessorKey: 'name', sortable: true },
    ],
    fields: [
      { name: 'name', type: 'text', required: true },
    ],
  },
  districts: {
    columns: [
      { header: 'ID', accessorKey: 'id', sortable: true },
      { header: '名前', accessorKey: 'districtName', sortable: true },
    ],
    fields: [
      { name: 'districtName', type: 'text', required: true },
    ],
  },
  hashtags: {
    columns: [
      { header: 'ID', accessorKey: 'id', sortable: true },
      { header: '名前', accessorKey: 'hashtagName', sortable: true },
    ],
    fields: [
      { name: 'hashtagName', type: 'text', required: true },
    ],
  },
  menus: {
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
  },
  purposes: {
    columns: [
      { header: 'ID', accessorKey: 'id', sortable: true },
      { header: '名前', accessorKey: 'purposeName', sortable: true },
    ],
    fields: [
      { name: 'purposeName', type: 'text', required: true },
    ],
  },
  recommended_fors: {
    columns: [
      { header: 'ID', accessorKey: 'id', sortable: true },
      { header: '名前', accessorKey: 'name', sortable: true },
    ],
    fields: [
      { name: 'name', type: 'text', required: true },
    ],
  },
  spot_ambiances: {
    columns: [
      { header: 'ID', accessorKey: 'id', sortable: true },
      { header: '名前', accessorKey: 'ambianceName', sortable: true },
    ],
    fields: [
      { name: 'ambianceName', type: 'text', required: true },
    ],
  },
  spots: {
    columns: [
      { header: 'ID', accessorKey: 'id', sortable: true },
      { header: '名前', accessorKey: 'spotName', sortable: true },
      { header: '住所', accessorKey: 'address', sortable: false },
      { header: '地区', accessorKey: 'district.districtName', sortable: false },
    ],
    fields: [
      { name: 'spotName', type: 'text', required: true },
      { name: 'description', type: 'textarea', required: false },
      { name: 'address', type: 'text', required: true },
      { name: 'phoneNumber', type: 'text' },
      { name: 'website', type: 'text' },
      { name: 'catchphrase', type: 'text' },
      { name: 'nearestStation', type: 'text', required: true },
      { name: 'minPeople', type: 'number', required: true },
      { name: 'maxPeople', type: 'number' },
      { name: 'recommendedFor1', type: 'text' },
      { name: 'recommendedFor2', type: 'text' },
      { name: 'instagramUrl', type: 'text', required: true },
      //  TODO: ここも中間テーブルの回収が必要
      // { name: 'instagramEmbeds', type: 'text' },
      { name: 'spotType', type: 'select', required: true, enumKey: 'SpotTypeEnum' },
      { name: 'budgetRange', type: 'select', required: true, enumKey: 'BudgetRangeEnum' },
      { name: 'themes', type: 'multiSelect', required: false, relationModel: 'themes' }, //TODO: マスタ登録必要 (CRUD)
      { name: 'categories', type: 'multiSelect', required: true, relationModel: 'categories' },
      { name: 'hashtags', type: 'multiSelect', required: true, relationModel: 'hashtags' },
      { name: 'spotAmbiances', type: 'multiSelect', required: true, relationModel: 'spot_ambiances' },
      { name: 'purposes', type: 'multiSelect', required: true, relationModel: 'purposes' },
      { name: 'menus', type: 'multiSelect', required: true, relationModel: 'menus' },
      { name: 'areas', type: 'multiSelect', required: true, relationModel: 'areas' },
      { name: 'isRainyOk', type: 'boolean', required: true },
      { name: 'isClosed', type: 'boolean', required: true },
      { name: 'parkingAvailable', type: 'boolean' },
      // Google Places API関連フィールド
      { name: 'googlePlaceId', type: 'text' },
      { name: 'latitude', type: 'number' },
      { name: 'longitude', type: 'number' },
      { name: 'reviewRating', type: 'number' },
      { name: 'reviewCount', type: 'number' },
      { name: 'businessStatus', type: 'select' },
      { name: 'priceLevel', type: 'select' },
      { name: 'primaryType', type: 'text' },
      { name: 'primaryTypeDisplayName', type: 'text' },
      { name: 'internationalPhoneNumber', type: 'text' },
      { name: 'shortFormattedAddress', type: 'text' },
      { name: 'googleMapsUri', type: 'text' },
      { name: 'googleTypes', type: 'textarea' },
      { name: 'generativeSummary', type: 'textarea' },
      { name: 'editorialSummary', type: 'textarea' },
      { name: 'priceRangeStartAmount', type: 'number' },
      { name: 'priceRangeEndAmount', type: 'number' },
      { name: 'pureServiceAreaBusiness', type: 'boolean' },

      // サービス提供情報
      { name: 'takeout', type: 'boolean' },
      { name: 'delivery', type: 'boolean' },
      { name: 'dineIn', type: 'boolean' },
      { name: 'reservable', type: 'boolean' },
      { name: 'servesBreakfast', type: 'boolean' },
      { name: 'servesLunch', type: 'boolean' },
      { name: 'servesDinner', type: 'boolean' },
      { name: 'servesBrunch', type: 'boolean' },
      { name: 'servesBeer', type: 'boolean' },
      { name: 'servesWine', type: 'boolean' },
      { name: 'servesVegetarianFood', type: 'boolean' },
      { name: 'outdoorSeating', type: 'boolean' },
      { name: 'liveMusic', type: 'boolean' },
      { name: 'menuForChildren', type: 'boolean' },
      { name: 'servesCocktails', type: 'boolean' },
      { name: 'servesDessert', type: 'boolean' },
      { name: 'servesCoffee', type: 'boolean' },
      { name: 'goodForChildren', type: 'boolean' },
      { name: 'allowsDogs', type: 'boolean' },
      { name: 'restroom', type: 'boolean' },
      { name: 'goodForGroups', type: 'boolean' },
      { name: 'goodForWatchingSports', type: 'boolean' },

      // Payment Options
      { name: 'acceptsCreditCards', type: 'boolean' },
      { name: 'acceptsDebitCards', type: 'boolean' },
      { name: 'acceptsCashOnly', type: 'boolean' },
      { name: 'acceptsNfc', type: 'boolean' },

      // Parking Options
      { name: 'freeParkingLot', type: 'boolean' },
      { name: 'paidParkingLot', type: 'boolean' },
      { name: 'freeStreetParking', type: 'boolean' },
      { name: 'paidStreetParking', type: 'boolean' },
      { name: 'valetParking', type: 'boolean' },
      { name: 'freeGarageParking', type: 'boolean' },
      { name: 'paidGarageParking', type: 'boolean' },

      // 営業時間
      { name: 'openingHours', type: 'opening_hours_editor' },

      // 雑誌掲載情報
      { name: 'spotMagazines', type: 'spot_magazines_editor' },

      // 関連データ
      // { name: 'menu', type: 'multirelation', labelField: 'menuName' },
      // { name: 'purpose', type: 'relation', modelName: 'Purpose', labelField: 'purposeName' },
      { name: 'district', type: 'relation' },
      { name: 'images', type: 'image_upload' },
    ],
    filters: [
      { name: 'district', label: '地区', model: 'districts', labelField: 'districtName' },
      { name: 'categories', label: 'カテゴリー', model: 'categories', labelField: 'name' },
      { name: 'areas', label: 'エリア', model: 'areas', labelField: 'areaName' },
    ],
  },
  play_plans: {
    columns: [
      { header: 'ID', accessorKey: 'id', sortable: true },
      { header: '名前', accessorKey: 'planName', sortable: true },
      { header: 'ステータス', accessorKey: 'status', sortable: true },
      { header: '作成者', accessorKey: 'user.username', sortable: false },
    ],
    fields: [
      { name: 'planName', type: 'text', required: true },
      { name: 'description', type: 'textarea', required: false },
      { name: 'imageUrl', type: 'text', required: false },
      { name: 'location', type: 'text', required: false },
      { name: 'tripType', type: 'select', required: false, enumKey: 'TripTypeEnum' },
      { name: 'totalBudget', type: 'number', required: false },
      { name: 'rating', type: 'number', required: false },
      { name: 'reviewCount', type: 'number', required: false },
      { name: 'favoriteCount', type: 'number', required: false },
      { name: 'plannerDescription', type: 'textarea', required: false },
      { name: 'status', type: 'select', required: true, enumKey: 'StatusEnum' },
      { name: 'publishedAt', type: 'datetime', required: false },
      { name: 'startDatetime', type: 'datetime', required: false },
      { name: 'endDatetime', type: 'datetime', required: false },
      // { name: 'tags', type: 'multiSelect', required: false }, //タグ
      {
        name: 'planDetails',
        type: 'childModel',
        childModel: 'planDetail',
        fields: [
          { name: 'stepNumber', type: 'number', required: true },
          { name: 'stepName', type: 'text', required: true },
          { name: 'stepDescription', type: 'textarea', required: false },
          { name: 'startDatetime', type: 'datetime', required: false },
          { name: 'endDatetime', type: 'datetime', required: false },
          { name: 'budget', type: 'number', required: false },
          { name: 'comment', type: 'textarea', required: false },
          { name: 'notes', type: 'textarea', required: false },
          { name: 'spot', type: 'relation', required: false }, //スポット
        ]
      }
    ],
  },
  events: {
    columns: [
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
    fields: [
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
    ],
  },
  news: {
    columns: [
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
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'body', type: 'textarea', required: true },
      { name: 'publishedAt', type: 'datetime', required: true },
      { name: 'status', type: 'select', required: true, enumKey: 'StatusEnum' },
      { name: 'imageUrl', type: 'text' },
      { name: 'category', type: 'relation' },
      { name: 'author', type: 'relation' },
    ],
  },
  stations: {
    columns: [
      { header: 'ID', accessorKey: 'id', sortable: true },
      { header: '駅名', accessorKey: 'name', sortable: true },
      { header: '説明', accessorKey: 'description', sortable: false },
      { header: '有効', accessorKey: 'active', sortable: true },
    ],
    fields: [
      { name: 'menuName', type: 'text', required: true },
      { name: 'price', type: 'number' },
      { name: 'description', type: 'textarea' },
      { name: 'menuCategory', type: 'relation', required: false },
    ],
    filters: [
      { name: 'menuCategory', label: 'メニューカテゴリー', model: 'menuCategories', labelField: 'name' },
    ],
  },
  menuCategories: {
    columns: [
      { header: 'ID', accessorKey: 'id', sortable: true },
      { header: '名前', accessorKey: 'name', sortable: true },
    ],
    fields: [
      { name: 'name', type: 'text', required: true },
    ],
  },
  magazines: {
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
        cell: (item) => formatDateTimeToJapanese(item.releaseDate as string)
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
  },
  direction_cards: {
    columns: [
      { header: 'ID', accessorKey: 'id', sortable: true },
      { header: 'テキスト', accessorKey: 'text', sortable: true },
      { header: 'タグ', accessorKey: 'tags', sortable: false },
      { header: '重み', accessorKey: 'weight', sortable: true },
      {
        header: 'アクティブ',
        accessorKey: 'active',
        sortable: true,
        cell: (item) => item.active ? '✓' : '✗'
      }
    ],
    fields: [],
  },
  layout_buckets: {
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
  },
  bucket_list_items: {
    columns: [
      { header: 'ID', accessorKey: 'id', sortable: true },
      { header: 'タイトル', accessorKey: 'title', sortable: true },
      { header: 'エリア', accessorKey: 'areaText', sortable: false },
      { header: '天気', accessorKey: 'weather', sortable: true },
      { header: 'ステータス', accessorKey: 'status', sortable: true },
      {
        header: '公開日',
        accessorKey: 'publishedAt',
        sortable: true,
        cell: (item) => item.publishedAt ? formatDateTimeToJapanese(item.publishedAt as string) : '-'
      },
    ],
    fields: [
      { name: 'layoutBucketId', type: 'multiSelect', required: true, relationModel: 'layout_buckets' },
      { name: 'title', type: 'textarea', required: true },
      { name: 'content', type: 'textarea', required: false },
      { name: 'areaText', type: 'text', required: false },
      { name: 'meetingPlaceName', type: 'text', required: false },
      { name: 'meetingPlaceAddress', type: 'text', required: false },
      { name: 'meetingPlaceGooglePlaceId', type: 'text', required: false },
      { name: 'stayMinutes', type: 'number', required: false },
      { name: 'meetingTime', type: 'time', required: false },
      { name: 'startTime', type: 'time', required: false },
      { name: 'endTime', type: 'time', required: false },
      { name: 'costMin', type: 'number', required: false },
      { name: 'costMax', type: 'number', required: false },
      { name: 'weather', type: 'select', required: true, enumKey: 'WeatherEnum' },
      { name: 'status', type: 'select', required: true, enumKey: 'BucketListItemStatusEnum' },
      { name: 'bucket_list_item_belongings', type: 'belongings_editor' },
      { name: 'bucket_list_item_references', type: 'references_editor' },
      { name: 'publishedAt', type: 'datetime', required: false },
    ],
  },
  experience_cards: {
    columns: [
      { header: 'ID', accessorKey: 'id', sortable: true },
      { header: 'タイトル', accessorKey: 'title', sortable: true },
      { header: 'タグ', accessorKey: 'tags', sortable: false },
      { header: 'エリア', accessorKey: 'area', sortable: true },
      { header: '所要時間', accessorKey: 'duration', sortable: true },
      {
        header: 'アクティブ',
        accessorKey: 'active',
        sortable: true,
        cell: (item) => item.active ? '✓' : '✗'
      },
    ],
    fields: [
      { name: 'title', type: 'text', required: true },
      { name: 'body', type: 'textarea' },
      { name: 'tags', type: 'text' },
      { name: 'area', type: 'text' },
      { name: 'duration', type: 'number' },
      { name: 'timeSlot', type: 'text' },
      { name: 'active', type: 'boolean' },
      { name: 'publishedAt', type: 'datetime', required: false },
    ],
    filters: [
      { name: 'weather', label: '天気', model: 'bucket_list_items', labelField: 'weather' },
      { name: 'status', label: 'ステータス', model: 'bucket_list_items', labelField: 'status' },
    ],
  },
};

// フィールド名の日本語表示
export const fieldDisplayNames: Record<string, string> = {
  image: '画像',
  imageFilename: '画像',
  areaName: 'エリア名',
  district: '地区',
  name: '名前',
  districtName: '地区名',
  hashtagName: 'ハッシュタグ名',
  menuName: 'メニュー名',
  purposeName: '目的名',
  ambianceName: '雰囲気名',
  spotName: 'スポット名',
  description: '説明',
  address: '住所',
  phoneNumber: '電話番号',
  instagramUrl: 'Instagram URL',
  website: 'ウェブサイト',
  catchphrase: 'キャッチフレーズ',
  isRainyOk: '雨天可',
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
  menuCategory: 'メニューカテゴリー',
  eventCategoryId: 'イベントカテゴリー',
  isOnline: 'オンラインイベント',
  sourceUrl: '外部リンク',
  bannerImage: 'バナー画像',
  organizer: '主催者',
  contactEmail: '連絡先メールアドレス',
  contactPhone: '連絡先電話番号',
  // PlanDetail関連のフィールド
  planDetails: 'プラン詳細',
  stepNumber: 'ステップ番号',
  stepName: 'ステップ名',
  stepDescription: 'ステップ説明',
  budget: '予算',
  spotId: 'スポット',
  comment: 'コメント',
  notes: 'メモ',

  // サービス提供情報
  takeout: 'テイクアウト可',
  delivery: 'デリバリー可',
  dineIn: '店内飲食可',
  reservable: '予約可',
  servesBreakfast: '朝食可',
  servesLunch: 'ランチ可',
  servesDinner: 'ディナー可',
  servesBrunch: 'ブランチ可',
  servesBeer: 'ビール可',
  servesWine: 'ワイン可',
  servesVegetarianFood: 'ベジタリアン料理可',
  outdoorSeating: '屋外席可',
  liveMusic: 'ライブ音楽可',
  menuForChildren: '子供向けメニュー可',
  servesCocktails: 'カクテル可',
  servesDessert: 'デザート可',
  servesCoffee: 'コーヒー可',
  goodForChildren: '子供連れにおすすめ',
  allowsDogs: '犬同伴可',
  restroom: 'トイレ可',
  goodForGroups: 'グループ向けへのおすすめ',
  goodForWatchingSports: 'スポーツ観戦におすすめ',

  // Payment Options
  acceptsCreditCards: 'クレジットカード可',
  acceptsDebitCards: 'デビットカード可',
  acceptsCashOnly: '現金のみ',
  acceptsNfc: 'NFC決済可',

  // Parking Options
  freeParkingLot: '無料駐車場',
  paidParkingLot: '有料駐車場',
  freeStreetParking: '無料路上駐車',
  paidStreetParking: '有料路上駐車',
  valetParking: 'バレーパーキング',
  freeGarageParking: '無料ガレージ駐車',
  paidGarageParking: '有料ガレージ駐車',

  // Google Places API 詳細フィールド
  latitude: '緯度',
  longitude: '経度',
  businessStatus: '営業ステータス',
  priceLevel: '価格帯',
  primaryType: 'プライマリタイプ',
  primaryTypeDisplayName: 'プライマリタイプ名',
  internationalPhoneNumber: '国際電話番号',
  shortFormattedAddress: '短縮フォーマット住所',
  googleMapsUri: 'Google Maps URI',
  googleTypes: 'Google業種リスト',
  adrFormatAddress: 'ADRフォーマット住所',
  generativeSummary: 'AI要約',
  editorialSummary: '店舗の紹介(詳細)',
  priceRangeStartAmount: '価格下限',
  priceRangeEndAmount: '価格上限',
  lastApiSyncAt: '最終API同期日時',
  apiSyncStatus: 'API同期ステータス',
  // Magazine
  spotMagazines: '雑誌掲載情報',
  publicationFeature: '掲載特集',
  pageNumber: '掲載ページ',
  publisher: '出版社',
  issueNumber: '号数',
  releaseDate: '発売日',
  salesInfo: '販売情報',
  salesUrl: '販売URL',
  coverImageUrl: '表紙画像URL',
  // Direction Card / Experience Card
  text: 'テキスト',
  tags: 'タグ',
  weight: '重み',
  active: 'アクティブ',
  body: '本文',
  area: 'エリア',
  duration: '所要時間（分）',
  timeSlot: '時間帯',

  // Layout Bucket関連
  key: 'キー',
  templateKey: 'テンプレート識別子',
  themeKey: 'テーマ識別子',
  shift: 'ズレ方向',
  tilt: '傾き',
  depth: '奥行き表現',
  sortOrder: '表示順',

  // Bucket List Item関連
  layoutBucketId: 'レイアウトバケット',
  areaText: '抽象エリア名',
  meetingPlaceName: '集合場所名',
  meetingPlaceAddress: '集合場所住所',
  meetingPlaceGooglePlaceId: 'Google Place ID',
  stayMinutes: '滞在時間（分）',
  meetingTime: '集合時間',
  startTime: '開始時間',
  endTime: '終了時間',
  costMin: '最小費用（円）',
  costMax: '最大費用（円）',
  weather: '推奨天気',
  bucketListItemBelongings: 'もちもの一覧',
  bucketListItemReferences: '参考リンク一覧',
  content: 'コンテンツ',
};
