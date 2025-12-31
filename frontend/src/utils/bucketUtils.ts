import React from 'react';

/**
 * ISO 8601形式の日付文字列をフォーマットするユーティリティ関数
 * 例: "2025-12-30T01:16:00+09:00" => { month: "Dec", day: "30" }
 */
export const formatPublishedDate = (
  dateString: string | null | undefined
): { month: string; day: string } | null => {
  if (!dateString) return null;

  try {
    const date = new Date(dateString);
    const month = date.getMonth(); // 0-11
    const day = date.getDate();

    // 月を英語で表示 (Jan, Feb, ..., Dec)
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const monthInEnglish = monthNames[month];

    return {
      month: monthInEnglish,
      day: String(day).padStart(2, '0'), // ゼロパディング (例: "05")
    };
  } catch {
    return null;
  }
};

/**
 * テキストの空白を改行に変換するユーティリティ関数
 * 例: "やりたい こと" => "やりたい\nこと"
 */
export const renderTextWithLineBreaks = (
  text: string
): React.ReactNode[] => {
  return text.split(' ').map((word, index, array) =>
    React.createElement(
      React.Fragment,
      { key: index },
      word,
      index < array.length - 1 ? React.createElement('br') : null
    )
  );
};

/**
 * templateKeyが背表紙テンプレートかを判定
 * spine_bookが含まれている場合は背表紙テンプレート
 */
export const isSpineBookTemplate = (templateKey: string): boolean => {
  return templateKey.includes('spine_book');
};

/**
 * 場所の名前からGoogle Maps URLを生成
 * 例: "福岡市鮮魚市場市場会館" => "https://www.google.com/maps/search/..."
 */
export const generateGoogleMapsUrl = (placeName: string): string => {
  const encodedPlace = encodeURIComponent(placeName);
  return `https://www.google.com/maps/search/${encodedPlace}`;
};

/**
 * Google Maps URLをクリップボードにコピー
 */
export const copyGoogleMapsUrlToClipboard = async (placeName: string): Promise<boolean> => {
  try {
    const url = generateGoogleMapsUrl(placeName);
    await navigator.clipboard.writeText(url);
    return true;
  } catch (error) {
    console.error('クリップボードへのコピーに失敗しました:', error);
    return false;
  }
};

/**
 * spine_book テンプレートから色情報を抽出し、base テンプレートの画像パスを生成
 * 例: "spine_book_pink" → "base_pink.png"
 * 例: "base_pink" → "base_pink.png"
 */
export const getBaseImagePath = (templateKey: string): string => {
  // spine_book_* の形式から色情報を抽出
  if (templateKey.startsWith('spine_book_')) {
    const color = templateKey.replace('spine_book_', '');
    return `base_${color}.png`;
  }
  // base_* の形式はそのまま使用
  if (templateKey.startsWith('base_')) {
    return `${templateKey}.png`;
  }
  // デフォルトフォールバック
  return `${templateKey}.png`;
};
