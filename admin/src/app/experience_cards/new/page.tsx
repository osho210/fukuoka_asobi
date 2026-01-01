'use client';

import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/navigation';
import '@/styles/experience-cards.css';
import { CREATE_EXPERIENCE_CARD } from '@/graphql/mutations/experienceCards';
import { GET_ALL_EXPERIENCE_CARDS } from '@/graphql/queries/getExperienceCards';
import type { CreateExperienceCardMutation } from '@/__generated__/types';

interface FormData {
    title: string;
    body: string;
    tags: string[];
    area: string;
    duration: string;
    timeSlot: string;
    active: boolean;
}

export default function NewExperienceCardPage() {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        title: '',
        body: '',
        tags: [],
        area: '',
        duration: '',
        timeSlot: '',
        active: true,
    });
    const [tagInput, setTagInput] = useState('');
    const [errors, setErrors] = useState<Record<string, string>>({});

    const [createExperienceCard, { loading }] = useMutation<CreateExperienceCardMutation>(
        CREATE_EXPERIENCE_CARD,
        {
            refetchQueries: [{ query: GET_ALL_EXPERIENCE_CARDS }],
            onCompleted: (data) => {
                if (data.createExperienceCard?.experienceCard) {
                    router.push('/experience_cards');
                } else if (data.createExperienceCard?.errors) {
                    setErrors({ submit: data.createExperienceCard.errors[0] || '作成に失敗しました' });
                }
            },
            onError: (error) => {
                setErrors({ submit: error.message });
            },
        }
    );

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.currentTarget;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.currentTarget as HTMLInputElement).checked : value,
        }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const handleAddTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData((prev) => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()],
            }));
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        setFormData((prev) => ({
            ...prev,
            tags: prev.tags.filter((tag) => tag !== tagToRemove),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // バリデーション
        const newErrors: Record<string, string> = {};
        if (!formData.title.trim()) {
            newErrors.title = 'タイトルは必須です';
        }
        if (!formData.body.trim()) {
            newErrors.body = '本文は必須です';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        await createExperienceCard({
            variables: {
                input: {
                    title: formData.title,
                    body: formData.body,
                    tags: formData.tags,
                    area: formData.area || null,
                    duration: formData.duration || null,
                    timeSlot: formData.timeSlot || null,
                    active: formData.active,
                },
            },
        });
    };

    return (
        <div className="experience-cards">
            <div className="experience-cards__header">
                <h1 className="experience-cards__title">新規体験カード作成</h1>
            </div>

            <form onSubmit={handleSubmit} className="experience-cards__form">
                {errors.submit && (
                    <div className="experience-cards__error-message">{errors.submit}</div>
                )}

                {/* タイトル */}
                <div className="experience-cards__form-group">
                    <label htmlFor="title" className="experience-cards__label">
                        タイトル <span className="experience-cards__required">*</span>
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="例：静かなカフェでリラックス"
                        className={`experience-cards__input ${errors.title ? 'experience-cards__input--error' : ''}`}
                    />
                    {errors.title && <p className="experience-cards__error">{errors.title}</p>}
                </div>

                {/* 本文 */}
                <div className="experience-cards__form-group">
                    <label htmlFor="body" className="experience-cards__label">
                        本文 <span className="experience-cards__required">*</span>
                    </label>
                    <textarea
                        id="body"
                        name="body"
                        value={formData.body}
                        onChange={handleInputChange}
                        placeholder="体験についての詳細を入力してください"
                        rows={5}
                        className={`experience-cards__textarea ${errors.body ? 'experience-cards__textarea--error' : ''}`}
                    />
                    {errors.body && <p className="experience-cards__error">{errors.body}</p>}
                </div>

                {/* エリア */}
                <div className="experience-cards__form-group">
                    <label htmlFor="area" className="experience-cards__label">
                        エリア
                    </label>
                    <input
                        type="text"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        placeholder="例：天神"
                        className="experience-cards__input"
                    />
                </div>

                {/* 所要時間 */}
                <div className="experience-cards__form-group">
                    <label htmlFor="duration" className="experience-cards__label">
                        所要時間
                    </label>
                    <input
                        type="text"
                        id="duration"
                        name="duration"
                        value={formData.duration}
                        onChange={handleInputChange}
                        placeholder="例：2時間"
                        className="experience-cards__input"
                    />
                </div>

                {/* 時間帯 */}
                <div className="experience-cards__form-group">
                    <label htmlFor="timeSlot" className="experience-cards__label">
                        時間帯
                    </label>
                    <select
                        id="timeSlot"
                        name="timeSlot"
                        value={formData.timeSlot}
                        onChange={handleInputChange}
                        className="experience-cards__select"
                    >
                        <option value="">選択してください</option>
                        <option value="朝">朝</option>
                        <option value="昼">昼</option>
                        <option value="夕方">夕方</option>
                        <option value="夜">夜</option>
                        <option value="深夜">深夜</option>
                    </select>
                </div>

                {/* タグ */}
                <div className="experience-cards__form-group">
                    <label htmlFor="tags" className="experience-cards__label">
                        タグ
                    </label>
                    <div className="experience-cards__tag-input-group">
                        <input
                            type="text"
                            id="tags"
                            value={tagInput}
                            onChange={(e) => setTagInput(e.target.value)}
                            onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddTag();
                                }
                            }}
                            placeholder="タグを入力してEnterキーで追加"
                            className="experience-cards__input"
                        />
                        <button
                            type="button"
                            onClick={handleAddTag}
                            className="experience-cards__tag-add-button"
                        >
                            追加
                        </button>
                    </div>
                    <div className="experience-cards__tags-display">
                        {formData.tags.map((tag) => (
                            <span key={tag} className="experience-cards__tag-item">
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="experience-cards__tag-remove"
                                    aria-label={`${tag}を削除`}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* アクティブ */}
                <div className="experience-cards__form-group">
                    <label className="experience-cards__checkbox-label">
                        <input
                            type="checkbox"
                            name="active"
                            checked={formData.active}
                            onChange={handleInputChange}
                            className="experience-cards__checkbox"
                        />
                        <span>アクティブ（公開状態）</span>
                    </label>
                </div>

                {/* ボタン */}
                <div className="experience-cards__form-actions">
                    <button
                        type="button"
                        onClick={() => router.push('/experience_cards')}
                        className="experience-cards__button experience-cards__button--cancel"
                        disabled={loading}
                    >
                        キャンセル
                    </button>
                    <button
                        type="submit"
                        className="experience-cards__button experience-cards__button--submit"
                        disabled={loading}
                    >
                        {loading ? '作成中...' : '作成'}
                    </button>
                </div>
            </form>
        </div>
    );
}