import { useState, useEffect } from 'react';

/**
 * メディアクエリの状態を監視するカスタムフック
 *
 * @param query - メディアクエリ文字列 (例: '(min-width: 768px)')
 * @returns メディアクエリにマッチするかどうかのboolean値
 *
 * @example
 * const isDesktop = useMediaQuery('(min-width: 768px)');
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        const mediaQuery = window.matchMedia(query);
        setMatches(mediaQuery.matches);

        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches);
        };

        // モダンブラウザ向け
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
        } else {
            // レガシーブラウザ向け
            mediaQuery.addListener(handleChange);
        }

        return () => {
            if (mediaQuery.removeEventListener) {
                mediaQuery.removeEventListener('change', handleChange);
            } else {
                mediaQuery.removeListener(handleChange);
            }
        };
    }, [query]);

    // SSR時はfalseを返す（ハイドレーションエラーを防ぐ）
    if (!mounted) {
        return false;
    }

    return matches;
}

/**
 * デスクトップ表示かどうかを判定するカスタムフック
 * ブレークポイント: 768px以上
 *
 * @returns デスクトップ表示かどうかのboolean値
 *
 * @example
 * const isDesktop = useIsDesktop();
 */
export function useIsDesktop(): boolean {
    return useMediaQuery('(min-width: 768px)');
}

/**
 * モバイル表示かどうかを判定するカスタムフック
 * ブレークポイント: 768px未満
 *
 * @returns モバイル表示かどうかのboolean値
 *
 * @example
 * const isMobile = useIsMobile();
 */
export function useIsMobile(): boolean {
    return useMediaQuery('(max-width: 767px)');
}

/**
 * タブレット表示かどうかを判定するカスタムフック
 * ブレークポイント: 768px以上 1024px未満
 *
 * @returns タブレット表示かどうかのboolean値
 *
 * @example
 * const isTablet = useIsTablet();
 */
export function useIsTablet(): boolean {
    return useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
}
