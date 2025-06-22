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

/**
 * モデルのフィールド定義
 */
export interface ModelField {
  name: string;
  type: string;
  required?: boolean;
  isRelation?: boolean;
  relationModel?: string;
}

/**
 * モデルごとのフィールド定義
 */
export const modelFields: Record<string, ModelField[]> = {
  areas: [
    { name: 'id', type: 'ID', required: true },
    { name: 'areaName', type: 'String', required: true },
    { name: 'district', type: 'District', required: true, isRelation: true, relationModel: 'District' },
    { name: 'createdAt', type: 'ISO8601DateTime' },
    { name: 'updatedAt', type: 'ISO8601DateTime' },
  ],
  categories: [
    { name: 'id', type: 'ID', required: true },
    { name: 'name', type: 'String', required: true },
    { name: 'createdAt', type: 'ISO8601DateTime' },
    { name: 'updatedAt', type: 'ISO8601DateTime' },
  ],
  districts: [
    { name: 'id', type: 'ID', required: true },
    { name: 'districtName', type: 'String', required: true },
    { name: 'createdAt', type: 'ISO8601DateTime' },
    { name: 'updatedAt', type: 'ISO8601DateTime' },
  ],
  hashtags: [
    { name: 'id', type: 'ID', required: true },
    { name: 'hashtagName', type: 'String', required: true },
    { name: 'createdAt', type: 'ISO8601DateTime' },
    { name: 'updatedAt', type: 'ISO8601DateTime' },
  ],
  menus: [
    { name: 'id', type: 'ID', required: true },
    { name: 'menuName', type: 'String', required: true },
    { name: 'description', type: 'String' },
    { name: 'price', type: 'Float' },
    { name: 'createdAt', type: 'ISO8601DateTime' },
    { name: 'updatedAt', type: 'ISO8601DateTime' },
  ],
  purposes: [
    { name: 'id', type: 'ID', required: true },
    { name: 'purposeName', type: 'String', required: true },
    { name: 'createdAt', type: 'ISO8601DateTime' },
    { name: 'updatedAt', type: 'ISO8601DateTime' },
  ],
  recommended_fors: [
    { name: 'id', type: 'ID', required: true },
    { name: 'name', type: 'String', required: true },
    { name: 'createdAt', type: 'ISO8601DateTime' },
    { name: 'updatedAt', type: 'ISO8601DateTime' },
  ],
  spot_ambiances: [
    { name: 'id', type: 'ID', required: true },
    { name: 'ambianceName', type: 'String', required: true },
    { name: 'createdAt', type: 'ISO8601DateTime' },
    { name: 'updatedAt', type: 'ISO8601DateTime' },
  ],
  spots: [
    { name: 'id', type: 'ID', required: true },
    { name: 'spotName', type: 'String', required: true },
    { name: 'address', type: 'String' },
    { name: 'district', type: 'District', required: true, isRelation: true, relationModel: 'District' },
    { name: 'districtId', type: 'Int', required: true },
    { name: 'phoneNumber', type: 'String' },
    { name: 'website', type: 'String' },
    { name: 'catchphrase', type: 'String' },
    { name: 'isRainyOk', type: 'Boolean' },
    { name: 'budgetRange', type: 'String' },
    { name: 'areas', type: '[Area]', isRelation: true, relationModel: 'Area' },
    { name: 'categories', type: '[Category]', isRelation: true, relationModel: 'Category' },
    { name: 'hashtags', type: '[Hashtag]', isRelation: true, relationModel: 'Hashtag' },
    { name: 'menus', type: '[Menu]', isRelation: true, relationModel: 'Menu' },
    { name: 'purposes', type: '[Purpose]', isRelation: true, relationModel: 'Purpose' },
    { name: 'spotAmbiances', type: '[SpotAmbiance]', isRelation: true, relationModel: 'SpotAmbiance' },
    { name: 'createdAt', type: 'ISO8601DateTime' },
    { name: 'updatedAt', type: 'ISO8601DateTime' },
  ],
  play_plans: [
    { name: 'id', type: 'ID', required: true },
    { name: 'planName', type: 'String', required: true },
    { name: 'description', type: 'String' },
    { name: 'startDatetime', type: 'ISO8601DateTime' },
    { name: 'endDatetime', type: 'ISO8601DateTime' },
    { name: 'status', type: 'PlayPlanStatusEnum', required: true },
    { name: 'imageUrl', type: 'String' },
    { name: 'location', type: 'String' },
    { name: 'tags', type: 'String' },
    { name: 'totalBudget', type: 'Float' },
    { name: 'tripType', type: 'TripTypeEnum', required: true },
    { name: 'user', type: 'User', isRelation: true, relationModel: 'User' },
    { name: 'userId', type: 'Int' },
    { name: 'recommendedFors', type: '[RecommendedFor]', isRelation: true, relationModel: 'RecommendedFor' },
    { name: 'planDetails', type: '[PlanDetail]', isRelation: true, relationModel: 'PlanDetail' },
    { name: 'createdAt', type: 'ISO8601DateTime' },
    { name: 'updatedAt', type: 'ISO8601DateTime' },
  ],
  events: [
    { name: 'id', type: 'ID', required: true },
    { name: 'title', type: 'String', required: true },
    { name: 'description', type: 'String', required: true },
    { name: 'location', type: 'String', required: true },
    { name: 'eventCategoryId', type: 'Int', required: true },
    { name: 'startDatetime', type: 'ISO8601DateTime', required: true },
    { name: 'endDatetime', type: 'ISO8601DateTime', required: true },
    { name: 'eventCategory', type: 'EventCategory', isRelation: true, relationModel: 'EventCategory' },
    { name: 'eventCategoryId', type: 'Int', required: true },
    { name: 'sourceUrl', type: 'String' },
    { name: 'createdAt', type: 'ISO8601DateTime' },
    { name: 'updatedAt', type: 'ISO8601DateTime' },
  ],
  news: [
    { name: 'id', type: 'ID', required: true },
    { name: 'title', type: 'String', required: true },
    { name: 'body', type: 'String', required: true },
    { name: 'imageUrl', type: 'String' },
    { name: 'status', type: 'String', required: true },
    { name: 'publishedAt', type: 'ISO8601DateTime' },
    { name: 'author', type: 'User', isRelation: true, relationModel: 'User' },
    { name: 'category', type: 'Category', isRelation: true, relationModel: 'Category' },
    { name: 'createdAt', type: 'ISO8601DateTime' },
    { name: 'updatedAt', type: 'ISO8601DateTime' },
  ],
};

