import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BookingSuccess = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleContinueBooking = () => {
        // Get the previous page from location state or go back
        if (location.state?.from) {
            navigate(location.state.from);
        } else {
            // If no previous page info, go back to previous page
            navigate(-1);
        }
    };

    const handleReturnHome = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4">
                {/* Success Icon */}
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Đặt Vé Thành Công!</h1>
                    <p className="text-gray-300 text-sm">
                        Cảm ơn bạn đã đặt vé. Vé của bạn đã được xác nhận và gửi qua email.
                    </p>
                </div>

                {/* Success Details */}
                <div className="bg-gray-700 rounded-lg p-4 mb-6">
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Mã đặt vé:</span>
                            <span className="text-white font-semibold">#{Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Trạng thái:</span>
                            <span className="text-green-400 font-semibold">Đã xác nhận</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Thời gian:</span>
                            <span className="text-white">{new Date().toLocaleString('vi-VN')}</span>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                    <button
                        onClick={handleContinueBooking}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        Tiếp Tục Mua Vé
                    </button>

                    <button
                        onClick={handleReturnHome}
                        className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                        Quay Về Trang Chủ
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-gray-400 text-xs">
                        Vui lòng kiểm tra email để xem chi tiết vé và hướng dẫn.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default BookingSuccess;
