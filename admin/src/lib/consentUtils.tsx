/**
 * 承諾依頼のステータスに応じたアイコン種別を返す
 * @param status - 承諾依頼のステータス
 * @returns アイコン種別を示す文字列
 */
export const getConsentRequestStatusIcon = (status: string): 'approved' | 'rejected' | 'revoked' | 'sent' | 'default' => {
  switch (status) {
    case 'APPROVED':
      return 'approved';
    case 'REJECTED':
      return 'rejected';
    case 'REVOKED':
      return 'revoked';
    case 'SENT':
      return 'sent';
    default:
      return 'default';
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
