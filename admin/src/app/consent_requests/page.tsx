'use client';

import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { GET_CONSENT_REQUESTS } from '@/graphql/queries/consents';
import { Plus, ExternalLink, Copy, CheckCircle2 as CheckCircleIcon } from 'lucide-react';
import { renderConsentRequestStatusIcon, getConsentRequestStatusLabel } from '@/lib/consentUtils';
import { copyToClipboard } from '@/lib/clipboardUtils';
import { gql } from '@apollo/client';

const GET_DM_TEMPLATE = gql`
  query GetDmTemplate($name: String!) {
    dmTemplate(name: $name) {
      id
      name
      version
      content
      availableVariables
    }
  }
`;

export default function ConsentRequestsPage() {
  const router = useRouter();
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const { data, loading, error, refetch } = useQuery(GET_CONSENT_REQUESTS);
  const { data: templateData } = useQuery(GET_DM_TEMPLATE, {
    variables: { name: '画像利用承諾依頼' },
  });

  const handleCopyToClipboard = async (text: string, token: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedToken(token);
      setTimeout(() => setCopiedToken(null), 2000);
    }
  };

  const generateDMTemplate = (request: any) => {
    const template = templateData?.dmTemplate;
    if (!template) {
      // フォールバック: テンプレートがない場合は従来の方法
      const storeName = request.spot?.spotName || '店舗名';
      return `${storeName}様

いつもありがとうございます。
福岡遊び日記（Webメディア / Instagram）での画像掲載について、利用許諾のお願いです。

以下のフォームから、投稿・ストーリーズへの掲載許諾をご確認いただけますと幸いです。

📝 承諾フォーム：
${request.formUrl}

ご不明点がございましたら、お気軽にお問い合わせください。
よろしくお願いいたします。`;
    }

    // テンプレートから生成
    let message = template.content;
    message = message.replace(/\{\{store_name\}\}/g, request.spot?.spotName || '店舗名');
    message = message.replace(/\{\{form_url\}\}/g, request.formUrl);
    return message;
  };

  if (loading) return <div className="p-8">読み込み中...</div>;
  if (error) return <div className="p-8 text-red-600">エラー: {error.message}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">画像利用承諾管理</h1>
        <Button onClick={() => router.push('/consent_requests/new')}>
          <Plus className="w-4 h-4 mr-2" />
          新規依頼作成
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full border-collapse divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ステータス
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                店舗
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                承諾者
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                承諾者タイプ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                承諾日時
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                作成日
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data?.consentRequests?.map((request: any) => (
              <tr key={request.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    {renderConsentRequestStatusIcon(request.status)}
                    <span className="text-sm font-medium">
                      {getConsentRequestStatusLabel(request.status)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {request.spot?.spotName}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    {request.consentAgreement?.signerName || request.consenterDisplayName}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {request.consenterType === 'STORE' ? '店舗' : 'Instagram利用者'}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {request.consentAgreement?.agreedAt
                    ? new Date(request.consentAgreement.agreedAt).toLocaleDateString('ja-JP')
                    : '-'}
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {new Date(request.createdAt).toLocaleDateString('ja-JP')}
                </td>
                <td className="px-4 py-4 text-sm font-medium">
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(request.formUrl, request.token)}
                      className="w-full justify-center"
                    >
                      {copiedToken === request.token ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          コピー済み
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          URL
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyToClipboard(generateDMTemplate(request), `dm-${request.token}`)}
                      className="w-full justify-center"
                    >
                      {copiedToken === `dm-${request.token}` ? (
                        <>
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          コピー済み
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-1" />
                          DM文
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => window.open(request.formUrl, '_blank')}
                      className="w-full justify-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      開く
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!data?.consentRequests?.length && (
          <div className="text-center py-12 text-gray-500">
            承諾依頼がまだありません
          </div>
        )}
      </div>
    </div>
  );
}
