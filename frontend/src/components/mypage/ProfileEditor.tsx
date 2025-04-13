'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PROFILE } from '@/graphql/mypage';
import styles from '@/styles/ProfileEditor.module.css';
import { SubscriptionStatus } from '@/components/mypage/SubscriptionStatus';

interface User {
    id: string;
    username: string;
    email: string;
    profileImageUrl: string | null;
    bio: string | null;
    instagramUrl: string | null;
    isPaidMember: boolean;
    paidStartDate: string | null;
    paidEndDate: string | null;
}

interface ProfileEditorProps {
    user: User;
    onUpdate: () => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ user, onUpdate }) => {
    const [username, setUsername] = useState(user.username || '');
    const [bio, setBio] = useState(user.bio || '');
    const [instagramUrl, setInstagramUrl] = useState(user.instagramUrl || '');
    const [profileImageUrl, setProfileImageUrl] = useState(user.profileImageUrl || '');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    // プロフィール更新ミューテーション
    const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE, {
        onCompleted: (data) => {
            setIsSubmitting(false);
            if (data.updateUserProfile.errors && data.updateUserProfile.errors.length > 0) {
                setErrorMessages(data.updateUserProfile.errors);
                setSuccessMessage('');
            } else {
                setSuccessMessage('プロフィールを更新しました');
                setErrorMessages([]);
                onUpdate(); // 親コンポーネントに更新を通知

                // 成功メッセージを3秒後に消す
                setTimeout(() => {
                    setSuccessMessage('');
                }, 3000);
            }
        },
        onError: (error) => {
            setIsSubmitting(false);
            setErrorMessages([error.message]);
            setSuccessMessage('');
        }
    });

    // プロフィール更新処理
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessages([]);
        setSuccessMessage('');

        updateUserProfile({
            variables: {
                username: username || undefined,
                bio: bio || undefined,
                instagramUrl: instagramUrl || undefined,
                profileImageUrl: profileImageUrl || undefined
            }
        });
    };

    // 画像アップロード処理（実際のアップロード機能は未実装）
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // 実際のアップロード処理はここに実装
        // 今回はモックとして、アップロードされた画像のURLをセットする
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && event.target.result) {
                    // 実際のアプリケーションでは、ここでS3などにアップロードし、
                    // 返却されたURLをsetProfileImageUrlにセットする
                    setProfileImageUrl(event.target.result.toString());
                }
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className={styles['profile-editor-container']}>
            <h2 className={styles['profile-editor-title']}>プロフィール編集</h2>

            {successMessage && (
                <div className={styles['profile-editor-success']}>
                    {successMessage}
                </div>
            )}

            {errorMessages.length > 0 && (
                <div className={styles['profile-editor-errors']}>
                    <ul>
                        {errorMessages.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles['profile-editor-form']}>
                <div className={styles['profile-editor-field']}>
                    <label className={styles['profile-editor-label']}>ユーザー名</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={styles['profile-editor-input']}
                        maxLength={20}
                        required
                    />
                    <p className={styles['profile-editor-hint']}>20文字以内で入力してください</p>
                </div>

                <div className={styles['profile-editor-field']}>
                    <label className={styles['profile-editor-label']}>自己紹介</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className={styles['profile-editor-textarea']}
                        maxLength={200}
                    />
                    <p className={styles['profile-editor-hint']}>200文字以内で入力してください</p>
                </div>

                <div className={styles['profile-editor-field']}>
                    <label className={styles['profile-editor-label']}>Instagram URL</label>
                    <input
                        type="url"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        className={styles['profile-editor-input']}
                        placeholder="https://www.instagram.com/username"
                    />
                </div>

                <div className={styles['profile-editor-field']}>
                    <label className={styles['profile-editor-label']}>プロフィール画像</label>
                    <div className={styles['profile-editor-image-container']}>
                        {profileImageUrl ? (

                            <img
                                src={profileImageUrl}
                                alt="プロフィール画像"
                                className={styles['profile-editor-image']}
                            />
                        ) : (
                            <div className={styles['profile-editor-image-placeholder']}>
                                画像なし
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={styles['profile-editor-image-input']}
                            id="profile-image-upload"
                        />
                        <label
                            htmlFor="profile-image-upload"
                            className={styles['profile-editor-image-button']}
                        >
                            画像を選択
                        </label>
                    </div>
                    <p className={styles['profile-editor-hint']}>
                        JPG、PNG形式、5MB以下の画像をアップロードしてください
                    </p>
                </div>

                <div className={styles['profile-editor-actions']}>
                    <button
                        type="submit"
                        className={styles['profile-editor-submit']}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '更新中...' : '更新する'}
                    </button>
                </div>
            </form>

            <div className={styles['profile-editor-info']}>
                <h3 className={styles['profile-editor-info-title']}>アカウント情報</h3>
                <div className={styles['profile-editor-info-item']}>
                    <span className={styles['profile-editor-info-label']}>メールアドレス:</span>
                    <span className={styles['profile-editor-info-value']}>{user.email}</span>
                </div>
                <div className={styles['profile-editor-info-item']}>
                    <span className={styles['profile-editor-info-label']}>会員ステータス:</span>
                    <span className={styles['profile-editor-info-value']}>
                        {user.isPaidMember && user.paidEndDate && new Date(user.paidEndDate) >= new Date()
                            ? '有料会員'
                            : '無料会員'}
                    </span>
                </div>
            </div>

            {/* サブスクリプション情報 */}
            <div className={styles['profile-editor-subscription']}>
                <h3 className={styles['profile-editor-section-title']}>サブスクリプション情報</h3>
                <SubscriptionStatus user={user} />
            </div>
        </div>
    );
};
