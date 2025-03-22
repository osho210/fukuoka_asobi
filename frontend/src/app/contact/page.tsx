'use client';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import '../../../public/styles/common.css';
import './contact.css';

export default function ContactPage() {
    return (
        <div className="container">
            <Header />
            <div className="contact-page">
                <h1 className="contact-title">お問い合わせ</h1>
                <p className="contact-description">
                    福岡遊び日記に関するご質問、ご意見、お問い合わせは以下のフォームからお願いいたします。
                    通常、営業日3日以内にご返信いたします。
                </p>

                <form className="contact-form">
                    <div className="contact-form-group">
                        <label htmlFor="name" className="contact-form-label">お名前 <span className="contact-required">必須</span></label>
                        <input type="text" id="name" className="contact-form-input" required />
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="email" className="contact-form-label">メールアドレス <span className="contact-required">必須</span></label>
                        <input type="email" id="email" className="contact-form-input" required />
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="subject" className="contact-form-label">件名 <span className="contact-required">必須</span></label>
                        <input type="text" id="subject" className="contact-form-input" required />
                    </div>

                    <div className="contact-form-group">
                        <label htmlFor="inquiry-type" className="contact-form-label">お問い合わせ種別 <span className="contact-required">必須</span></label>
                        <select id="inquiry-type" className="contact-form-select" required>
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
                        <textarea id="message" className="contact-form-textarea" rows={6} required></textarea>
                    </div>

                    <div className="contact-form-group">
                        <div className="contact-privacy-agreement">
                            <input type="checkbox" id="privacy-agreement" className="contact-form-checkbox" required />
                            <label htmlFor="privacy-agreement" className="contact-form-checkbox-label">
                                <a href="/privacy-policy" className="contact-privacy-link">プライバシーポリシー</a>に同意します
                            </label>
                        </div>
                    </div>

                    <div className="contact-form-actions">
                        <button type="submit" className="contact-form-submit">送信する</button>
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
                            <a href="https://www.instagram.com/fukuoka___cafe/" className="contact-sns-link">Instagram</a>
                        </p>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
