import Image from 'next/image';

export const Footer = () => {
    return (
        <footer className="footer">
            <p className="footer-title">事業者・店舗関係の皆さま</p>
            <ul className="footer-nav">
                <li className="footer-nav-item">
                    <a href="#" className="footer-nav-link">お問い合わせ</a>
                </li>
                <li className="footer-nav-item">
                    <a href="#" className="footer-nav-link">よくある質問</a>
                </li>
                <li className="footer-nav-item">
                    <a href="#" className="footer-nav-link">広告掲載について</a>
                </li>
                <li className="footer-nav-item">
                    <a href="#" className="footer-nav-link">プライバシーポリシー</a>
                </li>
                <li className="footer-nav-item">
                    <a href="#" className="footer-nav-link">サイトマップ</a>
                </li>
            </ul>
            <Image className="footer-logo" src={'/logo_inversion.png'} width={190} height={45} alt="footer img" />
            <p className="footer-text">ここには事業者に向けたサービス説明に関する情報を記載する。ここには事業者に向けたサービス説明に関する情報を記載する。ここには事業者に向けたサービス説明に関する情報を記載する。</p>
            <ul className="footer-account-nav">
                <li className="footer-nav-item">
                    <a href="" className="footer-nav-link">
                        <Image src={'/Instagram-logo.svg'} alt='インスタグラムアイコン' width={30} height={30} />
                    </a>
                </li>
                <li className="footer-nav-item">
                    <a href="" className="footer-nav-link">
                        <Image src={'/threads-logo.svg'} alt='Threadsアイコン' width={100} height={40} />
                    </a>
                </li>
            </ul>
        </footer>
    )
}

export default Footer;