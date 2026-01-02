'use client';

import React from 'react';
import { Toast } from '@/hooks/useToast';
import '@/styles/Toast.css';

interface ToastContainerProps {
    toasts: Toast[];
    onRemove: (id: string) => void;
}

/**
 * トースト通知を表示するコンテナコンポーネント
 * useToastフックで管理されるトースト一覧を受け取り、画面に表示します
 */
export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onRemove }) => {
    return (
        <div className="toast-container">
            {toasts.map((toast) => (
                <div key={toast.id} className={`toast toast-${toast.type}`}>
                    <div className="toast-content">
                        <span className="toast-message">{toast.message}</span>
                    </div>
                    <button
                        className="toast-close"
                        onClick={() => onRemove(toast.id)}
                        aria-label="トーストを閉じる"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;
