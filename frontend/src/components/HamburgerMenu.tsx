import React, { useState } from 'react';
import '../../public/styles/HamburgerMenu.css';

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
                                <a href='login'>ログイン</a>
                            </li>
                            <li className='modal-content__link'>
                                <a href='#'>遊びを計画する</a>
                            </li>
                            <li className='modal-content__link'>
                                <a href='#'>福岡遊び日記日記とは</a>
                            </li>
                            <li className='modal-content__link'>
                                <a href='#'>お問い合わせ</a>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;