import React, { useState } from 'react';
import '@styles/HamburgerMenu.css';
import Link from 'next/link';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <div className={`hamburger-menu ${isOpen ? 'open' : ''}`} onClick={toggleModal}>
                <div className='hamburger-menu__bar'></div>
                <div className='hamburger-menu__bar'></div>
            </div>
            {isOpen && (
                <div className='modal'>
                    <div className='modal-content'>
                        <div className='modal-content__close' onClick={toggleModal}>
                            <div className='modal-content__close-icon'></div>
                        </div>
                        <ul className='modal-content__links'>
                            <li className='modal-content__link'>
                                <Link href='/login'>ログイン</Link>
                            </li>
                            <li className='modal-content__link'>
                                <Link href='/plans'>遊びを計画する</Link>
                            </li>
                            <li className='modal-content__link'>
                                <Link href='/about'>福岡遊び日記とは</Link>
                            </li>
                            <li className='modal-content__link'>
                                <Link href='/contact'>お問い合わせ</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
