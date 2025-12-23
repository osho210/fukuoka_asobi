
/**
 * 旅行タイプのEnum値を日本語ラベルに変換します。
 * @param tripType 旅行タイプのEnum値 ('DAY_TRIP' | 'OVERNIGHT')
 * @returns 日本語ラベル
 */
export const tripTypeToLabel = (tripType: 'DAY_TRIP' | 'OVERNIGHT'): string => {
    if (tripType === 'DAY_TRIP') return '日帰り';
    return '泊まり';
}
