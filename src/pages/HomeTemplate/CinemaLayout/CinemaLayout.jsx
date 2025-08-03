import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectSeat,
    startTimer,
    updateTimer,
    setShowtimeInfo,
    clearSelections,
    resetState,
    bookTickets,
    fetchShowtimeInfo
} from './slice';

const CinemaLayout = () => {
    const { maLichChieu } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        loading,
        error,
        seats,
        selectedSeats,
        bookingInfo,
        timer,
        seatTypes
    } = useSelector((state) => state.cinemaLayout);

    // Get login state from Redux (adjust the path based on your store structure)
    const isLoggedIn = useSelector((state) => state.login?.user || state.auth?.user);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        // Fetch showtime info when component mounts
        if (maLichChieu) {
            dispatch(fetchShowtimeInfo(maLichChieu));
        }

        // Start timer when component mounts
        dispatch(startTimer());

        // Set up timer interval
        const timerInterval = setInterval(() => {
            dispatch(updateTimer());
            setCurrentTime(new Date());
        }, 1000);

        // Cleanup on unmount
        return () => {
            clearInterval(timerInterval);
            dispatch(resetState());
        };
    }, [dispatch, maLichChieu]);

    // Recalculate total price when selectedSeats changes
    useEffect(() => {
        const totalPrice = selectedSeats.reduce((total, seat) => total + seat.price, 0);
        console.log('Selected seats:', selectedSeats);
        console.log('Total price:', totalPrice);
    }, [selectedSeats]);

    const handleSeatClick = (seatId) => {
        dispatch(selectSeat({ seatId }));
    };

    const handleBooking = () => {
        if (selectedSeats.length === 0) {
            alert('Vui lòng chọn ít nhất một ghế!');
            return;
        }

        const bookingData = {
            maLichChieu: maLichChieu,
            danhSachVe: selectedSeats.map(seat => ({
                maGhe: seat.id,
                giaVe: seat.price
            }))
        };

        if (!isLoggedIn) {
            // Save complete booking info including cinema and seat details
            const completeBookingInfo = {
                ...bookingInfo,
                selectedSeats: selectedSeats.map(seat => ({
                    ...seat,
                    tenGhe: `${seat.row}${seat.column}`,
                    maGhe: seat.id
                })),
                // Include cinema information from API
                maRap: bookingInfo.maRap,
                tenRap: bookingInfo.tenRap,
                maHeThongRap: bookingInfo.maHeThongRap,
                tenHeThongRap: bookingInfo.tenHeThongRap,
                maCumRap: bookingInfo.maCumRap,
                tenCumRap: bookingInfo.tenCumRap
            };

            localStorage.setItem('pendingBooking', JSON.stringify(bookingData));
            localStorage.setItem('selectedSeats', JSON.stringify(selectedSeats));
            localStorage.setItem('bookingInfo', JSON.stringify(completeBookingInfo));
            navigate('/login');
            return;
        }

        dispatch(bookTickets(bookingData)).then((result) => {
            if (result.meta.requestStatus === 'fulfilled') {
                navigate('/booking-success', {
                    state: {
                        from: `/chitietphongve/${maLichChieu}`
                    }
                });
            } else if (result.meta.requestStatus === 'rejected') {
                console.error('Booking failed:', result.payload);
                alert('Đặt vé thất bại: ' + (result.payload || 'Lỗi không xác định'));
            }
        }).catch((error) => {
            console.error('Booking error:', error);
            alert('Đặt vé thất bại: ' + (error.message || 'Lỗi không xác định'));
        });
    };

    const getSeatColor = (seat) => {
        if (seat.isSelected) return 'bg-green-500';
        if (seat.isBooked) return 'bg-red-500';
        if (seat.isSelecting) return 'bg-blue-500';
        if (seat.type === 'vip') return 'bg-orange-400';
        return 'bg-gray-400';
    };

    const getSeatTextColor = (seat) => {
        if (seat.isSelected || seat.isBooked) return 'text-white';
        return 'text-gray-900';
    };

    const formatTime = (minutes, seconds) => {
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    // Group seats by row for display
    const groupSeatsByRow = () => {
        const grouped = {};
        seats.forEach(seat => {
            if (!grouped[seat.row]) {
                grouped[seat.row] = [];
            }
            grouped[seat.row].push(seat);
        });

        // Sort seats within each row by column
        Object.keys(grouped).forEach(row => {
            grouped[row].sort((a, b) => a.column - b.column);
        });

        return grouped;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-white text-xl">Đang tải thông tin phòng vé...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-red-400 text-xl">Lỗi: {error}</div>
            </div>
        );
    }

    const groupedSeats = groupSeatsByRow();
    const rowKeys = Object.keys(groupedSeats).sort();

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-1 sm:px-2 py-2 lg:py-4">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-center mb-2 lg:mb-4 space-y-1 sm:space-y-0">
                    <div className="text-xs lg:text-sm">
                        {bookingInfo.showDate} - {bookingInfo.showTime} - {bookingInfo.cinemaRoom || 'Rạp 1'}
                    </div>
                    <div className="flex items-center space-x-1 lg:space-x-2">
                        <span className="text-xs">Thời gian giữ ghế:</span>
                        <div className="bg-red-500 text-white px-1 py-0.5 lg:px-2 lg:py-1 rounded font-bold text-xs lg:text-sm">
                            {formatTime(timer.minutes, timer.seconds)}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4">
                    {/* Left Panel - Seat Layout */}
                    <div className="lg:col-span-2">
                        <div className="bg-gray-800 rounded-lg p-8 lg:p-10">
                            {/* Screen */}
                            <div className="bg-orange-500 text-white text-center py-4 mb-10 lg:mb-12 rounded-lg font-bold text-lg lg:text-xl">
                                MÀN HÌNH
                            </div>

                            {/* Seat Grid */}
                            <div className="flex justify-center">
                                <div className="space-y-2.5">
                                    {rowKeys.map((row) => (
                                        <div key={row} className="flex items-center space-x-2.5">
                                            <div className="w-7 text-center font-bold text-gray-400 text-lg">
                                                {row}
                                            </div>
                                            <div className="flex space-x-2">
                                                {groupedSeats[row].map((seat) => (
                                                    <button
                                                        key={seat.id}
                                                        onClick={() => handleSeatClick(seat.id)}
                                                        disabled={seat.isBooked}
                                                        className={`
                                                            w-8 h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 rounded text-base font-bold cursor-pointer
                                                            ${getSeatColor(seat)} ${getSeatTextColor(seat)}
                                                            hover:opacity-80 transition-opacity
                                                            ${seat.isBooked ? 'cursor-not-allowed opacity-50' : ''}
                                                        `}
                                                    >
                                                        {seat.isBooked ? 'X' : seat.column}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Booking Information */}
                    <div className="lg:col-span-1">
                        <div className="bg-gray-800 rounded-lg p-4 lg:p-6">
                            <h2 className="text-lg lg:text-xl font-bold mb-4">{bookingInfo.movieTitle}</h2>

                            <div className="space-y-2 lg:space-y-3 text-xs lg:text-sm">
                                <div>
                                    <span className="text-gray-400">Ngày chiếu giờ chiếu:</span>
                                    <div className="text-white break-words">{bookingInfo.showDate} - {bookingInfo.showTime}</div>
                                </div>

                                <div>
                                    <span className="text-gray-400">Cụm rạp:</span>
                                    <div className="text-white break-words">{bookingInfo.cinemaComplex}</div>
                                </div>

                                <div>
                                    <span className="text-gray-400">Rạp:</span>
                                    <div className="text-white break-words">{bookingInfo.cinemaRoom}</div>
                                </div>

                                <div>
                                    <span className="text-gray-400">Ghế chọn:</span>
                                    <div className="text-white break-words">
                                        {selectedSeats.map((seat, index) => (
                                            <span key={seat.id}>
                                                {seat.seatNumber} - {seat.price.toLocaleString('vi-VN')}
                                                {index < selectedSeats.length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-gray-400">Ưu đãi:</span>
                                    <div className="text-white">{bookingInfo.discount}%</div>
                                </div>

                                <div className="border-t border-gray-600 pt-2 lg:pt-3">
                                    <span className="text-gray-400">Tổng tiền:</span>
                                    <div className="text-white text-base lg:text-lg font-bold">
                                        {bookingInfo.totalPrice.toLocaleString('vi-VN')}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleBooking}
                                disabled={selectedSeats.length === 0}
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-2 lg:py-3 px-4 rounded mt-4 lg:mt-6 transition-colors text-sm lg:text-base"
                            >
                                BOOKING TICKET
                            </button>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-4 lg:mt-8 bg-gray-800 rounded-lg p-3 lg:p-4">
                    <h3 className="text-base lg:text-lg font-bold mb-3 lg:mb-4">Chú thích:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 lg:gap-4 text-xs lg:text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 lg:w-4 lg:h-4 bg-gray-400 rounded"></div>
                            <span>Ghế thường</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 lg:w-4 lg:h-4 bg-orange-400 rounded"></div>
                            <span>Ghế VIP</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 lg:w-4 lg:h-4 bg-green-500 rounded"></div>
                            <span>Ghế đang chọn</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 lg:w-4 lg:h-4 bg-red-500 rounded"></div>
                            <span>Ghế đã đặt</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 lg:w-4 lg:h-4 bg-blue-500 rounded"></div>
                            <span>Ghế đang có người chọn</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CinemaLayout;
