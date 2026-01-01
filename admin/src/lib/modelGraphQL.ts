import { apolloClient } from '@/lib/apolloClient';
import { getModelNameFromRoute } from './modelRouteMap';
import { toCamelCase } from '@/app/utils/stringUtils';
import { omitTypename } from '@/app/utils/omitTypename';
import { PlanDetailInput } from '@/__generated__/graphql';

// クエリのインポート
import { GET_AREAS } from '@/graphql/queries/getAreas';
import { GET_CATEGORIES } from '@/graphql/queries/getCategories';
import { GET_DISTRICTS } from '@/graphql/queries/getDistricts';
import { GET_HASHTAGS } from '@/graphql/queries/getHashtags';
import { GET_MENUS } from '@/graphql/queries/getMenus';
import { GET_PURPOSES, } from '@/graphql/queries/getPurposes';
import { GET_RECOMMENDED_FORS, } from '@/graphql/queries/getRecommendedFors';
import { GET_SPOT_AMBIANCES, } from '@/graphql/queries/getSpotAmbiances';
import { GET_PLAY_PLANS } from '@/graphql/queries/getPlayPlans';
import { GET_SPOTS } from '@/graphql/queries/getSpots';
import { GET_EVENTS } from '@/graphql/queries/getEvents';
import { GET_EVENT_CATEGORIES } from '@/graphql/queries/getEventCategories';
import { GET_NEWS } from '@/graphql/queries/getNews';
import { GET_STATIONS } from '@/graphql/queries/getStations';
import { GET_MENU_CATEGORIES } from '@/graphql/queries/getMenuCategories';
import { FilterField } from './modelConstants';
import { GET_MAGAZINES } from '@/graphql/queries/getMagazines';
import { GET_ALL_DIRECTION_CARDS } from '@/graphql/queries/getDirectionCards';
import { GET_ALL_EXPERIENCE_CARDS } from '@/graphql/queries/getExperienceCards';
import { GET_BUCKET_LIST_ITEMS } from '@/graphql/queries/getBucketListItems';
import { GET_LAYOUT_BUCKETS } from '@/graphql/queries/getLayoutBuckets';


// ミューテーションのインポート
import { CREATE_AREA, UPDATE_AREA, DELETE_AREA } from '@/graphql/mutations/areas';
import { CREATE_CATEGORY, UPDATE_CATEGORY, DELETE_CATEGORY } from '@/graphql/mutations/categories';
import { CREATE_DISTRICT, UPDATE_DISTRICT, DELETE_DISTRICT } from '@/graphql/mutations/districts';
import { CREATE_HASHTAG, UPDATE_HASHTAG, DELETE_HASHTAG } from '@/graphql/mutations/hashtags';
import { CREATE_MENU, UPDATE_MENU, DELETE_MENU } from '@/graphql/mutations/menus';
import { CREATE_PURPOSE, UPDATE_PURPOSE, DELETE_PURPOSE } from '@/graphql/mutations/purposes';
import { CREATE_RECOMMENDED_FOR, UPDATE_RECOMMENDED_FOR, DELETE_RECOMMENDED_FOR } from '@/graphql/mutations/recommendedFors';
import { CREATE_SPOT_AMBIANCE, UPDATE_SPOT_AMBIANCE, DELETE_SPOT_AMBIANCE } from '@/graphql/mutations/spotAmbiances';
import { UPDATE_EVENT, CREATE_EVENT } from '@/graphql/mutations/events';
import { UPDATE_NEWS, CREATE_NEWS } from '@/graphql/mutations/news';
import { UPDATE_PLAN_DETAILS } from '@/graphql/mutations/updatePlanDetails';
import { UPDATE_PLAY_PLAN, processPlanDetailsForInput, PlanDetailWithSpot } from '@/graphql/mutations/planPlans';
import { CREATE_MAGAZINE, UPDATE_MAGAZINE } from '@/graphql/mutations/magazines';
import { CREATE_DIRECTION_CARD, UPDATE_DIRECTION_CARD, DELETE_DIRECTION_CARD } from '@/graphql/mutations/directionCards';
import { CREATE_EXPERIENCE_CARD, UPDATE_EXPERIENCE_CARD, DELETE_EXPERIENCE_CARD } from '@/graphql/mutations/experienceCards';
import { CREATE_BUCKET_LIST_ITEM, UPDATE_BUCKET_LIST_ITEM } from "@/graphql/mutations/bucketListItems";
import { CREATE_LAYOUT_BUCKET, UPDATE_LAYOUT_BUCKET } from '@/graphql/mutations/layoutBuckets';

