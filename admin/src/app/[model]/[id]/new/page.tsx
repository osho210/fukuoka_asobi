'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function ModelNewPage() {
  const params = useParams();
  const router = useRouter();
  const modelRoute = params.model as string;

  useEffect(() => {
    // 新規作成ページにリダイレクト
    router.replace(`/admin/${modelRoute}/new`);
  }, [modelRoute, router]);

  return (
    <div className="p-4">
      リダイレクト中...
    </div>
  );
}
