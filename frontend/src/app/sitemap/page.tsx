'use client';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import '@styles/common.css';
import './sitemap.css';

export default function SitemapPage() {
    return (
        <div className="container">
            <Header />
            <div className="sitemap-page">
                <h1 className="sitemap-title">サイトマップ</h1>
                <p className="sitemap-description">
                    福岡遊び日記の全ページをカテゴリ別にまとめています。
                    お探しのページが見つからない場合は、<a href="/contact" className="sitemap-contact-link">お問い合わせフォーム</a>からお気軽にご連絡ください。
                </p>

                <div className="sitemap-container">
                    <div className="sitemap-section">
                        <h2 className="sitemap-section-title">メインページ</h2>
                        <ul className="sitemap-list">
                            <li className="sitemap-item">
                                <Link href="/" className="sitemap-link">トップページ</Link>
                                <span className="sitemap-description-text">福岡遊び日記のホームページです。最新情報やおすすめコンテンツをご紹介しています。</span>
                            </li>
                        </ul>
                    </div>

                    <div className="sitemap-section">
                        <h2 className="sitemap-section-title">プラン・スポット</h2>
                        <ul className="sitemap-list">
                            <li className="sitemap-item">
                                <Link href="/plans" className="sitemap-link">プラン一覧</Link>
                                <span className="sitemap-description-text">福岡を楽しむための様々なプランをご紹介しています。</span>
                            </li>
                            <li className="sitemap-item">
                                <Link href="/spots" className="sitemap-link">スポット一覧</Link>
                                <span className="sitemap-description-text">福岡市内および近郊のおすすめスポットをご紹介しています。</span>
                            </li>
                            <li className="sitemap-item">
                                <Link href="/search" className="sitemap-link">検索</Link>
                                <span className="sitemap-description-text">プランやスポットを条件を指定して検索できます。</span>
                            </li>
                        </ul>
                    </div>

                    <div className="sitemap-section">
                        <h2 className="sitemap-section-title">イベント・ニュース</h2>
                        <ul className="sitemap-list">
                            <li className="sitemap-item">
                                <Link href="/events" className="sitemap-link">イベント一覧</Link>
                                <span className="sitemap-description-text">福岡市内で開催される様々なイベント情報を掲載しています。</span>
                            </li>
                            <li className="sitemap-item">
                                <Link href="/news" className="sitemap-link">ニュース一覧</Link>
                                <span className="sitemap-description-text">福岡の最新ニュースや情報をお届けします。</span>
                            </li>
                        </ul>
                    </div>

                    <div className="sitemap-section">
                        <h2 className="sitemap-section-title">会員関連</h2>
                        <ul className="sitemap-list">
                            <li className="sitemap-item">
                                <Link href="/login" className="sitemap-link">ログイン</Link>
                                <span className="sitemap-description-text">会員の方はこちらからログインできます。</span>
                            </li>
                            <li className="sitemap-item">
                                <Link href="/register" className="sitemap-link">会員登録</Link>
                                <span className="sitemap-description-text">新規会員登録はこちらから行えます。</span>
                            </li>
                            <li className="sitemap-item">
                                <Link href="/mypage" className="sitemap-link">マイページ</Link>
                                <span className="sitemap-description-text">会員の方専用のページです。お気に入りやプロフィール設定などができます。</span>
                            </li>
                        </ul>
                    </div>

                    <div className="sitemap-section">
                        <h2 className="sitemap-section-title">企業・運営情報</h2>
                        <ul className="sitemap-list">
                            <li className="sitemap-item">
                                <Link href="/about" className="sitemap-link">福岡遊び日記について</Link>
                                <span className="sitemap-description-text">福岡遊び日記のコンセプトや運営理念についてご紹介しています。</span>
                            </li>
                            <li className="sitemap-item">
                                <Link href="/advertising" className="sitemap-link">広告掲載について</Link>
                                <span className="sitemap-description-text">広告掲載や店舗情報の掲載についてのご案内です。</span>
                            </li>
                            <li className="sitemap-item">
                                <Link href="/terms" className="sitemap-link">利用規約</Link>
                                <span className="sitemap-description-text">本サービスをご利用いただく際の規約です。</span>
                            </li>
                            <li className="sitemap-item">
                                <Link href="/privacy-policy" className="sitemap-link">プライバシーポリシー</Link>
                                <span className="sitemap-description-text">個人情報の取り扱いについての方針です。</span>
                            </li>
                        </ul>
                    </div>

                    <div className="sitemap-section">
                        <h2 className="sitemap-section-title">サポート</h2>
                        <ul className="sitemap-list">
                            <li className="sitemap-item">
                                <Link href="/contact" className="sitemap-link">お問い合わせ</Link>
                                <span className="sitemap-description-text">ご質問やお問い合わせはこちらからお願いします。</span>
                            </li>
                            <li className="sitemap-item">
                                <Link href="/faq" className="sitemap-link">よくある質問</Link>
                                <span className="sitemap-description-text">よくいただくご質問とその回答をまとめています。</span>
                            </li>
                            <li className="sitemap-item">
                                <Link href="/sitemap" className="sitemap-link">サイトマップ</Link>
                                <span className="sitemap-description-text">本サイトの全ページをカテゴリ別にまとめています。</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="sitemap-search-section">
                    <h2 className="sitemap-search-title">お探しのページが見つからない場合</h2>
                    <p className="sitemap-search-text">
                        お探しのページが見つからない場合は、検索機能をご利用いただくか、
                        <a href="/contact" className="sitemap-contact-link">お問い合わせフォーム</a>からお気軽にご連絡ください。
                    </p>
                    <div className="sitemap-search-form">
                        <input type="text" className="sitemap-search-input" placeholder="キーワードを入力" />
                        <button className="sitemap-search-button">検索</button>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