import {
  CREATE_SPOT,
  UPDATE_SPOT,
  DELETE_SPOT,
  ADD_SPOT_AREA,
  REMOVE_SPOT_AREA,
  ADD_SPOT_CATEGORY,
  REMOVE_SPOT_CATEGORY,
  ADD_SPOT_HASHTAG,
  REMOVE_SPOT_HASHTAG,
  ADD_SPOT_MENU,
  REMOVE_SPOT_MENU,
  ADD_SPOT_PURPOSE,
  REMOVE_SPOT_PURPOSE,
  ADD_SPOT_AMBIANCE,
  REMOVE_SPOT_AMBIANCE
} from '@/graphql/mutations/spots';

export type ModelInput = {
  [key: string]: string | number | boolean | null | string[] | number[] | PlanDetailWithSpot[] | Record<string, unknown>[];
};

// GraphQLクエリの型定義
import { DocumentNode } from 'graphql';
import { DELETE_STATION, UPDATE_STATION } from '@/graphql/mutations/station';

// クエリマッピング
const listQueries: Record<string, DocumentNode> = {
  areas: GET_AREAS,
  categories: GET_CATEGORIES,
  districts: GET_DISTRICTS,
  hashtags: GET_HASHTAGS,
  menus: GET_MENUS,
  purposes: GET_PURPOSES,
  recommended_fors: GET_RECOMMENDED_FORS,
  spot_ambiances: GET_SPOT_AMBIANCES,
  play_plans: GET_PLAY_PLANS,
  spots: GET_SPOTS,
  events: GET_EVENTS,
  eventCategories: GET_EVENT_CATEGORIES,
  news: GET_NEWS,
  stations: GET_STATIONS,
  menuCategories: GET_MENU_CATEGORIES,
  magazines: GET_MAGAZINES,
  direction_cards: GET_ALL_DIRECTION_CARDS,
  experience_cards: GET_ALL_EXPERIENCE_CARDS
  bucket_list_items: GET_BUCKET_LIST_ITEMS,
  layout_buckets: GET_LAYOUT_BUCKETS
};

// ミューテーションマッピング
const createMutations: Record<string, DocumentNode> = {
  areas: CREATE_AREA,
  categories: CREATE_CATEGORY,
  districts: CREATE_DISTRICT,
  hashtags: CREATE_HASHTAG,
  menus: CREATE_MENU,
  purposes: CREATE_PURPOSE,
  recommended_fors: CREATE_RECOMMENDED_FOR,
  spot_ambiances: CREATE_SPOT_AMBIANCE,
  spots: CREATE_SPOT,
  events: CREATE_EVENT,
  news: CREATE_NEWS,
  magazines: CREATE_MAGAZINE,
  direction_cards: CREATE_DIRECTION_CARD,
  experience_cards: CREATE_EXPERIENCE_CARD
  bucket_list_items: CREATE_BUCKET_LIST_ITEM,
  layout_buckets: CREATE_LAYOUT_BUCKET,
};

const updateMutations: Record<string, DocumentNode> = {
  areas: UPDATE_AREA,
  categories: UPDATE_CATEGORY,
  districts: UPDATE_DISTRICT,
  hashtags: UPDATE_HASHTAG,
  menus: UPDATE_MENU,
  purposes: UPDATE_PURPOSE,
  recommended_fors: UPDATE_RECOMMENDED_FOR,
  spot_ambiances: UPDATE_SPOT_AMBIANCE,
  spots: UPDATE_SPOT,
  stations: UPDATE_STATION,
  events: UPDATE_EVENT,
  news: UPDATE_NEWS,
  play_plans: UPDATE_PLAY_PLAN,
  magazines: UPDATE_MAGAZINE,
  direction_cards: UPDATE_DIRECTION_CARD,
  experience_cards: UPDATE_EXPERIENCE_CARD
  bucket_list_items: UPDATE_BUCKET_LIST_ITEM,
  layout_buckets: UPDATE_LAYOUT_BUCKET,
};

