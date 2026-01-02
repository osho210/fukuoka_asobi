/**
 * URLをクリップボードにコピーする
 *
 * @param url - コピー対象のURL（デフォルト: 現在のURL）
 * @returns コピーが成功したかどうか
 */
export async function copyUrlToClipboard(url: string = window.location.href): Promise<boolean> {
    try {
        await navigator.clipboard.writeText(url);
        return true;
    } catch (error) {
        console.error('URLコピーに失敗しました:', error);
        return false;
    }
}

/**
 * LINEでシェアするURL を生成して開く
 *
 * @param title - シェアするタイトル
 * @param url - シェアするURL（デフォルト: 現在のURL）
 */
export function shareToLine(title: string, url: string = window.location.href): void {
    const shareUrl = `https://line.me/R/msg/text/?${encodeURIComponent(`${title}\n${url}`)}`;
    window.open(shareUrl, '_blank', 'width=500,height=500');
}

/**
 * シェア機能を実行する（複数の共有方法）
 *
 * @param shareType - 共有タイプ ('copy' | 'line')
 * @param title - シェアするタイトル
 * @param url - シェアするURL（デフォルト: 現在のURL）
 * @returns 実行結果
 */
export async function executeShare(
    shareType: 'copy' | 'line',
    title: string,
    url: string = window.location.href
): Promise<boolean> {
    if (shareType === 'copy') {
        return await copyUrlToClipboard(url);
    } else if (shareType === 'line') {
        shareToLine(title, url);
        return true;
    }
    return false;
}
