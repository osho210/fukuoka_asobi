import { useCallback, useState } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number; // ミリ秒（0の場合は自動削除なし）
}

let toastId = 0;

/**
 * トースト通知を管理するカスタムフック
 * 複数のトーストを同時に表示でき、自動削除も可能
 */
export const useToast = () => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    /**
     * トーストを追加
     * @param message 表示するメッセージ
     * @param type トーストのタイプ（success, error, warning, info）
     * @param duration 表示時間（ミリ秒、デフォルト: 3000）
     */
    const showToast = useCallback(
        (message: string, type: ToastType = 'info', duration: number = 3000) => {
            const id = `toast-${++toastId}`;
            const toast: Toast = { id, message, type, duration };

            setToasts((prev) => [...prev, toast]);

            // 自動削除（durationが0の場合は自動削除なし）
            if (duration > 0) {
                setTimeout(() => {
                    removeToast(id);
                }, duration);
            }

            return id;
        },
        []
    );

    /**
     * トーストを削除
     */
    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    /**
     * すべてのトーストをクリア
     */
    const clearToasts = useCallback(() => {
        setToasts([]);
    }, []);

    return {
        toasts,
        showToast,
        removeToast,
        clearToasts,
    };
};
