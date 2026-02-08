import Image from 'next/image';

export const Footer = () => {
    return (
        <footer className="footer">
            <p className="footer-title">福岡遊び日記について</p>
            <p className="footer-text">
                福岡遊び日記は、福岡での遊びや日常のひとコマを彩るような体験を集めたサービスです。
                日記をめくるように気になる場所や体験に出会えます。
            </p>
            <ul className="footer-nav">
                <li className="footer-nav-item">
                    <a href="/contact" className="footer-nav-link">お問い合わせ</a>
                </li>
                <li className="footer-nav-item">
                    <a href="/faq" className="footer-nav-link">よくある質問</a>
                </li>
                {/* TODO: 現状はサービス拡張を目指すのでコメントアウト */}
                {/* <li className="footer-nav-item">
                    <a href="/advertising" className="footer-nav-link">広告掲載について</a>
                </li> */}
                <li className="footer-nav-item">
                    <a href="/terms-of-service" className="footer-nav-link">利用規約</a>
                </li>
                <li className="footer-nav-item">
                    <a href="/privacy-policy" className="footer-nav-link">プライバシーポリシー</a>
                </li>
                <li className="footer-nav-item">
                    <a href="/sitemap" className="footer-nav-link">サイトマップ</a>
                </li>
            </ul>
            <Image className="footer-logo" src={'/logo_inversion.png'} width={190} height={45} alt="福岡あそびロゴ" />
            <ul className="footer-account-nav">
                <li className="footer-nav-item">
                    <a href="https://www.instagram.com/fukuoka___cafe/" className="footer-nav-link instagram" target="_blank" rel="noopener noreferrer">
                        <Image src={'/Instagram-logo.svg'} alt='インスタグラムアイコン' width={30} height={30} />
                        <p>Instagram</p>
                    </a>
                </li>
                <li className="footer-nav-item">
                    <a href="https://www.threads.com/@fukuoka___cafe" className="footer-nav-link" target="_blank" rel="noopener noreferrer">
                        <Image src={'/threads-logo.svg'} alt='Threadsアイコン' width={100} height={40} />
                    </a>
                </li>
            </ul>
        </footer>
    )
}

export default Footer;
