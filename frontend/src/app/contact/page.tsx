'use client';
import { useState, FormEvent, ChangeEvent } from 'react';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import '@styles/common.css';
import './contact.css';

type FormData = {
    email: string;
    subject: string;
    inquiry_type: string;
    message: string;
    privacy_policy: boolean;
};

type FormErrors = {
    [key in keyof FormData]?: string;
};

export default function ContactPage() {
    const [formData, setFormData] = useState<FormData>({
        email: '',
        subject: '',
        inquiry_type: '',
        message: '',
        privacy_policy: false
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        // メールアドレスのバリデーション
        if (!formData.email) {
            newErrors.email = 'メールアドレスを入力してください';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = '有効なメールアドレスを入力してください';
        }

        // 件名のバリデーション
        if (!formData.subject) {
            newErrors.subject = '件名を入力してください';
        } else if (formData.subject.length > 50) {
            newErrors.subject = '件名は50文字以内で入力してください';
        }

        // お問い合わせ種別のバリデーション
        if (!formData.inquiry_type) {
            newErrors.inquiry_type = 'お問い合わせ種別を選択してください';
        }

        // お問い合わせ内容のバリデーション
        if (!formData.message) {
            newErrors.message = 'お問い合わせ内容を入力してください';
        } else if (formData.message.length > 500) {
            newErrors.message = 'お問い合わせ内容は500文字以内で入力してください';
        }

        // プライバシーポリシーのバリデーション
        if (!formData.privacy_policy) {
            newErrors.privacy_policy = 'プライバシーポリシーに同意してください';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/v1/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ contact: formData }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                // フォームをリセット
                setFormData({
                    email: '',
                    subject: '',
                    inquiry_type: '',
                    message: '',
                    privacy_policy: false
                });
            } else {
                setSubmitStatus('error');
                setErrorMessage(data.errors ? data.errors.join(', ') : data.message || 'エラーが発生しました');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            setSubmitStatus('error');
            setErrorMessage('通信エラーが発生しました。しばらく経ってからお試しください。');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container">
            <Header />
            <div className="contact-page">
                <h1 className="contact-title">お問い合わせ</h1>
                <p className="contact-description">
                    福岡遊び日記に関するご質問、ご意見、お問い合わせは以下のフォームからお願いいたします。通常、営業日3日以内にご返信いたします。
                </p>

                {submitStatus === 'success' && (
                    <div className="contact-success-message">
                        <p>お問い合わせを送信しました。ありがとうございます。</p>
                        <p>内容を確認の上、担当者より回答させていただきます。</p>
                    </div>
                )}

                {submitStatus === 'error' && (
                    <div className="contact-error-message">
                        <p>送信に失敗しました。</p>
                        <p>{errorMessage}</p>
                    </div>
                )}

                <form className="contact-form" onSubmit={handleSubmit}>
                    <div className="contact-form-group">
                        <label htmlFor="email" className="contact-form-label">メールアドレス <span className="contact-required">必須</span></label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className={`contact-form-input ${errors.email ? 'contact-form-input-error' : ''}`}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        {errors.email && <p className="contact-form-error">{errors.email}</p>}
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="subject" className="contact-form-label">件名 <span className="contact-required">必須</span></label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            className={`contact-form-input ${errors.subject ? 'contact-form-input-error' : ''}`}
                            value={formData.subject}
                            onChange={handleChange}
                            required
                        />
                        {errors.subject && <p className="contact-form-error">{errors.subject}</p>}
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="inquiry_type" className="contact-form-label">お問い合わせ種別 <span className="contact-required">必須</span></label>
                        <select
                            id="inquiry_type"
                            name="inquiry_type"
                            className={`contact-form-select ${errors.inquiry_type ? 'contact-form-input-error' : ''}`}
                            value={formData.inquiry_type}
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
                        {errors.inquiry_type && <p className="contact-form-error">{errors.inquiry_type}</p>}
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="message" className="contact-form-label">お問い合わせ内容 <span className="contact-required">必須</span></label>
                        <textarea
                            id="message"
                            name="message"
                            className={`contact-form-textarea ${errors.message ? 'contact-form-input-error' : ''}`}
                            rows={6}
                            value={formData.message}
                            onChange={handleChange}
                            required
                        ></textarea>
                        {errors.message && <p className="contact-form-error">{errors.message}</p>}
                        <p className="contact-form-help">500文字以内で入力してください。現在: {formData.message.length}文字</p>
                    </div>

                    <div className="contact-form-group">
                        <div className="contact-privacy-agreement">
                            <input
                                type="checkbox"
                                id="privacy_policy"
                                name="privacy_policy"
                                className={`contact-form-checkbox ${errors.privacy_policy ? 'contact-form-input-error' : ''}`}
                                checked={formData.privacy_policy}
                                onChange={handleChange}
                                required
                            />
                            <label htmlFor="privacy_policy" className="contact-form-checkbox-label">
                                <a href="/privacy-policy" className="contact-privacy-link" target="_blank" rel="noopener noreferrer">プライバシーポリシー</a>に同意します
                            </label>
                        </div>
                        {errors.privacy_policy && <p className="contact-form-error">{errors.privacy_policy}</p>}
                    </div>

                    <div className="contact-form-actions">
                        <button
                            type="submit"
                            className="contact-form-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? '送信中...' : '送信する'}
                        </button>
                    </div>
                </form>

                <div className="contact-info">
                    <h2 className="contact-info-title">その他のお問い合わせ方法</h2>
                    <div className="contact-info-item">
                        <h3 className="contact-info-subtitle">メールでのお問い合わせ</h3>
                        <p className="contact-info-text">fukuoka.asobi.nikki@gmail.com</p>
                    </div>
                    <div className="contact-info-item">
                        <h3 className="contact-info-subtitle">SNSでのお問い合わせ</h3>
                        <p className="contact-info-text">
                            各SNSのDMからもお問い合わせいただけます。<br />
                            <a href="https://www.instagram.com/fukuoka___cafe/" className="contact-sns-link" target="_blank" rel="noopener noreferrer">Instagram</a>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
