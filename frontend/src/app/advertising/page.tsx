'use client';
import './advertising.css';

export default function AdvertisingPage() {
  return (
    <>
      <div className="advertising-page">
        <h1 className="advertising-title">広告掲載について</h1>
        <p className="advertising-description">
          福岡遊び日記は、福岡のローカル情報に特化したメディアとして、多くのユーザーに利用されています。
          店舗や施設の掲載、広告出稿についてのご案内です。
        </p>

        <section className="advertising-section">
          <h2 className="advertising-section-title">メディア概要</h2>
          <div className="advertising-media-info">
            <div className="advertising-media-stats">
              <div className="advertising-stat-item">
                <h3 className="advertising-stat-title">月間PV数</h3>
                <p className="advertising-stat-value">約150,000PV</p>
              </div>
              <div className="advertising-stat-item">
                <h3 className="advertising-stat-title">月間UU数</h3>
                <p className="advertising-stat-value">約50,000UU</p>
              </div>
              <div className="advertising-stat-item">
                <h3 className="advertising-stat-title">会員数</h3>
                <p className="advertising-stat-value">約10,000人</p>
              </div>
            </div>
            <div className="advertising-media-audience">
              <h3 className="advertising-audience-title">ユーザー属性</h3>
              <div className="advertising-audience-data">
                <div className="advertising-audience-item">
                  <h4 className="advertising-audience-label">年齢層</h4>
                  <p className="advertising-audience-value">20代〜30代が中心（全体の約70%）</p>
                </div>
                <div className="advertising-audience-item">
                  <h4 className="advertising-audience-label">性別</h4>
                  <p className="advertising-audience-value">女性60%、男性40%</p>
                </div>
                <div className="advertising-audience-item">
                  <h4 className="advertising-audience-label">地域</h4>
                  <p className="advertising-audience-value">福岡県内が85%、その他九州地方が10%、その他が5%</p>
                </div>
                <div className="advertising-audience-item">
                  <h4 className="advertising-audience-label">興味関心</h4>
                  <p className="advertising-audience-value">カフェ・レストラン、観光スポット、イベント情報、地元の隠れた名所</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="advertising-section">
          <h2 className="advertising-section-title">広告メニュー</h2>
          <div className="advertising-menu-list">
            <div className="advertising-menu-item">
              <div className="advertising-menu-header">
                <h3 className="advertising-menu-title">バナー広告</h3>
                <span className="advertising-menu-price">¥50,000〜/月</span>
              </div>
              <div className="advertising-menu-content">
                <div className="advertising-menu-image">
                  <div className="advertising-image-placeholder">
                    <p>バナー広告イメージ</p>
                  </div>
                </div>
                <div className="advertising-menu-details">
                  <p className="advertising-menu-description">
                    トップページやカテゴリページに表示されるバナー広告です。
                    サイズや掲載位置によって料金が異なります。
                  </p>
                  <ul className="advertising-menu-features">
                    <li>トップページ掲載（PCとスマホ対応）</li>
                    <li>カテゴリページ掲載</li>
                    <li>記事ページ掲載</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="advertising-menu-item">
              <div className="advertising-menu-header">
                <h3 className="advertising-menu-title">タイアップ記事</h3>
                <span className="advertising-menu-price">¥50,000〜/回</span>
              </div>
              <div className="advertising-menu-content">
                <div className="advertising-menu-image">
                  <div className="advertising-image-placeholder">
                    <p>タイアップ記事イメージ</p>
                  </div>
                </div>
                <div className="advertising-menu-details">
                  <p className="advertising-menu-description">
                    編集部が貴社の商品・サービスを取材し、記事として掲載します。
                    自然な形で魅力を伝えることができます。
                  </p>
                  <ul className="advertising-menu-features">
                    <li>オリジナル記事作成（取材・撮影込み）</li>
                    <li>SNS拡散（Instagram、Twitter）</li>
                    <li>トップページでの優先表示（2週間）</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="advertising-menu-item">
              <div className="advertising-menu-header">
                <h3 className="advertising-menu-title">店舗・施設情報掲載</h3>
                <span className="advertising-menu-price">¥10,000〜/年</span>
              </div>
              <div className="advertising-menu-content">
                <div className="advertising-menu-image">
                  <div className="advertising-image-placeholder">
                    <p>店舗情報掲載イメージ</p>
                  </div>
                </div>
                <div className="advertising-menu-details">
                  <p className="advertising-menu-description">
                    貴社の店舗・施設情報を詳細ページとして掲載します。
                    基本情報に加え、写真や特徴、営業時間などを掲載できます。
                  </p>
                  <ul className="advertising-menu-features">
                    <li>詳細な店舗情報ページの作成</li>
                    <li>検索結果への優先表示</li>
                    <li>情報更新（月1回まで無料）</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="advertising-menu-item">
              <div className="advertising-menu-header">
                <h3 className="advertising-menu-title">メールマガジン広告</h3>
                <span className="advertising-menu-price">¥20,000〜/回</span>
              </div>
              <div className="advertising-menu-content">
                <div className="advertising-menu-image">
                  <div className="advertising-image-placeholder">
                    <p>メルマガ広告イメージ</p>
                  </div>
                </div>
                <div className="advertising-menu-details">
                  <p className="advertising-menu-description">
                    会員向けに配信するメールマガジンに広告を掲載します。
                    ターゲットを絞った効果的なプロモーションが可能です。
                  </p>
                  <ul className="advertising-menu-features">
                    <li>会員向けメールマガジンへの広告掲載</li>
                    <li>テキスト広告またはバナー広告</li>
                    <li>属性指定配信可能（追加料金）</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="advertising-section">
          <h2 className="advertising-section-title">掲載までの流れ</h2>
          <div className="advertising-flow">
            <div className="advertising-flow-item">
              <div className="advertising-flow-number">1</div>
              <div className="advertising-flow-content">
                <h3 className="advertising-flow-title">お問い合わせ</h3>
                <p className="advertising-flow-description">
                  お問い合わせフォームまたはメールにてご連絡ください。
                  ご希望の広告メニューや掲載時期などをお知らせください。
                </p>
              </div>
            </div>
            <div className="advertising-flow-item">
              <div className="advertising-flow-number">2</div>
              <div className="advertising-flow-content">
                <h3 className="advertising-flow-title">ヒアリング・お見積り</h3>
                <p className="advertising-flow-description">
                  ご要望をヒアリングし、最適なプランをご提案します。
                  料金や掲載期間などの詳細をお見積りします。
                </p>
              </div>
            </div>
            <div className="advertising-flow-item">
              <div className="advertising-flow-number">3</div>
              <div className="advertising-flow-content">
                <h3 className="advertising-flow-title">ご契約</h3>
                <p className="advertising-flow-description">
                  お見積りにご納得いただけましたら、正式にご契約となります。
                  契約書の取り交わしを行います。
                </p>
              </div>
            </div>
            <div className="advertising-flow-item">
              <div className="advertising-flow-number">4</div>
              <div className="advertising-flow-content">
                <h3 className="advertising-flow-title">素材提供・制作</h3>
                <p className="advertising-flow-description">
                  広告素材のご提供または制作を行います。
                  タイアップ記事の場合は、取材・撮影・記事作成を行います。
                </p>
              </div>
            </div>
            <div className="advertising-flow-item">
              <div className="advertising-flow-number">5</div>
              <div className="advertising-flow-content">
                <h3 className="advertising-flow-title">掲載開始</h3>
                <p className="advertising-flow-description">
                  指定の日時より広告掲載を開始します。
                  掲載後は定期的にレポートをお送りします。
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="advertising-section">
          <h2 className="advertising-section-title">お問い合わせ</h2>
          <p className="advertising-contact-text">
            広告掲載に関するお問い合わせは、以下のフォームまたはメールにてお気軽にご連絡ください。
            担当者より3営業日以内にご連絡いたします。
          </p>
          <div className="advertising-contact-buttons">
            <a href="/contact" className="advertising-contact-button">お問い合わせフォーム</a>
            <p className="advertising-contact-email">
              <span className="advertising-email-label">メール：</span>
              <span className="advertising-email-address">fukuoka.asobi.nikki@gmail.com</span>
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
