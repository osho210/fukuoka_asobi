'use client';
import { Header } from '@/components/Header';
import Footer from '@/components/Footer';
import { useState } from 'react';
import '@styles/common.css';
import './faq.css';

// FAQデータ
const faqData = [
    {
        category: 'サービスについて',
        questions: [
            {
                id: 'service-1',
                question: '福岡遊び日記とはどのようなサービスですか？',
                answer: '福岡遊び日記は、福岡を愛してやまない博多っ子が運営する、ローカル情報メディアです。普段の暮らしでは知ることができない、一歩踏み込んだ情報を発信しています。地元の人しか知らない「通」なお店、今までの自分ではいかなかった「一歩背伸び」するお店など、心の琴線に触れるお店探しのお手伝いをするメディアです。'
            },
            {
                id: 'service-2',
                question: '利用料金はかかりますか？',
                answer: '基本的な情報閲覧は無料でご利用いただけます。一部の特別コンテンツや機能については、有料会員向けのサービスとして提供しています。詳細は会員登録ページをご確認ください。'
            },
            {
                id: 'service-3',
                question: 'どのような情報が掲載されていますか？',
                answer: '福岡市内および近郊のカフェ、レストラン、観光スポット、イベント情報などを掲載しています。特に地元の方しか知らないような隠れた名所や、通好みのスポットを中心に紹介しています。'
            }
        ]
    },
    {
        category: '会員登録・ログインについて',
        questions: [
            {
                id: 'account-1',
                question: '会員登録はどのように行えばよいですか？',
                answer: 'トップページ右上の「会員登録」ボタンから登録ページへアクセスし、必要事項を入力して登録を完了させてください。メールアドレスでの登録のほか、各種SNSアカウントを利用した登録も可能です。'
            },
            {
                id: 'account-2',
                question: 'パスワードを忘れてしまいました。',
                answer: 'ログインページの「パスワードをお忘れの方」リンクから、パスワードリセット手続きを行ってください。登録時のメールアドレスにリセット用のリンクが送信されます。'
            },
            {
                id: 'account-3',
                question: '退会するにはどうすればよいですか？',
                answer: 'マイページの「アカウント設定」から退会手続きを行うことができます。退会前に、有料会員の方は契約状況をご確認ください。退会後はデータが完全に削除され、復旧できませんのでご注意ください。'
            }
        ]
    },
    {
        category: 'コンテンツ・機能について',
        questions: [
            {
                id: 'content-1',
                question: 'プランの保存や共有はできますか？',
                answer: '会員登録をすると、気に入ったプランをお気に入りに保存したり、友達や家族と共有したりすることができます。マイページから保存したプランを管理できます。'
            },
            {
                id: 'content-2',
                question: '情報は定期的に更新されますか？',
                answer: '店舗情報やイベント情報等随時更新しています。各店舗の影響時間は月に1度googleマップを確認し、更新しています。'
            },
            {
                id: 'content-3',
                question: '自分でプランを作成することはできますか？',
                answer: 'オリジナルのプランを作成し、公開することができます。作成したプランは審査後、サイト上で他のユーザーにも共有されます。'
            }
        ]
    },
    {
        category: '店舗・施設オーナーの方へ',
        questions: [
            {
                id: 'owner-1',
                question: '自分の店舗を掲載してもらうにはどうすればよいですか？',
                answer: '「広告掲載について」ページから掲載申請フォームにアクセスし、必要事項を入力の上、お申し込みください。担当者が内容を確認後、ご連絡いたします。'
            },
            {
                id: 'owner-2',
                question: '掲載されている情報を修正したいです。',
                answer: 'お問い合わせフォームから「掲載情報の修正依頼」を選択し、修正が必要な内容をお知らせください。確認後、速やかに対応いたします。'
            },
            {
                id: 'owner-3',
                question: '広告を出稿することはできますか？',
                answer: '各種広告プランをご用意しています。バナー広告やタイアップ記事など、ニーズに合わせたプランをご提案いたします。詳細は「広告掲載について」ページをご確認ください。'
            }
        ]
    }
];

export default function FAQPage() {
    const [activeCategory, setActiveCategory] = useState(faqData[0].category);
    const [openQuestions, setOpenQuestions] = useState<string[]>([]);

    const toggleQuestion = (id: string) => {
        if (openQuestions.includes(id)) {
            setOpenQuestions(openQuestions.filter(item => item !== id));
        } else {
            setOpenQuestions([...openQuestions, id]);
        }
    };

    return (
        <div className="container">
            <Header />
            <div className="faq-page">
                <h1 className="faq-title">よくある質問</h1>
                <p className="faq-description">
                    福岡遊び日記に関するよくある質問をまとめました。
                    お探しの情報が見つからない場合は、<a href="/contact" className="faq-contact-link">お問い合わせフォーム</a>からお気軽にご連絡ください。
                </p>

                <div className="faq-container">
                    <div className="faq-categories">
                        {faqData.map(category => (
                            <button
                                key={category.category}
                                className={`faq-category-button ${activeCategory === category.category ? 'faq-category-active' : ''}`}
                                onClick={() => setActiveCategory(category.category)}
                            >
                                {category.category}
                            </button>
                        ))}
                    </div>

                    <div className="faq-content">
                        {faqData.map(category => (
                            category.category === activeCategory && (
                                <div key={category.category} className="faq-category-content">
                                    <h2 className="faq-category-title">{category.category}</h2>
                                    <div className="faq-questions">
                                        {category.questions.map(item => (
                                            <div key={item.id} className="faq-question-item">
                                                <button
                                                    className={`faq-question-button ${openQuestions.includes(item.id) ? 'faq-question-open' : ''}`}
                                                    onClick={() => toggleQuestion(item.id)}
                                                >
                                                    {item.question}
                                                    <span className="faq-question-icon">{openQuestions.includes(item.id) ? '−' : '＋'}</span>
                                                </button>
                                                {openQuestions.includes(item.id) && (
                                                    <div className="faq-answer">
                                                        <p>{item.answer}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        ))}
                    </div>
                </div>

                <div className="faq-contact-section">
                    <h2 className="faq-contact-title">お探しの情報が見つかりませんでしたか？</h2>
                    <p className="faq-contact-text">
                        ご質問やご不明点がございましたら、お気軽にお問い合わせください。
                        担当者が丁寧にお答えいたします。
                    </p>
                    <a href="/contact" className="faq-contact-button">お問い合わせはこちら</a>
                </div>
            </div>
            <Footer />
        </div>
    );
}
