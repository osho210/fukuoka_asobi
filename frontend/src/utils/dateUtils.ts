import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

// 日付をフォーマットする関数
export const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return format(date, 'yyyy年MM月dd日', { locale: ja });
  } catch (error) {
    console.error('日付のフォーマットエラー:', error);
    return dateString;
  }
};

// 時間のみをフォーマットする関数
export const formatTime = (dateString?: string) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return format(date, 'HH:mm', { locale: ja });
  } catch (error) {
    console.error('時間のフォーマットエラー:', error);
    return '';
  }
};

// 移動時間の表示（分→時間分）
export const formatTravelTime = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes}分`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}時間${mins}分` : `${hours}時間`;
};

// 旅行タイプを日本語に変換する関数
export const getTripTypeText = (tripType: string) => {
  switch (tripType) {
    case 'DAY_TRIP':
      return '日帰り';
    case 'overnight':
      return '泊まり';
    default:
      return tripType;
  }
};

// 移動手段の日本語表示
export const getTravelMethodText = (method: string) => {
  const methods: { [key: string]: string } = {
    'walk': '徒歩',
    'car': '車',
    'train': '電車',
    'bicycle': '自転車',
    'other': 'その他'
  };
  return methods[method] || method;
};
