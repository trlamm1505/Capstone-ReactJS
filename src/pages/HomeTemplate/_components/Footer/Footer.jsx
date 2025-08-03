import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNavigation } from '../../Context/NavigationContext';

const Footer = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useSelector((state) => state.login);
    const { allowNavigation } = useNavigation();

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const handleHomeClick = () => {
        // Always navigate to home page and scroll to top
        if (location.pathname !== '/') {
            allowNavigation('/');
            navigate('/');
        }
        // Scroll to top after a short delay to ensure navigation is complete
        setTimeout(() => {
            scrollToTop();
        }, 100);
    };

    const handleLoginClick = () => {
        allowNavigation('/login');
        navigate('/login');
    };

    const handleRegisterClick = () => {
        allowNavigation('/register');
        navigate('/register');
    };

    const handleProfileClick = () => {
        allowNavigation('/profile');
        navigate('/profile');
    };

    // Get display name function
    const getDisplayName = () => {
        if (user?.hoTen) {
            return user.hoTen;
        }
        if (user?.taikhoan) {
            return user.taikhoan;
        }
        return 'User';
    };

    return (
        <footer className="bg-gray-900 text-white relative">
            {/* Background overlay with blurred movie posters effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-800 via-gray-900 to-gray-800 opacity-95"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-12 lg:py-16">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">

                        {/* Left Section - Logo and Contact Information */}
                        <div className="space-y-4">
                            {/* Logo */}
                            <div className="flex items-center space-x-2">
                                <div className="text-2xl lg:text-3xl font-bold">
                                    <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                                        M
                                    </span>
                                    <span className="text-white">OVIE</span>
                                    <span className="inline-flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 rounded-full border-2 border-yellow-400 text-yellow-400 text-xs lg:text-sm font-bold mx-1">
                                        IN
                                    </span>
                                    <span className="text-white">HANDS</span>
                                </div>
                            </div>

                            {/* Phone Number */}
                            <div className="text-sm lg:text-base text-gray-300">
                                Call us: <span className="text-white font-semibold">0854340045</span>
                            </div>
                        </div>

                        {/* Middle Section - Policies */}
                        <div className="space-y-4">
                            <h3 className="text-lg lg:text-xl font-bold text-white uppercase tracking-wide">
                                Chính Sách
                            </h3>
                            <ul className="space-y-2">
                                <li>
                                    <button
                                        onClick={handleHomeClick}
                                        className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm lg:text-base cursor-pointer"
                                    >
                                        Trang Chủ
                                    </button>
                                </li>
                                <li>
                                    <button
                                        onClick={() => navigate('/listmovie')}
                                        className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm lg:text-base cursor-pointer"
                                    >
                                        Danh Sách Phim
                                    </button>
                                </li>
                            </ul>
                        </div>

                        {/* Right Section - Account */}
                        <div className="space-y-4">
                            <h3 className="text-lg lg:text-xl font-bold text-white uppercase tracking-wide">
                                Tài Khoản
                            </h3>
                            <ul className="space-y-2">
                                {isAuthenticated && user ? (
                                    <>
                                        <li>
                                            <div className="text-gray-300 text-sm lg:text-base">
                                                <span className="text-yellow-400 font-semibold">Xin chào, </span>
                                                <span className="text-white">{getDisplayName()}</span>
                                            </div>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleProfileClick}
                                                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm lg:text-base cursor-pointer"
                                            >
                                                Thông Tin Cá Nhân
                                            </button>
                                        </li>
                                    </>
                                ) : (
                                    <>
                                        <li>
                                            <button
                                                onClick={handleLoginClick}
                                                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm lg:text-base cursor-pointer"
                                            >
                                                Đăng Nhập
                                            </button>
                                        </li>
                                        <li>
                                            <button
                                                onClick={handleRegisterClick}
                                                className="text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm lg:text-base cursor-pointer"
                                            >
                                                Đăng Ký
                                            </button>
                                        </li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-700 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                        {/* Copyright */}
                        <div className="text-sm lg:text-base text-gray-300">
                            Trần Quốc Lâm
                        </div>

                        {/* Back to Top Button */}
                        <button
                            onClick={scrollToTop}
                            className="flex items-center space-x-2 text-gray-300 hover:text-yellow-400 transition-colors duration-200 text-sm lg:text-base group cursor-pointer"
                        >
                            <span>Back to top</span>
                            <svg
                                className="w-4 h-4 group-hover:transform group-hover:-translate-y-1 transition-transform duration-200"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

