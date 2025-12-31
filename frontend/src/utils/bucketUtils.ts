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
