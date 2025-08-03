import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../../LoginPage/slice';
import { useNavigation } from '../../Context/NavigationContext';
import sessionManager from '../../../../utils/sessionManager';

const Header = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useSelector((state) => state.login);
    const { allowNavigation } = useNavigation();

    // Debug: Log user state
    console.log('Header - User state:', { user, isAuthenticated });
    console.log('Header - User details:', {
        hoTen: user?.hoTen,
        taikhoan: user?.taikhoan,
        email: user?.email
    });

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const [isCinemaModalOpen, setIsCinemaModalOpen] = useState(false);
    const [allComplexes, setAllComplexes] = useState([]);
    const [loadingAllComplexes, setLoadingAllComplexes] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleLogout = () => {
        dispatch(logout());
        setIsUserDropdownOpen(false);
        navigate('/');
    };

    // Test auto logout functionality
    const testAutoLogout = () => {
        console.log('Testing auto logout...');
        sessionManager.testAutoLogout();
    };

    // Test with short timeout
    const testShortTimeout = () => {
        console.log('Setting test timeout to 10 seconds...');
        sessionManager.setTestTimeout(10);
    };

    const handleSignIn = () => {
        allowNavigation('/login');
        navigate('/login');
    };

    const handleSignUp = () => {
        allowNavigation('/register');
        navigate('/register');
    };

    const handleProfileClick = () => {
        allowNavigation('/profile');
        navigate('/profile');
        setIsUserDropdownOpen(false);
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleListMovieClick = () => {
        allowNavigation('/listmovie');
        navigate('/listmovie');
    };

    const handleCinemaClick = () => {
        setIsCinemaModalOpen(true);
        setIsClosing(false);
        fetchAllCinemaComplexes();
    };

    const fetchAllCinemaComplexes = async () => {
        setLoadingAllComplexes(true);
        const allComplexesData = [];

        try {
            // Fetch cinema systems first
            const systemsResponse = await fetch('https://movienew.cybersoft.edu.vn/api/QuanLyRap/LayThongTinHeThongRap', {
                headers: {
                    'TokenCybersoft': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb2AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eV0f1g8zhTZZg6WSx4'
                }
            });
            const systemsData = await systemsResponse.json();

            if (systemsData.content && Array.isArray(systemsData.content)) {
                for (const system of systemsData.content) {
                    try {
                        const response = await fetch(`https://movienew.cybersoft.edu.vn/api/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${system.maHeThongRap}`, {
                            headers: {
                                'TokenCybersoft': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5Mb2AiOiJCb290Y2FtcCA4MyIsIkhldEhhblN0cmluZyI6IjE4LzAxLzIwMjYiLCJIZXRIYW5UaW1lIjoiMTc2ODY5NDQwMDAwMCIsIm5iZiI6MTc0MTg4ODgwMCwiZXhwIjoxNzY4ODQ1NjAwfQ.rosAjjMuXSBmnsEQ7BQi1qmo6eV0f1g8zhTZZg6WSx4'
                            }
                        });
                        const data = await response.json();
                        if (data.content && Array.isArray(data.content)) {
                            data.content.forEach(complex => {
                                allComplexesData.push({
                                    ...complex,
                                    systemInfo: system
                                });
                            });
                        }
                    } catch (error) {
                        console.error(`Error fetching complexes for ${system.maHeThongRap}:`, error);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching cinema systems:', error);
        }

        setAllComplexes(allComplexesData);
        setLoadingAllComplexes(false);
    };

    const handleCloseCinemaModal = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsCinemaModalOpen(false);
            setIsClosing(false);
            setAllComplexes([]);
        }, 300);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleCloseCinemaModal();
        }
    };

    const isHomeActive = location.pathname === '/';

    // Get display name - prioritize hoTen, fallback to taikhoan
    const getDisplayName = () => {
        const displayName = user?.hoTen || user?.taikhoan || 'User';
        console.log('getDisplayName called:', { hoTen: user?.hoTen, taikhoan: user?.taikhoan, result: displayName });
        return displayName;
    };

    return (
        <>
            <header className="bg-gray-900 text-white shadow-lg relative z-[9999]">
                {/* Background overlay for the blurry effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 opacity-90"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">

                        {/* Logo Section - Left */}
                        <div className="flex-shrink-0">
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
                        </div>

                        {/* Navigation Section - Center */}
                        <nav className="hidden md:flex items-center space-x-8 lg:space-x-12">
                            <button
                                onClick={handleHomeClick}
                                className="text-white font-semibold uppercase tracking-wide hover:text-yellow-400 transition-colors duration-200 relative group cursor-pointer"
                            >
                                <span className="relative">
                                    TRANG CHỦ
                                    {isHomeActive && (
                                        <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-yellow-400"></span>
                                    )}
                                </span>
                            </button>
                            <button
                                onClick={handleListMovieClick}
                                className="text-white font-semibold uppercase tracking-wide hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
                            >
                                DANH SÁCH PHIM
                            </button>
                            <button
                                onClick={handleCinemaClick}
                                className="text-white font-semibold uppercase tracking-wide hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
                            >
                                RẠP
                            </button>
                        </nav>

                        {/* User Section - Right */}
                        <div className="flex items-center space-x-4">
                            {/* Auth Links - Show when not authenticated */}
                            {!isAuthenticated && (
                                <div className="hidden lg:flex items-center space-x-4">
                                    <button
                                        onClick={handleSignIn}
                                        className="text-white font-semibold uppercase tracking-wide text-sm hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
                                    >
                                        ĐĂNG NHẬP
                                    </button>
                                    <button
                                        onClick={handleSignUp}
                                        className="text-white font-semibold uppercase tracking-wide text-sm hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
                                    >
                                        ĐĂNG KÝ
                                    </button>
                                </div>
                            )}

                            {/* User Profile Dropdown - Only show when logged in */}
                            {isAuthenticated && user && (
                                <div className="relative z-[99999]">
                                    <button
                                        onClick={toggleUserDropdown}
                                        className="flex items-center space-x-2 bg-transparent border border-dashed border-gray-400 rounded px-3 py-1 hover:border-yellow-400 transition-colors duration-200 cursor-pointer"
                                    >
                                        <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                            <svg className="w-5 h-5 lg:w-6 lg:h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <span className="text-white text-sm lg:text-base font-medium">{getDisplayName()}</span>
                                        <svg className={`w-4 h-4 text-white transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {/* Backdrop for dropdown */}
                                    {isUserDropdownOpen && (
                                        <div
                                            className="fixed inset-0 z-[99998] cursor-pointer"
                                            onClick={() => setIsUserDropdownOpen(false)}
                                        ></div>
                                    )}

                                    {/* User Dropdown Menu */}
                                    {isUserDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-[99999] border border-gray-600">
                                            <div className="px-4 py-2 text-sm text-gray-300 border-b border-gray-700">
                                                <div className="font-semibold">{getDisplayName()}</div>
                                                <div className="text-xs">{user.email}</div>
                                            </div>
                                            <button
                                                onClick={handleProfileClick}
                                                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer"
                                            >
                                                Profile
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 cursor-pointer"
                                            >
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Mobile Menu Button */}
                            <button
                                onClick={toggleMenu}
                                className="md:hidden flex items-center p-2 rounded-md text-white hover:text-yellow-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-yellow-400 cursor-pointer"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden">
                            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-700">
                                <button
                                    onClick={handleHomeClick}
                                    className={`block w-full text-left px-3 py-2 text-white font-semibold uppercase tracking-wide hover:text-yellow-400 transition-colors duration-200 ${isHomeActive ? 'text-yellow-400' : ''
                                        }`}
                                >
                                    TRANG CHỦ
                                </button>
                                <div className="px-3 py-2 text-white font-semibold uppercase tracking-wide">
                                    DANH SÁCH PHIM
                                </div>
                                <div className="px-3 py-2 text-white font-semibold uppercase tracking-wide">
                                    RẠP
                                </div>

                                {/* Mobile Auth Links - Show when not authenticated */}
                                {!isAuthenticated && (
                                    <div className="pt-4 flex space-x-4">
                                        <button
                                            onClick={handleSignIn}
                                            className="text-white font-semibold uppercase tracking-wide text-sm hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
                                        >
                                            ĐĂNG NHẬP
                                        </button>
                                        <button
                                            onClick={handleSignUp}
                                            className="text-white font-semibold uppercase tracking-wide text-sm hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
                                        >
                                            ĐĂNG KÝ
                                        </button>
                                    </div>
                                )}

                                {/* Mobile User Info - Only show when logged in */}
                                {isAuthenticated && user && (
                                    <div className="pt-4 space-y-2 border-t border-gray-700 mt-4">
                                        <div className="px-3 py-2 text-white text-sm">
                                            <div className="font-semibold">{getDisplayName()}</div>
                                            <div className="text-gray-300">{user?.email}</div>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-3 py-2 text-white font-semibold uppercase tracking-wide text-sm hover:text-yellow-400 transition-colors duration-200 cursor-pointer"
                                        >
                                            LOGOUT
                                        </button>
                                        {/* Test buttons for auto logout */}
                                        <button
                                            onClick={testAutoLogout}
                                            className="block w-full text-left px-3 py-2 text-red-400 font-semibold uppercase tracking-wide text-sm hover:text-red-300 transition-colors duration-200 cursor-pointer"
                                        >
                                            TEST AUTO LOGOUT
                                        </button>
                                        <button
                                            onClick={testShortTimeout}
                                            className="block w-full text-left px-3 py-2 text-orange-400 font-semibold uppercase tracking-wide text-sm hover:text-orange-300 transition-colors duration-200 cursor-pointer"
                                        >
                                            TEST 10S TIMEOUT
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </header>

            {/* Cinema Modal */}
            {isCinemaModalOpen && (
                <div className="fixed inset-0 flex items-start justify-center z-[99999] pt-8" onClick={handleBackdropClick}>
                    <div className={`bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-600 transform transition-all duration-300 ease-out ${isClosing ? 'animate-slide-up' : 'animate-slide-down'}`}>
                        {/* Modal Header */}
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Danh Sách Tất Cả Rạp Chiếu Phim</h2>
                            </div>
                        </div>

                        {/* Modal Content */}
                        {loadingAllComplexes ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                                <p className="text-gray-400">Đang tải danh sách rạp...</p>
                            </div>
                        ) : allComplexes.length > 0 ? (
                            <div className="space-y-3">
                                {allComplexes.map((complex, index) => (
                                    <div key={`${complex.maCumRap}-${index}`} className="bg-gray-700 rounded-lg p-4 flex items-center space-x-4">
                                        <div className="flex-shrink-0">
                                            <img
                                                src={complex.systemInfo.logo}
                                                alt={complex.systemInfo.tenHeThongRap}
                                                className="w-16 h-16 object-contain rounded"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-lg text-white mb-1">{complex.tenCumRap}</h4>
                                            <p className="text-gray-400 text-sm">{complex.diaChi}</p>
                                            <p className="text-yellow-400 text-xs mt-1">{complex.systemInfo.tenHeThongRap}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400">Không có thông tin rạp</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default Header;

