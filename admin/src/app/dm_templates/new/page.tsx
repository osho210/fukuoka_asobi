'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/forms/TextField';
import { CREATE_DM_TEMPLATE } from '@/graphql/mutations/consents';

export default function NewDmTemplatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    version: '',
    content: '',
    isActive: false,
  });

  const [createTemplate] = useMutation(CREATE_DM_TEMPLATE, {
    onCompleted: (data) => {
      if (data?.createDmTemplate?.dmTemplate) {
        alert('テンプレートを作成しました');
        router.push('/dm_templates');
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createTemplate({
      variables: {
        input: formData,
      },
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dm_templates">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">新規DMテンプレート作成</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 max-w-3xl">
        <div className="space-y-6">
          <TextField
            id="name"
            label="テンプレート名"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="例: デフォルト承諾依頼テンプレート"
            required
          />

          <TextField
            id="version"
            label="バージョン"
            value={formData.version}
            onChange={(e) => setFormData({ ...formData, version: e.target.value })}
            placeholder="例: v1.0"
            required
          />

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              テンプレート内容
            </label>
            <div className="mb-2 text-sm text-gray-600">
              <p>利用可能なプレースホルダー:</p>
              <ul className="list-disc list-inside ml-2">
                <li><code className="bg-gray-100 px-1 rounded">{'{{store_name}}'}</code> - 店舗名</li>
                <li><code className="bg-gray-100 px-1 rounded">{'{{form_url}}'}</code> - 承諾フォームURL</li>
              </ul>
            </div>
            <textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className="admin-form-control admin-form-textarea w-full"
              placeholder="例:&#10;{{store_name}}様&#10;&#10;いつもありがとうございます。&#10;福岡遊び日記（Webメディア / Instagram）での画像掲載について、利用許諾のお願いです。&#10;&#10;📝 承諾フォーム：&#10;{{form_url}}&#10;&#10;よろしくお願いいたします。"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              アクティブにする
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit">
              <Save className="h-4 w-4 mr-2" />
              作成
            </Button>
            <Link href="/dm_templates">
              <Button type="button" variant="outline">
                キャンセル
              </Button>
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
