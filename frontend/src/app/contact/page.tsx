'use client';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { SEND_CONTACT_MESSAGE } from '@/graphql/contact';
import './contact.css';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        category: '',
        message: '',
        privacyAccepted: false,
    });

    const [errors, setErrors] = useState<string[]>([]);
    const [successMessage, setSuccessMessage] = useState('');

    const [sendContactMessage, { loading }] = useMutation(SEND_CONTACT_MESSAGE, {
        onCompleted: (data) => {
            if (data.sendContactMessage.success) {
                setSuccessMessage('お問い合わせを受け付けました。ご連絡ありがとうございます。');
                setErrors([]);
                // フォームをリセット
                setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    category: '',
                    message: '',
                    privacyAccepted: false,
                });
            } else {
                setErrors(data.sendContactMessage.errors || ['送信に失敗しました。']);
                setSuccessMessage('');
            }
        },
        onError: (error) => {
            setErrors([`エラーが発生しました: ${error.message}`]);
            setSuccessMessage('');
        },
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { id, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        // フィールド ID からステートのキーへのマッピング
        let fieldName = id;
        if (id === 'inquiry-type') {
            fieldName = 'category';
        } else if (id === 'privacy-agreement') {
            fieldName = 'privacyAccepted';
        }

        setFormData((prev) => ({
            ...prev,
            [fieldName]: type === 'checkbox' ? checked : value,
        }));
    };

    const validateForm = () => {
        const newErrors: string[] = [];

        // メールアドレス形式の正規表現（バックエンドと一致）
        const emailRegex = /^[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+$/i;

        if (!formData.name.trim()) {
            newErrors.push('お名前を入力してください。');
        }
        if (!formData.email.trim()) {
            newErrors.push('メールアドレスを入力してください。');
        } else if (!emailRegex.test(formData.email)) {
            newErrors.push('メールアドレスの形式が正しくありません。');
        }
        if (!formData.subject.trim()) {
            newErrors.push('件名を入力してください。');
        }
        if (!formData.category) {
            newErrors.push('お問い合わせ種別を選択してください。');
        }
        if (!formData.message.trim()) {
            newErrors.push('お問い合わせ内容を入力してください。');
        }
        if (!formData.privacyAccepted) {
            newErrors.push('プライバシーポリシーに同意してください。');
        }

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationErrors = validateForm();
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            setSuccessMessage('');
            return;
        }

        try {
            await sendContactMessage({
                variables: {
                    name: formData.name,
                    email: formData.email,
                    subject: formData.subject,
                    category: formData.category,
                    message: formData.message,
                    privacyAccepted: formData.privacyAccepted,
                },
            });
        } catch {
            // エラーは onError で処理される
        }
    };

    return (
        <>
            <div className="contact-page">
                <h1 className="contact-title">お問い合わせ</h1>
                {/* TODO: 一旦はインスタグラムDMにて対応、将来的にはSESの導入を検討 */}
                {/* <p className="contact-description">
                    福岡遊び日記に関するご質問、ご意見、お問い合わせは以下のフォームからお願いいたします。
                    通常、営業日3日以内にご返信いたします。
                </p>

                {/* 成功メッセージ */}
                {successMessage && (
                    <div className="contact-success-message">
                        {successMessage}
                    </div>
                )}

                {/* エラーメッセージ */}
                {errors.length > 0 && (
                    <div className="contact-error-messages">
                        {errors.map((error, index) => (
                            <div key={index} className="contact-error-message">
                                {error}
                            </div>
                        ))}
                    </div>
                )}

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="contact-form-group">
                        <label htmlFor="name" className="contact-form-label">お名前 <span className="contact-required">必須</span></label>
                        <input
                            type="text"
                            id="name"
                            className="contact-form-input"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="email" className="contact-form-label">メールアドレス <span className="contact-required">必須</span></label>
                        <input
                            type="email"
                            id="email"
                            className="contact-form-input"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="subject" className="contact-form-label">件名 <span className="contact-required">必須</span></label>
                        <input
                            type="text"
                            id="subject"
                            className="contact-form-input"
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="inquiry-type" className="contact-form-label">お問い合わせ種別 <span className="contact-required">必須</span></label>
                        <select
                            id="inquiry-type"
                            className="contact-form-select"
                            value={formData.category}
                            onChange={handleChange}
                            required
                        >
                            <option value="">選択してください</option>
                            <option value="general">一般的なお問い合わせ</option>
                            <option value="business">ビジネスに関するお問い合わせ</option>
                            <option value="media">メディア掲載について</option>
                            <option value="error">サイトのエラー報告</option>
                            <option value="other">その他</option>
                        </select>
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="message" className="contact-form-label">お問い合わせ内容 <span className="contact-required">必須</span></label>
                        <textarea
                            id="message"
                            className="contact-form-textarea"
                            rows={6}
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>

                    <div className="contact-form-group">
                        <div className="contact-privacy-agreement">
                            <input
                                type="checkbox"
                                id="privacy-agreement"
                                className="contact-form-checkbox"
                                checked={formData.privacyAccepted}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="privacy-agreement" className="contact-form-checkbox-label">
                                <a href="/privacy-policy" className="contact-privacy-link">プライバシーポリシー</a>に同意します
                            </label>
                        </div>
                    </div>

                    <div className="contact-form-actions">
                        <button
                            type="submit"
                            className="contact-form-submit"
                            disabled={loading}
                        >
                            {loading ? '送信中...' : '送信する'}
                        </button>
                    </div>
                </form> */}

                <div className="contact-info">
                    {/* <h2 className="contact-info-title">その他のお問い合わせ方法</h2> */}
                    <div className="contact-info-item">
                        <h3 className="contact-info-subtitle">メールでのお問い合わせ</h3>
                        <p className="contact-info-text">fukuoka.asobi.nikki@gmail.com</p>
                    </div>
                    <div className="contact-info-item">
                        <h3 className="contact-info-subtitle">SNSでのお問い合わせ</h3>
                        <p className="contact-info-text">
                            各SNSのDMからもお問い合わせいただけます。<br />
                            <a href="https://www.instagram.com/fukuoka___cafe/" className="contact-sns-link">Instagram</a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
