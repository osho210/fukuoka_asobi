'use client';

import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { GET_USER_BOOKMARKS, DELETE_BOOKMARK, UPDATE_BOOKMARK } from '@/graphql/bookmarks';
import styles from '@/styles/UserBookmarks.module.css';
import Link from 'next/link';

export const UserBookmarks: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [editingBookmark, setEditingBookmark] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // ブックマーク一覧を取得
  const { data, loading, error, refetch } = useQuery(GET_USER_BOOKMARKS, {
    variables: {
      limit: 50,
      bookmarkableType: null,
      category: selectedCategory
    },
    fetchPolicy: 'network-only', // キャッシュを使わず常に最新データを取得
  });

  // ブックマーク削除ミューテーション
  const [deleteBookmark] = useMutation(DELETE_BOOKMARK, {
    onCompleted: () => {
      refetch(); // 削除後に一覧を再取得
    }
  });

  // ブックマーク更新ミューテーション
  const [updateBookmark] = useMutation(UPDATE_BOOKMARK, {
    onCompleted: () => {
      setEditingBookmark(null); // 編集モードを終了
      refetch(); // 更新後に一覧を再取得
    }
  });

  // ブックマークを削除する
  const handleDeleteBookmark = (id: string) => {
    if (window.confirm('このブックマークを削除してもよろしいですか？')) {
      deleteBookmark({
        variables: { id }
      });
    }
  };

  // ブックマークの編集を開始する
  const handleEditBookmark = (bookmark: any) => {
    setEditingBookmark(bookmark.id);
    setEditTitle(bookmark.title || '');
    setEditNote(bookmark.note || '');
    setEditCategory(bookmark.category || '');
  };

  // ブックマークを更新する
  const handleUpdateBookmark = (id: string) => {
    updateBookmark({
      variables: {
        id,
        title: editTitle,
        note: editNote,
        category: editCategory
      }
    });
  };

  // カテゴリでフィルタリングする
  const handleCategoryFilter = (category: string | null) => {
    setSelectedCategory(category);
  };

  // ローディング中の表示
  if (loading) {
    return (
      <div className={styles['user-bookmarks-loading']}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-2">読み込み中...</p>
      </div>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <div className={styles['user-bookmarks-error']}>
        <p>エラーが発生しました: {error.message}</p>
      </div>
    );
  }

  // ブックマークがない場合の表示
  if (!data?.userBookmarks || data.userBookmarks.length === 0) {
    return (
      <div className={styles['user-bookmarks-empty']}>
        <p>ブックマークはありません。</p>
        <p className={styles['user-bookmarks-empty-description']}>
          プランページの「ブックマーク」ボタンをクリックすると、ここに表示されます。
        </p>
      </div>
    );
  }

  // カテゴリの一覧を取得（重複を除く）
  const categories = Array.from(
    new Set(
      data.userBookmarks
        .map(bookmark => bookmark.category)
        .filter(category => category) // nullやundefinedを除外
    )
  );

  // ブックマーク一覧の表示
  return (
    <div className={styles['user-bookmarks-container']}>
      <div className={styles['user-bookmarks-header']}>
        <h2 className={styles['user-bookmarks-title']}>ブックマーク一覧</h2>

        {/* カテゴリフィルター */}
        {categories.length > 0 && (
          <div className={styles['user-bookmarks-filters']}>
            <span className={styles['user-bookmarks-filter-label']}>カテゴリ:</span>
            <button
              className={`${styles['user-bookmarks-filter-button']} ${selectedCategory === null ? styles['user-bookmarks-filter-active'] : ''}`}
              onClick={() => handleCategoryFilter(null)}
            >
              すべて
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`${styles['user-bookmarks-filter-button']} ${selectedCategory === category ? styles['user-bookmarks-filter-active'] : ''}`}
                onClick={() => handleCategoryFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className={styles['user-bookmarks-list']}>
        {data.userBookmarks.map((bookmark) => (
          <div key={bookmark.id} className={styles['user-bookmarks-item']}>
            {editingBookmark === bookmark.id ? (
              // 編集モード
              <div className={styles['user-bookmarks-edit-form']}>
                <div className={styles['user-bookmarks-edit-field']}>
                  <label className={styles['user-bookmarks-edit-label']}>タイトル:</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={styles['user-bookmarks-edit-input']}
                  />
                </div>
                <div className={styles['user-bookmarks-edit-field']}>
                  <label className={styles['user-bookmarks-edit-label']}>メモ:</label>
                  <textarea
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className={styles['user-bookmarks-edit-textarea']}
                  />
                </div>
                <div className={styles['user-bookmarks-edit-field']}>
                  <label className={styles['user-bookmarks-edit-label']}>カテゴリ:</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className={styles['user-bookmarks-edit-input']}
                  />
                </div>
                <div className={styles['user-bookmarks-edit-actions']}>
                  <button
                    onClick={() => handleUpdateBookmark(bookmark.id)}
                    className={styles['user-bookmarks-edit-save']}
                  >
                    保存
                  </button>
                  <button
                    onClick={() => setEditingBookmark(null)}
                    className={styles['user-bookmarks-edit-cancel']}
                  >
                    キャンセル
                  </button>
                </div>
              </div>
            ) : (
              // 表示モード
              <>
                <div className={styles['user-bookmarks-item-content']}>
                  {bookmark.bookmarkable && bookmark.bookmarkableType === 'PlayPlan' && (
                    <div className={styles['user-bookmarks-item-image']}>
                      {bookmark.bookmarkable.imageUrl ? (
                        <img src={bookmark.bookmarkable.imageUrl} alt={bookmark.bookmarkable.planName} />
                      ) : (
                        <div className={styles['user-bookmarks-item-no-image']}>No Image</div>
                      )}
                    </div>
                  )}

                  <div className={styles['user-bookmarks-item-details']}>
                    <h3 className={styles['user-bookmarks-item-title']}>
                      {bookmark.title || (bookmark.bookmarkable && bookmark.bookmarkableType === 'PlayPlan' ? bookmark.bookmarkable.planName : 'タイトルなし')}
                    </h3>

                    {bookmark.category && (
                      <span className={styles['user-bookmarks-item-category']}>{bookmark.category}</span>
                    )}

                    {bookmark.note && (
                      <p className={styles['user-bookmarks-item-note']}>{bookmark.note}</p>
                    )}

                    <p className={styles['user-bookmarks-item-date']}>
                      保存日: {new Date(bookmark.createdAt).toLocaleDateString('ja-JP')}
                    </p>

                    {bookmark.bookmarkable && bookmark.bookmarkableType === 'PlayPlan' && (
                      <Link href={`/plans/${bookmark.bookmarkable.id}`} className={styles['user-bookmarks-item-link']}>
                        プランを見る
                      </Link>
                    )}
                  </div>
                </div>

                <div className={styles['user-bookmarks-item-actions']}>
                  <button
                    onClick={() => handleEditBookmark(bookmark)}
                    className={styles['user-bookmarks-item-edit']}
                  >
                    編集
                  </button>
                  <button
                    onClick={() => handleDeleteBookmark(bookmark.id)}
                    className={styles['user-bookmarks-item-delete']}
                  >
                    削除
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