const deleteMutations: Record<string, DocumentNode> = {
  areas: DELETE_AREA,
  categories: DELETE_CATEGORY,
  districts: DELETE_DISTRICT,
  hashtags: DELETE_HASHTAG,
  menus: DELETE_MENU,
  purposes: DELETE_PURPOSE,
  recommended_fors: DELETE_RECOMMENDED_FOR,
  spot_ambiances: DELETE_SPOT_AMBIANCE,
  spots: DELETE_SPOT,
  stations: DELETE_STATION,
  direction_cards: DELETE_DIRECTION_CARD,
  experience_cards: DELETE_EXPERIENCE_CARD
};

/**
 * モデル一覧を取得するためのGraphQLクエリを実行
 * @param modelRoute モデルのルート名（例: 'areas', 'categories'）
 * @param variables クエリ変数（limit, sortField, sortDirection）
 * @returns クエリ結果
 */
export const fetchModelList = async (
  modelRoute: string,
  variables: {
    limit?: number;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
  } = {}
) => {
  const query = listQueries[modelRoute];
  if (!query) {
    throw new Error(`モデル ${modelRoute} のリストクエリが見つかりません`);
  }

  try {
    const response = await apolloClient.query({
      query,
      variables,
      fetchPolicy: 'network-only', // キャッシュを使わず常に最新データを取得
    });

    // レスポンスの構造を確認
    if (response.data) {
      return response.data[toCamelCase(modelRoute)];
    } else {
      console.error(`モデル ${modelRoute} のデータが見つかりません:`, response);
      return [];
    }
  } catch (error) {
    console.error(`モデル ${modelRoute} のリスト取得に失敗しました:`, error);
    throw error;
  }
};

/**
 * フィルター用の関連モデルの選択肢を取得
 * @param filterFields フィルターフィールド定義の配列
 * @returns モデル名をキーとした選択肢のオブジェクト
 */
export const fetchRelationOptions = async (
  filterFields: FilterField[]
): Promise<Record<string, { value: string; label: string }[]>> => {
  const options: Record<string, { value: string; label: string }[]> = {};

  for (const field of filterFields) {
    const query = listQueries[field.model];
    if (!query) {
      console.warn(`モデル ${field.model} のリストクエリが見つかりません`);
      continue;
    }

    try {
      const response = await apolloClient.query({
        query,
        fetchPolicy: 'cache-first',
      });

      if (response.data && response.data[field.model]) {
        options[field.model] = response.data[field.model].map((item: { [x: string]: unknown; id: unknown; }) => ({
          value: item.id,
          label: item[field.labelField],
        }));
      }
    } catch (error) {
      console.error(`モデル ${field.model} の選択肢取得に失敗しました:`, error);
    }
  }

  return options;
};
/**
 * モデルを作成するためのGraphQLミューテーションを実行
 *
 * @param modelRoute モデルのルート名（例: 'areas', 'categories'）
 * @param input 作成するモデルのデータ
 * @returns ミューテーション結果
 */
export const createModel = async (modelRoute: string, input: ModelInput) => {
  const mutation = createMutations[modelRoute];
  if (!mutation) {
    throw new Error(`モデル ${modelRoute} の作成ミューテーションが見つかりません`);
  }

  const modelName = getModelNameFromRoute(modelRoute);
  const mutationName = `create${modelName}`;

  try {
    // __typename を削除
    const cleanedInput = omitTypename(input);
    console.log('クリーンな入力データ:', cleanedInput);
    const { data } = await apolloClient.mutate({
      mutation,
      variables: { input: cleanedInput },
    });

    const result = data[mutationName];
    if (result?.errors && result.errors.length > 0) {
      throw new Error(result.errors.join(', '));
    }

    return result || null;
  } catch (error) {
    console.error(`モデル ${modelRoute} の作成に失敗しました:`, error);
    throw error;
  }
};

