/**
 * 日付をフォーマットする関数
 * @param date フォーマットする日付
 * @param options フォーマットオプション
 * @returns フォーマットされた日付文字列
 */
export function formatDate(date: Date, options: Intl.DateTimeFormatOptions = {}): string {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };

  return new Intl.DateTimeFormat('ja-JP', defaultOptions).format(date);
}

/**
 * 日付のみをフォーマットする関数
 * @param date フォーマットする日付
 * @returns フォーマットされた日付文字列（時間なし）
 */
export function formatDateOnly(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  return new Intl.DateTimeFormat('ja-JP', options).format(date);
}

/**
 * 時間のみをフォーマットする関数
 * @param date フォーマットする日付
 * @returns フォーマットされた時間文字列
 */
export function formatTime(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
  };

  return new Intl.DateTimeFormat('ja-JP', options).format(date);
}

/**
 * 日付範囲をフォーマットする関数
 * @param startDate 開始日
 * @param endDate 終了日
 * @returns フォーマットされた日付範囲文字列
 */
export function formatDateRange(startDate: Date, endDate: Date): string {
  const startYear = startDate.getFullYear();
  const endYear = endDate.getFullYear();

  const startMonth = startDate.getMonth();
  const endMonth = endDate.getMonth();

  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  // 同じ年の場合は年を一度だけ表示
  if (startYear === endYear) {
    // 同じ月の場合は月を一度だけ表示
    if (startMonth === endMonth) {
      // 同じ日の場合は日を一度だけ表示
      if (startDay === endDay) {
        return `${formatDateOnly(startDate)} ${formatTime(startDate)}〜${formatTime(endDate)}`;
      }
      return `${startYear}年${startMonth + 1}月${startDay}日〜${endDay}日`;
    }
    return `${startYear}年${startMonth + 1}月${startDay}日〜${endMonth + 1}月${endDay}日`;
  }

  // 年が異なる場合は両方の年を表示
  return `${formatDateOnly(startDate)}〜${formatDateOnly(endDate)}`;
}

/**
 * 相対的な日付表現を返す関数（例：「3日前」「1時間前」）
 * @param date 対象の日付
 * @returns 相対的な日付表現
 */
export function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();

  const diffInSecs = Math.floor(diffInMs / 1000);
  const diffInMins = Math.floor(diffInSecs / 60);
  const diffInHours = Math.floor(diffInMins / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSecs < 60) {
    return `${diffInSecs}秒前`;
  }

  if (diffInMins < 60) {
    return `${diffInMins}分前`;
  }

  if (diffInHours < 24) {
    return `${diffInHours}時間前`;
  }

  if (diffInDays < 30) {
    return `${diffInDays}日前`;
  }

  // 1ヶ月以上前の場合は通常のフォーマットを使用
  return formatDate(date);
}


/**
 * ISO 8601形式の日時文字列から時刻部分のみをフォーマットして返す関数
 * @param isoString フォーマットするISO日時文字列 (例: "2000-01-01T10:00:00+09:00")
 * @returns フォーマットされた時間文字列 (例: "10:00")
 */
export function formatTimeFromIso(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid ISO date string: ${isoString}`);
  }
  return formatTime(date);
}
