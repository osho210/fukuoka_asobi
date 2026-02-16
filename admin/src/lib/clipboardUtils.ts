/**
 * クリップボードにテキストをコピーする共通ユーティリティ関数
 * 
 * @param text コピーするテキスト
 * @returns コピー成功時はtrue、失敗時はfalse
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('クリップボードへのコピーに失敗しました:', error);
    return false;
  }
};
