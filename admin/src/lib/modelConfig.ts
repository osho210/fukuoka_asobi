/**
 * モデル設定の共通型定義と設定取得関数
 */
import React from 'react';

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
  modelName?: string;
  labelField?: string;
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

/**
 * モデル名の日本語表示を取得
 */
export function getModelDisplayName(modelName: string): string {
  return modelDisplayNames[modelName] || modelName;
}

/**
 * フィールド名の日本語表示マッピング
 */
export const fieldDisplayNames: Record<string, string> = {
  areaName: 'エリア名',
  district: '地区',
  name: '名前',
  districtName: '地区名',
  hashtagName: 'ハッシュタグ名',
  menuName: 'メニュー名',
  purposeName: '目的名',
  ambianceName: '雰囲気名',
};

/**
 * フィールド名の日本語表示を取得
 */
export function getFieldDisplayName(fieldName: string): string {
  return fieldDisplayNames[fieldName] || fieldName;
}
