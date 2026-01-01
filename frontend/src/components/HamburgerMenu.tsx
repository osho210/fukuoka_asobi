'use client';

import React, { useState, useEffect } from 'react';
import '@/styles/HamburgerMenu.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

const HamburgerMenu = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const { isLoggedIn, loading } = useAuth();
    const pathname = usePathname();

    // パスが変更されたらメニューを閉じる
    useEffect(() => {
        if (isOpen) {
            setIsOpen(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const showLogoutConfirmation = () => {
        setShowLogoutConfirm(true);
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/v1/logout', {
                method: 'DELETE',
                credentials: 'include',
            });

            // ページをリロードしてログアウト状態を反映
            window.location.href = '/';
        } catch (error) {
            console.error('ログアウト中にエラーが発生しました:', error);
        } finally {
            setShowLogoutConfirm(false);
        }
    };

    return (
        <div>
            <div className='hamburger-menu-container'>
                <div className={`hamburger-menu ${isOpen ? 'open' : ''}`} onClick={toggleModal}>
                    <div className='hamburger-menu__bar'></div>
                    <div className='hamburger-menu__bar'></div>
                </div>
            </div>
            {isOpen && (
                <div className='modal'>
                    <div className='modal-content'>
                        <div className='modal-content__close' onClick={toggleModal}>
                            <div className='modal-content__close-icon'></div>
                        </div>
                        <ul className='modal-content__links'>
                            {loading ? (
                                <li className='modal-content__link'>
                                    <span>読み込み中...</span>
                                </li>
                            ) : isLoggedIn ? (
                                <>
                                    <li className='modal-content__link'>
                                        <Link href='/mypage'>マイページ</Link>
                                    </li>
                                    <li className='modal-content__link'>
                                        <p onClick={showLogoutConfirmation} className='logout-button'>ログアウト</p>
                                    </li>
                                </>
                            ) : (
                                <li className='modal-content__link'>
                                    <Link href='/login'>ログイン</Link>
                                </li>
                            )}
                            <li className='modal-content__link'>
                                <Link href='/search'>遊びを計画する</Link>
                            </li>
                            <li className='modal-content__link'>
                                <Link href='/group-experience'>友達と遊びを決める</Link>
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

            {/* ログアウト確認ダイアログ */}
            {showLogoutConfirm && (
                <div className='logout-confirm-overlay'>
                    <div className='logout-confirm-dialog'>
                        <h3>ログアウト確認</h3>
                        <p>ログアウトしてもよろしいですか？</p>
                        <div className='logout-confirm-buttons'>
                            <button onClick={handleLogout} className='confirm-button'>はい</button>
                            <button onClick={cancelLogout} className='cancel-button'>いいえ</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;
