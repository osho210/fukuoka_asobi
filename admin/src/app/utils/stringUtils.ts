/**
 * スネークケースをキャメルケースに変換します
 * 例: user_profile → userProfile
 */
export function toCamelCase(str: string): string {
    return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}