/**
 * モデルを更新するためのGraphQLミューテーションを実行
 *
 * @param modelRoute モデルのルート名（例: 'areas', 'categories'）
 * @param id 更新するモデルのID
 * @param input 更新するモデルのデータ
 * @returns ミューテーション結果
 */
export const updateModel = async (modelRoute: string, id: string, input: ModelInput) => {
  const mutation = updateMutations[modelRoute];
  if (!mutation) {
    throw new Error(`モデル ${modelRoute} の更新ミューテーションが見つかりません`);
  }

  const modelName = getModelNameFromRoute(modelRoute);
  const mutationName = `update${modelName}`;

  try {
    // __typename を削除
    const cleanedInput = omitTypename(input);

    // play_plansモデルの場合、planDetailsフィールドがあれば処理
    if (modelRoute === 'play_plans' && cleanedInput.planDetails) {

      // planDetailsフィールドをspotオブジェクトからspotIdに変換
      const processedPlanDetails = processPlanDetailsForInput(cleanedInput.planDetails as PlanDetailWithSpot[]);
      cleanedInput.planDetails = processedPlanDetails;
    }

    const { data } = await apolloClient.mutate({
      mutation,
      variables: { input: { id, ...cleanedInput } },
    });

    const result = data[mutationName];
    if (result?.errors && result.errors.length > 0) {
      throw new Error(result.errors.join(', '));
    }

    return result || null;
  } catch (error) {
    console.error(`モデル ${modelRoute} の更新に失敗しました:`, error);
    throw error;
  }
};

/**
 * モデルを削除するためのGraphQLミューテーションを実行
 *
 * @param modelRoute モデルのルート名（例: 'areas', 'categories'）
 * @param id 削除するモデルのID
 * @returns ミューテーション結果
 */
export const deleteModel = async (modelRoute: string, id: string) => {
  const mutation = deleteMutations[modelRoute];
  if (!mutation) {
    throw new Error(`モデル ${modelRoute} の削除ミューテーションが見つかりません`);
  }

  const modelName = getModelNameFromRoute(modelRoute);
  const mutationName = `delete${modelName}`;

  try {
    const { data } = await apolloClient.mutate({
      mutation,
      variables: { id },
    });

    return data[mutationName] || null;
  } catch (error) {
    console.error(`モデル ${modelRoute} の削除に失敗しました:`, error);
    throw error;
  }
};

/**
 * スポットに関連するエリアを追加
 */
export const addSpotArea = async (spotId: string, areaId: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_SPOT_AREA,
      variables: { spotId, areaId },
    });
    return data.addSpotArea;
  } catch (error) {
    console.error('スポットにエリアを追加できませんでした:', error);
    throw error;
  }
};

/**
 * スポットに関連するエリアを削除
 */
export const removeSpotArea = async (spotId: string, areaId: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_SPOT_AREA,
      variables: { spotId, areaId },
    });
    return data.removeSpotArea;
  } catch (error) {
    console.error('スポットからエリアを削除できませんでした:', error);
    throw error;
  }
};

/**
 * スポットに関連するカテゴリーを追加
 */
export const addSpotCategory = async (spotId: string, categoryId: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_SPOT_CATEGORY,
      variables: { spotId, categoryId },
    });
    return data.addSpotCategory;
  } catch (error) {
    console.error('スポットにカテゴリーを追加できませんでした:', error);
    throw error;
  }
};

/**
 * スポットに関連するカテゴリーを削除
 */
export const removeSpotCategory = async (spotId: string, categoryId: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_SPOT_CATEGORY,
      variables: { spotId, categoryId },
    });
    return data.removeSpotCategory;
  } catch (error) {
    console.error('スポットからカテゴリーを削除できませんでした:', error);
    throw error;
  }
};

/**
 * スポットに関連するハッシュタグを追加
 */
export const addSpotHashtag = async (spotId: string, hashtagId: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_SPOT_HASHTAG,
      variables: { spotId, hashtagId },
    });
    return data.addSpotHashtag;
  } catch (error) {
    console.error('スポットにハッシュタグを追加できませんでした:', error);
    throw error;
  }
};

/**
 * スポットに関連するハッシュタグを削除
 */
