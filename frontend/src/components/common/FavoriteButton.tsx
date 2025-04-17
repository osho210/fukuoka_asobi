'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_FAVORITE, REMOVE_FAVORITE } from '@/graphql/favorites';
import { useToast } from './ToastContext';
import { withAuth } from '@/utils/authUtils';

interface FavoriteButtonProps {
  playPlanId: string;
  isFavorite?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  onToggle?: (newState: boolean) => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  playPlanId,
  isFavorite = false,
  size = 'md',
  showText = true,
  className = '',
  onToggle
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const { addToast } = useToast();

  // お気に入り追加ミューテーション
  const [addFavorite, { loading: addLoading }] = useMutation(ADD_FAVORITE, {
    variables: { playPlanId },
    onCompleted: (data) => {
      if (data.addFavorite.errors && data.addFavorite.errors.length > 0) {
        addToast(data.addFavorite.errors[0], 'error');
      } else {
        addToast('お気に入りに追加しました', 'success');
        setFavorite(true);
        if (onToggle) onToggle(true);
      }
    },
    onError: (error) => {
      addToast(`エラーが発生しました: ${error.message}`, 'error');
    },
    update: (cache) => {
      // キャッシュを更新して、isFavoriteフラグを更新
      cache.modify({
        id: `PlayPlan:${playPlanId}`,
        fields: {
          isFavorite: () => true,
          favoriteCount: (count: number = 0) => count + 1
        }
      });

      // ユーザーのお気に入りリストも更新（必要に応じて）
      // この部分は実際のキャッシュ構造に合わせて調整が必要
    }
  });

  // お気に入り削除ミューテーション
  const [removeFavorite, { loading: removeLoading }] = useMutation(REMOVE_FAVORITE, {
    variables: { playPlanId },
    onCompleted: (data) => {
      if (data.removeFavorite.errors && data.removeFavorite.errors.length > 0) {
        addToast(data.removeFavorite.errors[0], 'error');
      } else {
        addToast('お気に入りから削除しました', 'success');
        setFavorite(false);
        if (onToggle) onToggle(false);
      }
    },
    onError: (error) => {
      addToast(`エラーが発生しました: ${error.message}`, 'error');
    },
    update: (cache) => {
      // キャッシュを更新して、isFavoriteフラグを更新
      cache.modify({
        id: `PlayPlan:${playPlanId}`,
        fields: {
          isFavorite: () => false,
          favoriteCount: (count: number = 0) => Math.max(0, count - 1)
        }
      });

      // ユーザーのお気に入りリストも更新（必要に応じて）
      // この部分は実際のキャッシュ構造に合わせて調整が必要
    }
  });

  // お気に入りの切り替え
  const toggleFavorite = () => {
    withAuth(() => {
      if (favorite) {
        removeFavorite();
      } else {
        addFavorite();
      }
    });
  };

  // サイズに応じたクラスを取得
  const getSizeClass = () => {
    switch (size) {
      case 'sm':
        return 'text-lg';
      case 'lg':
        return 'text-2xl';
      case 'md':
      default:
        return 'text-xl';
    }
  };

  const isLoading = addLoading || removeLoading;

  return (
    <button
      className={`favorite-button flex items-center ${className}`}
      onClick={toggleFavorite}
      disabled={isLoading}
      aria-pressed={favorite}
      aria-label={favorite ? 'お気に入りから削除' : 'お気に入りに追加'}
    >
      <span className={`heart-icon ${getSizeClass()} ${favorite ? 'text-red-500' : 'text-gray-400'}`}>
        {favorite ? '♥' : '♡'}
      </span>
      {showText && (
        <span className="ml-1">
          {favorite ? 'お気に入り済み' : 'お気に入りに追加'}
        </span>
      )}
    </button>
  );
};

export default FavoriteButton;
