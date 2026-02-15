import React from 'react';
import { CheckCircle2, XCircle, Clock, Ban } from 'lucide-react';

/**
 * 承諾依頼のステータスに応じたアイコンコンポーネントを返す
 * @param status - 承諾依頼のステータス
 * @returns アイコンコンポーネント
 */
export const renderConsentRequestStatusIcon = (status: string) => {
  switch (status) {
    case 'APPROVED':
      return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    case 'REJECTED':
      return <XCircle className="w-5 h-5 text-red-600" />;
    case 'REVOKED':
      return <Ban className="w-5 h-5 text-gray-600" />;
    case 'SENT':
      return <Clock className="w-5 h-5 text-blue-600" />;
    default:
      return <Clock className="w-5 h-5 text-gray-400" />;
  }
};

/**
 * 承諾依頼のステータスを日本語テキストに変換する
 * @param status - 承諾依頼のステータス
 * @returns 日本語のステータステキスト
 */
export const getConsentRequestStatusLabel = (status: string): string => {
  const statusMap: Record<string, string> = {
    'DRAFT': '下書き',
    'SENT': '送信済み',
    'APPROVED': '承諾済み',
    'REJECTED': '否認',
    'REVOKED': '撤回',
    'EXPIRED': '期限切れ',
  };
  return statusMap[status] || status;
};
