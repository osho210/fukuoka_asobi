'use client';

import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import Link from 'next/link';
import { ArrowLeft, Plus, Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GET_DM_TEMPLATES } from '@/graphql/queries/consents';
import { UPDATE_DM_TEMPLATE } from '@/graphql/mutations/consents';

type DmTemplate = {
  id: string;
  name: string;
  version: string;
  content: string;
  isActive: boolean;
  createdAt: string;
};

type GetDmTemplatesData = {
  dmTemplates: DmTemplate[];
};

export default function DmTemplatesPage() {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const { data, loading, error, refetch } = useQuery<GetDmTemplatesData>(GET_DM_TEMPLATES);
  const [updateTemplate] = useMutation(UPDATE_DM_TEMPLATE, {
    onCompleted: (data) => {
      if (data?.updateDmTemplate?.dmTemplate) {
        alert('テンプレートを更新しました');
        setEditingId(null);
        refetch();
      }
    },
  });

  const handleEdit = (template: DmTemplate) => {
    setEditingId(template.id);
    setEditContent(template.content);
  };

  const handleSave = async (id: string) => {
    await updateTemplate({
      variables: {
        input: {
          id,
          content: editContent,
        },
      },
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditContent('');
  };

  if (loading) return <div className="p-8">読み込み中...</div>;
  if (error) return <div className="p-8 text-red-600">エラー: {error.message}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <Link href="/consent_requests">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">DMテンプレート管理</h1>
        </div>
        <Link href="/dm_templates/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            新規テンプレート
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200">
          {data?.dmTemplates?.map((template) => (
            <div key={template.id} className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{template.name}</h3>
                  <div className="flex gap-4 mt-2 text-sm text-gray-600">
                    <span>バージョン: {template.version}</span>
                    <span>作成日: {new Date(template.createdAt).toLocaleDateString('ja-JP')}</span>
                    {template.isActive && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        アクティブ
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {editingId === template.id ? (
                    <>
                      <Button onClick={() => handleSave(template.id)} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        保存
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        キャンセル
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => handleEdit(template)} variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      編集
                    </Button>
                  )}
                </div>
              </div>
              {editingId === template.id ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-4 border rounded-lg font-mono text-sm min-h-[200px]"
                  placeholder="テンプレート内容&#10;&#10;利用可能なプレースホルダー:&#10;{{store_name}} - 店舗名&#10;{{form_url}} - 承諾フォームURL"
                />
              ) : (
                <pre className="bg-gray-50 p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">
                  {template.content}
                </pre>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
