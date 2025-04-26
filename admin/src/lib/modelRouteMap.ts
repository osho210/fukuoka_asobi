/**
 * モデル名とルート名の対応を定義
 *
 * 例:
 * - モデル名: Area -> ルート名: areas
 * - モデル名: Category -> ルート名: categories
 */
export const modelRouteMap: Record<string, string> = {
  // 単純マスタ
  'Area': 'areas',
  'Category': 'categories',
  'District': 'districts',
  'Hashtag': 'hashtags',
  'Menu': 'menus',
  'Purpose': 'purposes',
  'RecommendedFor': 'recommended_fors',
  'SpotAmbiance': 'spot_ambiances',

  // 中間テーブル
  'SpotCategory': 'spot_categories',
  'SpotArea': 'spot_areas',
  'SpotHashtag': 'spot_hashtags',
  'SpotMenu': 'spot_menus',
  'SpotPurpose': 'spot_purposes',
  'SpotAmbianceRelation': 'spot_ambiance_relations',

  // ドメインデータ
  'Spot': 'spots',
  'OpeningHour': 'opening_hours',
  'PlayPlan': 'play_plans',
  'PlanDetail': 'plan_details',
  'Event': 'events',
  'EventCategory': 'event_categories',
  'News': 'news',
  'InstagramEmbed': 'instagram_embeds',
  'TravelDetail': 'travel_details',
  'Bookmark': 'bookmarks',
  'Favorite': 'favorites',
};

/**
 * ルート名からモデル名を取得
 */
export const getModelNameFromRoute = (route: string): string | undefined => {
  const entries = Object.entries(modelRouteMap);
  const entry = entries.find(([, value]) => value === route);
  return entry ? entry[0] : undefined;
};

/**
 * モデル名からルート名を取得
 */
export const getRouteFromModelName = (modelName: string): string | undefined => {
  return modelRouteMap[modelName];
};
