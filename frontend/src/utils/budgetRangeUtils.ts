/**
 * 予算帯の定義
 */
export const BUDGET_RANGE = {
    CHEAP: 'CHEAP',
    AVERAGE: 'AVERAGE',
    EXPENSIVE: 'EXPENSIVE',
} as const;

export type BudgetRange = (typeof BUDGET_RANGE)[keyof typeof BUDGET_RANGE];

/**
 * 予算帯を日本語ラベルに変換する（パイプ関数）
 * @param budgetRange 予算帯（CHEAP、AVERAGE、EXPENSIVE）
 * @returns 日本語ラベル
 */
export function getBudgetRangeLabel(budgetRange: string | null | undefined): string {
    if (!budgetRange) return '不明';

    const budgetRangeMap: Record<string, string> = {
        CHEAP: '安め',
        AVERAGE: '普通',
        EXPENSIVE: '高い',
    };

    return budgetRangeMap[budgetRange] || '不明';
}

/**
 * 予算帯を日本語ラベルと値のペアで取得する
 * @returns 予算帯のオプションリスト
 */
export function getBudgetRangeOptions(): Array<{ value: string; label: string }> {
    return [
        { value: BUDGET_RANGE.CHEAP, label: '安い' },
        { value: BUDGET_RANGE.AVERAGE, label: '普通' },
        { value: BUDGET_RANGE.EXPENSIVE, label: '高い' },
    ];
}

/**
 * 予算帯が有効かどうかを判定する
 * @param budgetRange 予算帯
 * @returns 有効な場合はtrue
 */
export function isValidBudgetRange(budgetRange?: string | null): boolean {
    if (!budgetRange) return false;
    return Object.values(BUDGET_RANGE).includes(budgetRange as BudgetRange);
}
