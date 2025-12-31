import { LayoutBucketShiftEnum } from '@/__generated__/graphql';

/**
 * LayoutBucketShiftEnum から CSS transform値へのマッピング
 * 各方向への移動量を定義（単位: px）
 */
export const SHIFT_TRANSFORM_MAP: Record<LayoutBucketShiftEnum, string> = {
    [LayoutBucketShiftEnum.Up]: 'translateY(-12px)',
    [LayoutBucketShiftEnum.Down]: 'translateY(12px)',
    [LayoutBucketShiftEnum.Left]: 'translateX(-12px)',
    [LayoutBucketShiftEnum.Right]: 'translateX(12px)',
    [LayoutBucketShiftEnum.Neutral]: 'translate(0, 0)',
};

/**
 * LayoutBucketShiftEnum から Tailwind CSS クラス名へのマッピング
 * 動的クラス名が必要な場合に使用
 */
export const SHIFT_CLASS_MAP: Record<LayoutBucketShiftEnum, string> = {
    [LayoutBucketShiftEnum.Up]: 'translate-y-[-12px]',
    [LayoutBucketShiftEnum.Down]: 'translate-y-[12px]',
    [LayoutBucketShiftEnum.Left]: 'translate-x-[-12px]',
    [LayoutBucketShiftEnum.Right]: 'translate-x-[12px]',
    [LayoutBucketShiftEnum.Neutral]: 'translate-x-0 translate-y-0',
};

/**
 * Shift値からCSS スタイルオブジェクトを生成
 * React コンポーネントで直接使用可能
 *
 * @param shift - LayoutBucketShiftEnum値
 * @returns React.CSSProperties オブジェクト
 */
export function getShiftStyles(shift: LayoutBucketShiftEnum): React.CSSProperties {
    return {
        transform: SHIFT_TRANSFORM_MAP[shift],
        transition: 'transform 0.3s ease-in-out',
    };
}

/**
 * Shift値からTailwind CSSクラス名を生成
 * className属性で使用可能
 *
 * @param shift - LayoutBucketShiftEnum値
 * @returns Tailwind CSSクラス名の文字列
 */
export function getShiftClasses(shift: LayoutBucketShiftEnum): string {
    return SHIFT_CLASS_MAP[shift];
}

/**
 * Shift値の説明を取得（UI表示用）
 *
 * @param shift - LayoutBucketShiftEnum値
 * @returns 日本語での説明テキスト
 */
export function getShiftDescription(shift: LayoutBucketShiftEnum): string {
    const descriptions: Record<LayoutBucketShiftEnum, string> = {
        [LayoutBucketShiftEnum.Up]: '上にズレ',
        [LayoutBucketShiftEnum.Down]: '下にズレ',
        [LayoutBucketShiftEnum.Left]: '左にズレ',
        [LayoutBucketShiftEnum.Right]: '右にズレ',
        [LayoutBucketShiftEnum.Neutral]: 'ズレなし',
    };
    return descriptions[shift];
}
