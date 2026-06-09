/**
 * JSON-LD の構造化データから undefined 値を除去するユーティリティ関数
 * 
 * @param data - クリーニング対象のデータオブジェクト
 * @returns undefined 値を除去したクリーンなオブジェクト
 */
export function removeUndefinedValues<T>(data: T): T {
  const cleanedData = JSON.parse(
    JSON.stringify(data, (_, value) => (value === undefined ? null : value))
  );
  
  Object.keys(cleanedData).forEach(key => {
    if (cleanedData[key] === null) {
      delete cleanedData[key];
    }
  });
  
  return cleanedData;
}
