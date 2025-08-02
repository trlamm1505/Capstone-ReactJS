import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile, fetchBookingHistory, clearError, clearUpdateError, clearUpdateSuccess } from './slice';

function Profile() {
    const dispatch = useDispatch();
    const {
        loading,
        userInfo,
        bookingHistory,
        error,
        updateLoading,
        updateError,
        updateSuccess
    } = useSelector((state) => state.profile);

    // Debug logging
    console.log('Profile component - State:', {
        loading,
        userInfo,
        bookingHistory,
        error,
        updateLoading,
        updateError,
        updateSuccess
    });

    const [activeTab, setActiveTab] = useState('personal'); // 'personal' or 'booking'
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        taiKhoan: '',
        matKhau: '',
        email: '',
        soDt: '',
        maNhom: '',
        maLoaiNguoiDung: '',
        hoTen: ''
    });

    // Validation states
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [accountError, setAccountError] = useState('');

    console.log('Profile component - formData:', formData);

    useEffect(() => {
        console.log('Profile useEffect - Dispatching actions');
        dispatch(fetchUserProfile());
        dispatch(fetchBookingHistory());
        dispatch(clearError());
        dispatch(clearUpdateError());
        dispatch(clearUpdateSuccess());
    }, [dispatch]);

    useEffect(() => {
        console.log('Profile useEffect - userInfo changed:', userInfo);
        if (userInfo) {
            console.log('Setting form data with userInfo:', userInfo);
            console.log('Password from userInfo:', userInfo.matKhau);
            setFormData({
                taiKhoan: userInfo.taiKhoan || '',
                matKhau: userInfo.matKhau || '', // API returns matKhau
                email: userInfo.email || '',
                soDt: userInfo.soDT || userInfo.soDt || '', // API returns soDT
                maNhom: userInfo.maNhom || '',
                maLoaiNguoiDung: userInfo.maLoaiNguoiDung || '',
                hoTen: userInfo.hoTen || ''
            });
        }
    }, [userInfo]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear errors when user starts typing
        if (name === 'email' && emailError) {
            setEmailError('');
        }
        if (name === 'soDt' && phoneError) {
            setPhoneError('');
        }
        if (name === 'taiKhoan' && accountError) {
            setAccountError('');
        }
    };

    const validateEmail = async (email) => {
        // Simulate API call to check if email exists
        // In real app, this would be an API call to check email existence
        if (email === 'tql150504@gmail.com' && email !== userInfo?.email) {
            return 'Email này đã được sử dụng bởi tài khoản khác';
        }
        return '';
    };

    const validatePhone = (phone) => {
        // Check if phone is exactly 10 digits
        if (phone && !/^\d{10}$/.test(phone)) {
            return 'Số điện thoại phải có đúng 10 chữ số';
        }
        return '';
    };

    const validateAccount = (account) => {
        // Check if account is not empty and has valid format
        if (!account.trim()) {
            return 'Tài khoản không được để trống';
        }
        if (account.length < 3) {
            return 'Tài khoản phải có ít nhất 3 ký tự';
        }
        return '';
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();

        // Clear all previous errors
        setEmailError('');
        setPhoneError('');
        setAccountError('');

        // Validate all fields
        const emailValidationError = await validateEmail(formData.email);
        const phoneValidationError = validatePhone(formData.soDt);
        const accountValidationError = validateAccount(formData.taiKhoan);

        if (emailValidationError) {
            setEmailError(emailValidationError);
        }
        if (phoneValidationError) {
            setPhoneError(phoneValidationError);
        }
        if (accountValidationError) {
            setAccountError(accountValidationError);
        }

        // If any validation fails, don't submit
        if (emailValidationError || phoneValidationError || accountValidationError) {
            return;
        }

        dispatch(updateUserProfile(formData));
        setIsEditing(false); // Tắt chế độ chỉnh sửa sau khi cập nhật
    };

    const handleEditClick = () => {
        setIsEditing(true);
        // Clear any existing errors
        setEmailError('');
        setPhoneError('');
        setAccountError('');
    };

    const handleCancelEdit = () => {
        // Reset form data về giá trị ban đầu
        if (userInfo) {
            setFormData({
                taiKhoan: userInfo.taiKhoan || '',
                matKhau: userInfo.matKhau || '',
                email: userInfo.email || '',
                soDt: userInfo.soDT || userInfo.soDt || '',
                maNhom: userInfo.maNhom || '',
                maLoaiNguoiDung: userInfo.maLoaiNguoiDung || '',
                hoTen: userInfo.hoTen || ''
            });
        }
        setIsEditing(false);
        // Clear all errors
        setEmailError('');
        setPhoneError('');
        setAccountError('');
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return dateString;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p className="text-xl">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center text-red-400">
                    <p className="text-xl">Lỗi: {typeof error === 'string' ? error : JSON.stringify(error)}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-center">Hồ Sơ Cá Nhân</h1>
                </div>

                {/* Tab Navigation */}
                <div className="flex border-b border-gray-700 mb-8">
                    <button
                        onClick={() => setActiveTab('personal')}
                        className={`px-6 py-3 font-semibold transition-colors duration-200 ${activeTab === 'personal'
                            ? 'text-yellow-400 border-b-2 border-yellow-400'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        THÔNG TIN CÁ NHÂN
                    </button>
                    <button
                        onClick={() => setActiveTab('booking')}
                        className={`px-6 py-3 font-semibold transition-colors duration-200 ${activeTab === 'booking'
                            ? 'text-yellow-400 border-b-2 border-yellow-400'
                            : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        LỊCH SỬ ĐẶT VÉ
                    </button>
                </div>

                {/* Tab Content */}
                {activeTab === 'personal' ? (
                    /* Personal Information Tab */
                    <div className="bg-gray-800 rounded-lg p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Thông Tin Cá Nhân</h2>
                            {!isEditing && (
                                <button
                                    type="button"
                                    onClick={handleEditClick}
                                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                                >
                                    Chỉnh sửa
                                </button>
                            )}
                        </div>

                        {updateSuccess && (
                            <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-4 mb-6">
                                <p className="text-green-400">Cập nhật thông tin thành công!</p>
                            </div>
                        )}

                        {updateError && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-6">
                                <p className="text-red-400">Lỗi: {typeof updateError === 'string' ? updateError : JSON.stringify(updateError)}</p>
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''} ${emailError ? 'border-red-500' : 'border-gray-600'}`}
                                        />
                                        {emailError && (
                                            <p className="text-red-400 text-sm mt-1">{emailError}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Họ tên
                                        </label>
                                        <input
                                            type="text"
                                            name="hoTen"
                                            value={formData.hoTen}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Số điện thoại
                                        </label>
                                        <input
                                            type="tel"
                                            name="soDt"
                                            value={formData.soDt}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''} ${phoneError ? 'border-red-500' : 'border-gray-600'}`}
                                        />
                                        {phoneError && (
                                            <p className="text-red-400 text-sm mt-1">{phoneError}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Tài khoản
                                        </label>
                                        <input
                                            type="text"
                                            name="taiKhoan"
                                            value={formData.taiKhoan}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''} ${accountError ? 'border-red-500' : 'border-gray-600'}`}
                                        />
                                        {accountError && (
                                            <p className="text-red-400 text-sm mt-1">{accountError}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Mật khẩu
                                        </label>
                                        <input
                                            type="text"
                                            name="matKhau"
                                            value={formData.matKhau}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-lg border bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Update/Cancel buttons when editing */}
                            {isEditing && (
                                <div className="flex justify-end space-x-4 mt-6">
                                    <button
                                        type="button"
                                        onClick={handleCancelEdit}
                                        className="bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-200"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={updateLoading}
                                        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {updateLoading ? 'Đang cập nhật...' : 'Cập nhật'}
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                ) : (
                    /* Booking History Tab */
                    <div className="bg-gray-800 rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-6">Lịch Sử Đặt Vé</h2>

                        {bookingHistory && bookingHistory.length > 0 ? (
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                                {bookingHistory.map((booking, index) => (
                                    <div key={index} className="bg-gray-700 rounded-lg p-4">
                                        <div className="flex items-start space-x-3">
                                            <img
                                                src={booking.hinhAnh || 'https://via.placeholder.com/60x90/1f2937/ffffff?text=Movie'}
                                                alt={booking.tenPhim || 'Movie'}
                                                className="w-15 h-22 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="text-lg font-semibold mb-1">{booking.tenPhim || 'Unknown Movie'}</h3>
                                                <p className="text-gray-400 text-sm mb-1">{booking.tenCumRap || 'Unknown Cinema'}</p>
                                                <p className="text-gray-400 text-sm mb-1">{booking.diaChi || 'Unknown Address'}</p>
                                                <p className="text-xs text-gray-500">
                                                    Ngày đặt: {formatDate(booking.ngayDat)} - {booking.tenRap || 'Unknown Theater'} - Ghế {booking.maGhe || 'Unknown Seat'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 py-12">
                                <div className="text-4xl mb-4">🎬</div>
                                <p className="text-lg">Chưa có lịch sử đặt vé</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default Profile;
