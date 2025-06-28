/**
 * 任意のオブジェクトや配列から __typename を除外するユーティリティ関数
 * @param obj - __typename を除去したいオブジェクトまたは配列
 * @returns __typename が除外された新しいオブジェクトまたは配列
 */
export const omitTypename = <T>(obj: T): T => {
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(omitTypename) as T;
    }

    const result: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
        if (key === '__typename') continue;
        result[key] = omitTypename(value);
    }

    return result as T;
};
