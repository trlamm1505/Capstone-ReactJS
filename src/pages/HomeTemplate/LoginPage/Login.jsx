import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser, clearError } from './slice';
import { useNavigation } from '../Context/NavigationContext';

function Login() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated, user } = useSelector((state) => state.login);
    const { allowNavigation } = useNavigation();

    const [formData, setFormData] = useState({
        taiKhoan: '',
        matKhau: ''
    });

    useEffect(() => {
        if (isAuthenticated && user) {
            console.log('User logged in:', user);
            console.log('User type:', user.maLoaiNguoiDung);

            // Check user type and redirect accordingly
            if (user.maLoaiNguoiDung === 'QuanTri') {
                console.log('Redirecting to admin page');
                allowNavigation('/admin');
                navigate('/admin');
            } else if (user.maLoaiNguoiDung === 'KhachHang') {
                console.log('Redirecting to home page');
                navigate('/');
            } else {
                console.log('Unknown user type, redirecting to home page');
                navigate('/');
            }
        }
    }, [isAuthenticated, user, navigate, allowNavigation]);

    useEffect(() => {
        dispatch(clearError());
    }, [dispatch]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Đăng Nhập
                    </h2>
                    <p className="text-gray-300">
                        Chào mừng bạn trở lại!
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Username */}
                        <div>
                            <label htmlFor="taiKhoan" className="block text-sm font-medium text-gray-300 mb-2">
                                Tài khoản
                            </label>
                            <input
                                id="taiKhoan"
                                name="taiKhoan"
                                type="text"
                                required
                                value={formData.taiKhoan}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 border-gray-600"
                                placeholder="Nhập tài khoản"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="matKhau" className="block text-sm font-medium text-gray-300 mb-2">
                                Mật khẩu
                            </label>
                            <input
                                id="matKhau"
                                name="matKhau"
                                type="password"
                                required
                                value={formData.matKhau}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 border-gray-600"
                                placeholder="Nhập mật khẩu"
                            />
                        </div>

                        {/* Error Messages */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                                <p className="text-red-400 text-sm">
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 py-3 px-4 rounded-lg font-semibold hover:from-yellow-500 hover:to-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900 mr-2"></div>
                                    Đang đăng nhập...
                                </div>
                            ) : (
                                'Đăng Nhập'
                            )}
                        </button>
                    </form>

                    {/* Link to Register */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-300">
                            Chưa có tài khoản?
                            <button
                                type="button"
                                onClick={() => {
                                    allowNavigation('/register');
                                    navigate('/register');
                                }}
                                className="ml-2 text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-200"
                            >
                                Đăng ký ngay
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;