'use client';

import { useEffect } from 'react';

interface RobotsMetaTagProps {
  isPublic: boolean;
}

/**
 * 検索エンジンへの公開設定を制御するメタタグコンポーネント
 * 
 * @param isPublic - trueの場合は検索エンジンにインデックスを許可、falseの場合は noindex を設定
 */
export default function RobotsMetaTag({ isPublic }: RobotsMetaTagProps) {
  useEffect(() => {
    // 既存のrobots metaタグを削除
    const existingMeta = document.querySelector('meta[name="robots"]');
    if (existingMeta) {
      existingMeta.remove();
    }

    // 新しいrobots metaタグを追加
    if (!isPublic) {
      const meta = document.createElement('meta');
      meta.name = 'robots';
      meta.content = 'noindex, nofollow';
      document.head.appendChild(meta);
    }

    // クリーンアップ: コンポーネントがアンマウントされたときにmetaタグを削除
    return () => {
      const meta = document.querySelector('meta[name="robots"]');
      if (meta) {
        meta.remove();
      }
    };
  }, [isPublic]);

  return null; // このコンポーネントはUIをレンダリングしない
}
