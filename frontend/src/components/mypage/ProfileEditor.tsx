'use client';

import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_USER_PROFILE } from '@/graphql/mypage';
import '@/styles/ProfileEditor.css';
import { SubscriptionStatus } from '@/components/mypage/SubscriptionStatus';
import Image from 'next/image';

interface User {
    id: string;
    username: string;
    email: string;
    profileImageUrl: string | null;
    avatarUrl: string | null;
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
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE, {
        onCompleted: (data) => {
            setIsSubmitting(false);

            if (data.updateUserProfile.errors && data.updateUserProfile.errors.length > 0) {
                setErrorMessages(data.updateUserProfile.errors);
                setSuccessMessage('');
            } else {
                setSuccessMessage('プロフィールを更新しました');
                setErrorMessages([]);
                onUpdate();

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrorMessages([]);
        setSuccessMessage('');

        if (avatarFile) {
            const reader = new FileReader();
            reader.onload = () => {
                const avatarBase64 = reader.result as string;

                updateUserProfile({
                    variables: {
                        username: username || undefined,
                        bio: bio || undefined,
                        instagramUrl: instagramUrl || undefined,
                        profileImageUrl: profileImageUrl || undefined,
                        avatar: avatarBase64,
                    }
                });
            };
            reader.readAsDataURL(avatarFile);
        } else {
            updateUserProfile({
                variables: {
                    username: username || undefined,
                    bio: bio || undefined,
                    instagramUrl: instagramUrl || undefined,
                    profileImageUrl: profileImageUrl || undefined,
                }
            });
        }
    };
    const baseMinioUrl = 'http://localhost:9000/fukuoka-asobi-dev';
    const fullAvatarUrl = `${baseMinioUrl}/${user.avatarUrl}`;

    // 画像アップロード時の処理（Base64変換用）
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setAvatarFile(file);

            const reader = new FileReader();
            reader.onload = (event) => {
                if (event.target && event.target.result) {
                    setProfileImageUrl(event.target.result.toString());
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className={'profile-editor-container'}>
            <h2 className={'profile-editor-title'}>プロフィール編集</h2>

            {successMessage && (
                <div className={'profile-editor-success'}>
                    {successMessage}
                </div>
            )}

            {errorMessages.length > 0 && (
                <div className={'profile-editor-errors'}>
                    <ul>
                        {errorMessages.map((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            <form onSubmit={handleSubmit} className={'profile-editor-form'}>
                <div className={'profile-editor-field'}>
                    <label className={'profile-editor-label'}>ユーザー名</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className={'profile-editor-input'}
                        maxLength={20}
                        required
                    />
                    <p className={'profile-editor-hint'}>20文字以内で入力してください</p>
                </div>

                <div className={'profile-editor-field'}>
                    <label className={'profile-editor-label'}>自己紹介</label>
                    <textarea
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        className={'profile-editor-textarea'}
                        maxLength={200}
                    />
                    <p className={'profile-editor-hint'}>200文字以内で入力してください</p>
                </div>

                <div className={'profile-editor-field'}>
                    <label className={'profile-editor-label'}>Instagram URL</label>
                    <input
                        type="url"
                        value={instagramUrl}
                        onChange={(e) => setInstagramUrl(e.target.value)}
                        className={'profile-editor-input'}
                        placeholder="https://www.instagram.com/username"
                    />
                </div>

                <div className={'profile-editor-field'}>
                    <label className={'profile-editor-label'}>プロフィール画像</label>
                    <div className={'profile-editor-image-container'}>
                        {avatarFile ? (
                            <Image
                                src={fullAvatarUrl}
                                alt="プロフィール画像"
                                className={'profile-editor-image'}
                                width={100}
                                height={100}
                            />
                        ) : user.avatarUrl ? (
                            <Image
                                src={fullAvatarUrl}
                                alt="プロフィール画像"
                                className={'profile-editor-image'}
                                width={100}
                                height={100}
                            />
                        ) : profileImageUrl ? (
                            <Image
                                src={fullAvatarUrl}
                                alt="プロフィール画像"
                                className={'profile-editor-image'}
                                width={100}
                                height={100}
                            />
                        ) : (
                            <div className={'profile-editor-image-placeholder'}>
                                画像なし
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className={'profile-editor-image-input'}
                            id="profile-image-upload"
                        />
                        <label
                            htmlFor="profile-image-upload"
                            className={'profile-editor-image-button'}
                        >
                            画像を選択
                        </label>
                    </div>
                    <p className={'profile-editor-hint'}>
                        JPG、PNG形式、5MB以下の画像をアップロードしてください
                    </p>
                </div>

                <div className={'profile-editor-actions'}>
                    <button
                        type="submit"
                        className={'profile-editor-submit'}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '更新中...' : '更新する'}
                    </button>
                </div>
            </form>

            <div className={'profile-editor-info'}>
                <h3 className={'profile-editor-info-title'}>アカウント情報</h3>
                <div className={'profile-editor-info-item'}>
                    <span className={'profile-editor-info-label'}>メールアドレス:</span>
                    <span className={'profile-editor-info-value'}>{user.email}</span>
                </div>
                <div className={'profile-editor-info-item'}>
                    <span className={'profile-editor-info-label'}>会員ステータス:</span>
                    <span className={'profile-editor-info-value'}>
                        {user.isPaidMember && user.paidEndDate && new Date(user.paidEndDate) >= new Date()
                            ? '有料会員'
                            : '無料会員'}
                    </span>
                </div>
            </div>

            <div className={'profile-editor-subscription'}>
                <h3 className={'profile-editor-section-title'}>サブスクリプション情報</h3>
                <SubscriptionStatus user={user} />
            </div>
        </div>
    );
};
