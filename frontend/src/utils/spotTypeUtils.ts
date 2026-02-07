/**
 * スポットタイプの定義
 */
export const SPOT_TYPE = {
  STORE: 'STORE',
  TOURIST_SPOT: 'TOURIST_SPOT',
  ACTIVITY: 'ACTIVITY',
} as const;

export type SpotType = (typeof SPOT_TYPE)[keyof typeof SPOT_TYPE];

/**
 * スポットタイプを日本語ラベルに変換する
 * @param spotType スポットタイプ（STORE、TOURIST_SPOT、ACTIVITY）
 * @returns 日本語ラベル
 */
export function getSpotTypeLabel(spotType: string): string {
  if (!spotType) return '不明';

  const spotTypeMap: Record<string, string> = {
    STORE: '店舗',
    TOURIST_SPOT: '観光スポット',
    ACTIVITY: 'アクティビティ',
  };

  return spotTypeMap[spotType] || '不明';
}

/**
 * スポットタイプを日本語ラベルと値のペアで取得する
 * @returns スポットタイプのオプションリスト
 */
export function getSpotTypeOptions(): Array<{ value: string; label: string }> {
  return [
    { value: SPOT_TYPE.STORE, label: '店舗' },
    { value: SPOT_TYPE.TOURIST_SPOT, label: '観光スポット' },
    { value: SPOT_TYPE.ACTIVITY, label: 'アクティビティ' },
  ];
}

/**
 * スポットタイプが有効かどうかを判定する
 * @param spotType スポットタイプ
 * @returns 有効な場合はtrue
 */
export function isValidSpotType(spotType?: string | null): boolean {
  if (!spotType) return false;
  return Object.values(SPOT_TYPE).includes(spotType as SpotType);
}