/**
 * モデルごとのGraphQLクエリフラグメントを生成
 */
export const generateModelFragment = (modelRoute: string): string => {
  const fields = modelFields[modelRoute];
  if (!fields) return '';

  const modelName = getModelNameFromRoute(modelRoute);
  if (!modelName) return '';

  const fieldFragments = fields.map(field => {
    if (field.isRelation) {
      // リレーション先のモデルに応じたフラグメントを生成
      if (field.name === 'district') {
        return `${field.name} { id districtName }`;
      } else if (field.name === 'user') {
        return `${field.name} { id username }`;
      } else if (field.name === 'eventCategory') {
        return `${field.name} { id name }`;
      } else if (field.name === 'category') {
        return `${field.name} { id name }`;
      } else if (field.name === 'author') {
        return `${field.name} { id username }`;
      } else if (field.type.startsWith('[')) {
        // 配列の場合は簡易的なフラグメントを返す
        return `${field.name} { id }`;
      }
      return `${field.name} { id }`;
    }
    return field.name;
  });

  return `
    fragment ${modelName}Fragment on ${modelName} {
      ${fieldFragments.join('\n      ')}
    }
  `;
};

/**
 * モデル一覧取得用のGraphQLクエリを生成
 */
export const generateListQuery = (modelRoute: string): string => {
  const modelName = getModelNameFromRoute(modelRoute);
  if (!modelName) return '';

  const fragment = generateModelFragment(modelRoute);
  const queryName = modelRoute; // GraphQLスキーマのクエリ名（複数形）

  return `
    ${fragment}

    query Get${modelName}List($limit: Int, $sortField: String, $sortDirection: String) {
      ${queryName}(limit: $limit, sortField: $sortField, sortDirection: $sortDirection) {
        ...${modelName}Fragment
      }
    }
  `;
};

/**
 * モデル詳細取得用のGraphQLクエリを生成
 */
export const generateDetailQuery = (modelRoute: string): string => {
  const modelName = getModelNameFromRoute(modelRoute);
  if (!modelName) return '';

  const fragment = generateModelFragment(modelRoute);
  const queryName = modelRoute.slice(0, -1); // 単数形に変換（簡易的な方法）

  return `
    ${fragment}

    query Get${modelName}Detail($id: ID!) {
      ${queryName}(id: $id) {
        ...${modelName}Fragment
      }
    }
  `;
};

/**
 * モデル作成用のGraphQLミューテーションを生成
 */
export const generateCreateMutation = (modelRoute: string): string => {
  const modelName = getModelNameFromRoute(modelRoute);
  if (!modelName) return '';

  const fragment = generateModelFragment(modelRoute);

  return `
    ${fragment}

    mutation Create${modelName}($input: Create${modelName}Input!) {
      create${modelName}(input: $input) {
        ${modelRoute.slice(0, -1)}
        errors
      }
    }
  `;
};

/**
 * モデル更新用のGraphQLミューテーションを生成
 */
export const generateUpdateMutation = (modelRoute: string): string => {
  const modelName = getModelNameFromRoute(modelRoute);
  if (!modelName) return '';

  const fragment = generateModelFragment(modelRoute);

  return `
    ${fragment}

    mutation Update${modelName}($input: Update${modelName}Input!) {
      update${modelName}(input: $input) {
        ${modelRoute.slice(0, -1)}
        errors
      }
    }
  `;
};

/**
 * モデル削除用のGraphQLミューテーションを生成
 */
export const generateDeleteMutation = (modelRoute: string): string => {
  const modelName = getModelNameFromRoute(modelRoute);
  if (!modelName) return '';

  return `
    mutation Delete${modelName}($id: ID!) {
      delete${modelName}(id: $id) {
        success
        errors
      }
    }
  `;
};
