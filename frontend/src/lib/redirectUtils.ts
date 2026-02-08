/**
 * リダイレクトURLを検証し、安全なURLのみを許可します。
 * オープンリダイレクト脆弱性を防止するため、相対URLのみを許可します。
 *
 * 許可する形式:
 * - /mypage
 * - /plans/123
 * - /mypage/subscription
 *
 * 拒否する形式:
 * - https://attacker.example.com
 * - //attacker.example.com (プロトコル相対URL)
 * - javascript:alert('xss')
 * - data:text/html,<script>...</script>
 *
 * @param url - リダイレクト先URL（クエリパラメータから取得した文字列）
 * @param defaultUrl - URL検証失敗時のデフォルトURL（デフォルト: /mypage）
 * @returns 検証済みのURL（相対URLのみ）
 */
export function validateRedirectUrl(
    url: string | null | undefined,
    defaultUrl: string = '/mypage'
): string {
    // nullまたはundefinedの場合はデフォルトを返す
    if (!url) {
        return defaultUrl;
    }

    // 文字列として処理
    const urlString = String(url).trim();

    // 空文字列の場合はデフォルトを返す
    if (!urlString) {
        return defaultUrl;
    }

    // プロトコルスキームを含む絶対URLは拒否
    // https://, http://, ftp://, javascript:, data:, etc.
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/i.test(urlString)) {
        console.warn(`[セキュリティ] 絶対URLはリダイレクトできません: ${urlString}`);
        return defaultUrl;
    }

    // プロトコル相対URL (//) は拒否
    if (urlString.startsWith('//')) {
        console.warn(`[セキュリティ] プロトコル相対URLはリダイレクトできません: ${urlString}`);
        return defaultUrl;
    }

    // 相対URL（スラッシュで開始）のみを許可
    if (urlString.startsWith('/')) {
        // さらに安全性を確認：クエリパラメータやハッシュが含まれていてもOK
        // ただし、危険な文字列がないことを確認
        if (/[<>"{}|\\^`]/i.test(urlString)) {
            console.warn(`[セキュリティ] 危険な文字を含むURLはリダイレクトできません: ${urlString}`);
            return defaultUrl;
        }
        return urlString;
    }

    // その他の形式は拒否
    console.warn(`[セキュリティ] 無効なURLはリダイレクトできません: ${urlString}`);
    return defaultUrl;
}
