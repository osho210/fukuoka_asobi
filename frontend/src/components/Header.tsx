'use client'
import Link from 'next/link';
import Image from 'next/image';
import HamburgerMenu from '@/components/HamburgerMenu';


export const Header = () => {
    return (
        <header className="header">
            <Link href={'/'}>
                <h1>
                    <Image className="logo" src={'/logo.png'} width={190} height={45} alt="kv" />
                </h1>
            </Link>

            <HamburgerMenu />
        </header>
    );
}