export const removeSpotHashtag = async (spotId: string, hashtagId: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_SPOT_HASHTAG,
      variables: { spotId, hashtagId },
    });
    return data.removeSpotHashtag;
  } catch (error) {
    console.error('スポットからハッシュタグを削除できませんでした:', error);
    throw error;
  }
};

/**
 * スポットに関連するメニューを追加
 */
export const addSpotMenu = async (spotId: string, menuId: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_SPOT_MENU,
      variables: { spotId, menuId },
    });
    return data.addSpotMenu;
  } catch (error) {
    console.error('スポットにメニューを追加できませんでした:', error);
    throw error;
  }
};

/**
 * スポットに関連するメニューを削除
 */
export const removeSpotMenu = async (spotId: string, menuId: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_SPOT_MENU,
      variables: { spotId, menuId },
    });
    return data.removeSpotMenu;
  } catch (error) {
    console.error('スポットからメニューを削除できませんでした:', error);
    throw error;
  }
};

/**
 * スポットに関連する目的を追加
 */
export const addSpotPurpose = async (spotId: string, purposeId: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_SPOT_PURPOSE,
      variables: { spotId, purposeId },
    });
    return data.addSpotPurpose;
  } catch (error) {
    console.error('スポットに目的を追加できませんでした:', error);
    throw error;
  }
};

/**
 * スポットに関連する目的を削除
 */
export const removeSpotPurpose = async (spotId: string, purposeId: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_SPOT_PURPOSE,
      variables: { spotId, purposeId },
    });
    return data.removeSpotPurpose;
  } catch (error) {
    console.error('スポットから目的を削除できませんでした:', error);
    throw error;
  }
};

/**
 * スポットに関連する雰囲気を追加
 */
export const addSpotAmbiance = async (spotId: string, ambianceId: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: ADD_SPOT_AMBIANCE,
      variables: { spotId, ambianceId },
    });
    return data.addSpotAmbiance;
  } catch (error) {
    console.error('スポットに雰囲気を追加できませんでした:', error);
    throw error;
  }
};

/**
 * スポットに関連する雰囲気を削除
 */
export const removeSpotAmbiance = async (spotId: string, ambianceId: string) => {
  try {
    const { data } = await apolloClient.mutate({
      mutation: REMOVE_SPOT_AMBIANCE,
      variables: { spotId, ambianceId },
    });
    return data.removeSpotAmbiance;
  } catch (error) {
    console.error('スポットから雰囲気を削除できませんでした:', error);
    throw error;
  }
};

// Re-export PlanDetailInput from generated types
export type { PlanDetailInput };

// spotフィールドを含むPlanDetailInputの拡張型
export interface PlanDetailInputWithSpot extends Partial<PlanDetailInput> {
  id?: string;
  spot?: {
    id: string;
    spotName?: string;
    [key: string]: unknown;
  };
}

/**
 * プラン詳細を更新するためのGraphQLミューテーションを実行
 *
 * @param planId プランID
 * @param planDetails 更新するプラン詳細の配列
 * @returns ミューテーション結果
 */
export const updatePlanDetails = async (planId: string, planDetails: (PlanDetailInput | PlanDetailInputWithSpot)[]) => {
  try {
    // planDetailsの各項目からspotフィールドを削除し、spotIdを設定
    const processedPlanDetails: PlanDetailInput[] = planDetails.map(detail => {
      // spotフィールドがある場合は削除
      const detailWithSpot = detail as PlanDetailInputWithSpot;
      if (detailWithSpot.spot) {
        // spotオブジェクトからspotIdを抽出し、spotフィールドを除外
        const { spot, ...processedDetail } = detailWithSpot;
        if (spot.id && !processedDetail.spotId) {
          processedDetail.spotId = spot.id;
        }
        return processedDetail as PlanDetailInput;
      }

      return detail as PlanDetailInput;
    });

    console.log('プラン詳細データの処理後:', processedPlanDetails);

    const { data } = await apolloClient.mutate({
      mutation: UPDATE_PLAN_DETAILS,
      variables: {
        input: {
          planId,
          planDetails: processedPlanDetails
        }
      },
    });
    return data.updatePlanDetails;
  } catch (error) {
    console.error('プラン詳細の更新に失敗しました:', error);
    throw error;
  }
};
