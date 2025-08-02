import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser, clearError, clearSuccess } from './slice';
import { useNavigation } from '../Context/NavigationContext';

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, success } = useSelector((state) => state.register);
    const { allowNavigation } = useNavigation();

    const [formData, setFormData] = useState({
        taiKhoan: '',
        matKhau: '',
        email: '',
        hoTen: '',
        soDT: '',
        maNhom: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        dispatch(clearError());
        dispatch(clearSuccess());
    }, [dispatch]);

    useEffect(() => {
        if (success) {
            allowNavigation('/login');
            navigate('/login');
        }
    }, [success, navigate, allowNavigation]);

    // Debug logging for error
    useEffect(() => {
        if (error) {
            console.log('Register component - Error received:', error);
            console.log('Register component - Error type:', typeof error);
        }
    }, [error]);

    // Validation functions
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const validateGroupCode = (groupCode) => {
        const groupRegex = /^GP0[0-9]$/;
        return groupRegex.test(groupCode);
    };

    const validateForm = () => {
        const newErrors = {};

        // Username validation
        if (!formData.taiKhoan.trim()) {
            newErrors.taiKhoan = 'Tài khoản không được để trống';
        } else if (formData.taiKhoan.length < 3) {
            newErrors.taiKhoan = 'Tài khoản phải có ít nhất 3 ký tự';
        }

        // Password validation - chỉ kiểm tra không để trống
        if (!formData.matKhau.trim()) {
            newErrors.matKhau = 'Mật khẩu không được để trống';
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Email không hợp lệ (VD: example@gmail.com)';
        }

        // Full name validation
        if (!formData.hoTen.trim()) {
            newErrors.hoTen = 'Họ tên không được để trống';
        }

        // Phone validation
        if (!formData.soDT.trim()) {
            newErrors.soDT = 'Số điện thoại không được để trống';
        } else if (!validatePhone(formData.soDT)) {
            newErrors.soDT = 'Số điện thoại phải có đúng 10 chữ số';
        }

        // Group code validation
        if (!formData.maNhom.trim()) {
            newErrors.maNhom = 'Mã nhóm không được để trống';
        } else if (!validateGroupCode(formData.maNhom)) {
            newErrors.maNhom = 'Mã nhóm phải có định dạng GP0_ (VD: GP01, GP02, GP05)';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        dispatch(registerUser(formData));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Real-time validation
        validateField(name, value);
    };

    // Validate individual field
    const validateField = (fieldName, value) => {
        const newErrors = { ...errors };

        switch (fieldName) {
            case 'taiKhoan':
                if (!value.trim()) {
                    newErrors.taiKhoan = 'Tài khoản không được để trống';
                } else if (value.length < 3) {
                    newErrors.taiKhoan = 'Tài khoản phải có ít nhất 3 ký tự';
                } else {
                    delete newErrors.taiKhoan;
                }
                break;

            case 'matKhau':
                if (!value.trim()) {
                    newErrors.matKhau = 'Mật khẩu không được để trống';
                } else {
                    delete newErrors.matKhau;
                }
                break;

            case 'email':
                if (!value.trim()) {
                    newErrors.email = 'Email không được để trống';
                } else if (!validateEmail(value)) {
                    newErrors.email = 'Email không hợp lệ (VD: example@gmail.com)';
                } else {
                    delete newErrors.email;
                }
                break;

            case 'hoTen':
                if (!value.trim()) {
                    newErrors.hoTen = 'Họ tên không được để trống';
                } else {
                    delete newErrors.hoTen;
                }
                break;

            case 'soDT':
                if (!value.trim()) {
                    newErrors.soDT = 'Số điện thoại không được để trống';
                } else if (!validatePhone(value)) {
                    newErrors.soDT = 'Số điện thoại phải có đúng 10 chữ số';
                } else {
                    delete newErrors.soDT;
                }
                break;

            case 'maNhom':
                if (!value.trim()) {
                    newErrors.maNhom = 'Mã nhóm không được để trống';
                } else if (!validateGroupCode(value)) {
                    newErrors.maNhom = 'Mã nhóm phải có định dạng GP0_ (VD: GP01, GP02, GP05)';
                } else {
                    delete newErrors.maNhom;
                }
                break;

            default:
                break;
        }

        setErrors(newErrors);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-4xl font-bold text-white mb-2">
                        Đăng Ký
                    </h2>
                    <p className="text-gray-300">
                        Tạo tài khoản mới
                    </p>
                </div>

                <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
                    <form className="space-y-6" onSubmit={handleSubmit} noValidate>
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
                                className={`w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${errors.taiKhoan ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Nhập tài khoản"
                            />
                            {errors.taiKhoan && (
                                <p className="mt-1 text-sm text-red-400">{errors.taiKhoan}</p>
                            )}
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
                                className={`w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${errors.matKhau ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Nhập mật khẩu"
                            />
                            {errors.matKhau && (
                                <p className="mt-1 text-sm text-red-400">{errors.matKhau}</p>
                            )}
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${errors.email ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Nhập email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                            )}
                        </div>

                        {/* Full Name */}
                        <div>
                            <label htmlFor="hoTen" className="block text-sm font-medium text-gray-300 mb-2">
                                Họ tên
                            </label>
                            <input
                                id="hoTen"
                                name="hoTen"
                                type="text"
                                required
                                value={formData.hoTen}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${errors.hoTen ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Nhập họ tên"
                            />
                            {errors.hoTen && (
                                <p className="mt-1 text-sm text-red-400">{errors.hoTen}</p>
                            )}
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label htmlFor="soDT" className="block text-sm font-medium text-gray-300 mb-2">
                                Số điện thoại
                            </label>
                            <input
                                id="soDT"
                                name="soDT"
                                type="tel"
                                required
                                value={formData.soDT}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${errors.soDT ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Nhập số điện thoại (10 số)"
                            />
                            {errors.soDT && (
                                <p className="mt-1 text-sm text-red-400">{errors.soDT}</p>
                            )}
                        </div>

                        {/* Group Code - Input field instead of dropdown */}
                        <div>
                            <label htmlFor="maNhom" className="block text-sm font-medium text-gray-300 mb-2">
                                Mã nhóm
                            </label>
                            <input
                                id="maNhom"
                                name="maNhom"
                                type="text"
                                required
                                value={formData.maNhom}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 ${errors.maNhom ? 'border-red-500' : 'border-gray-600'
                                    }`}
                                placeholder="Nhập mã nhóm (VD: GP01, GP02, GP05)"
                            />
                            {errors.maNhom && (
                                <p className="mt-1 text-sm text-red-400">{errors.maNhom}</p>
                            )}
                        </div>

                        {/* Error Messages */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4">
                                <p className="text-red-400 text-sm font-semibold mb-2">
                                    Lỗi đăng ký:
                                </p>
                                <p className="text-red-400 text-sm">
                                    {error}
                                </p>
                                {error.includes('Email đã tồn tại') && (
                                    <p className="text-yellow-400 text-xs mt-2">
                                        💡 Gợi ý: Hãy thử email khác hoặc đăng nhập nếu đã có tài khoản
                                    </p>
                                )}
                                {error.includes('Tài khoản đã tồn tại') && (
                                    <p className="text-yellow-400 text-xs mt-2">
                                        💡 Gợi ý: Hãy thử tên tài khoản khác
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Success Messages */}
                        {success && (
                            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4">
                                <p className="text-green-400 text-sm">
                                    Đăng ký thành công! Đang chuyển đến trang đăng nhập...
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
                                    Đang đăng ký...
                                </div>
                            ) : (
                                'Đăng Ký'
                            )}
                        </button>
                    </form>

                    {/* Link to Login */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-300">
                            Đã có tài khoản?
                            <button
                                type="button"
                                onClick={() => {
                                    allowNavigation('/login');
                                    navigate('/login');
                                }}
                                className="ml-2 text-yellow-400 hover:text-yellow-300 font-semibold transition-colors duration-200"
                            >
                                Đăng nhập
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;