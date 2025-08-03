import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetail, fetchCinemaSystems, fetchMovieShowtimes } from './slice';

function MovieDetail() {
    const { maPhim } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        loading,
        data,
        error,
        cinemaSystemsLoading,
        cinemaSystemsData,
        cinemaSystemsError,
        showtimesLoading,
        showtimesData,
        showtimesError
    } = useSelector((state) => state.movieDetail);

    const [selectedCinema, setSelectedCinema] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isTrailerModalOpen, setIsTrailerModalOpen] = useState(false);
    const [isTrailerClosing, setIsTrailerClosing] = useState(false);

    useEffect(() => {
        if (maPhim) {
            dispatch(fetchMovieDetail(maPhim));
            dispatch(fetchCinemaSystems());
            dispatch(fetchMovieShowtimes(maPhim));
        }
    }, [maPhim, dispatch]);

    // Auto-select first cinema when showtimes data is loaded
    useEffect(() => {
        if (showtimesData && showtimesData.content && selectedCinema === null) {
            const extractedShowtimes = extractShowtimes(showtimesData.content);
            const groupedShowtimes = groupShowtimesByCinema(extractedShowtimes);

            if (Object.keys(groupedShowtimes).length > 0) {
                setSelectedCinema(0);
            }
        }
    }, [showtimesData, selectedCinema]);

    // Debug showtimes data
    useEffect(() => {
        if (showtimesData) {
            console.log('Movie showtimes data:', showtimesData);
        }
    }, [showtimesData]);

    // Generate dates for the next 7 days
    const generateDates = () => {
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    // Check if a date is today
    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    // Check if a date is selected
    const isDateSelected = (date) => {
        return date.toDateString() === selectedDate.toDateString();
    };

    // Handle date selection
    const handleDateSelect = (date) => {
        setSelectedDate(date);
    };

    // Filter showtimes for selected date
    const getShowtimesForDate = (showtimes, selectedDate) => {
        if (!isToday(selectedDate)) {
            return []; // Return empty array for non-today dates
        }
        return showtimes; // Return all showtimes for today
    };

    // Handle trailer modal
    const handleTrailerClick = () => {
        setIsTrailerModalOpen(true);
        setIsTrailerClosing(false);
    };

    const handleCloseTrailerModal = () => {
        setIsTrailerClosing(true);
        setTimeout(() => {
            setIsTrailerModalOpen(false);
            setIsTrailerClosing(false);
        }, 300);
    };

    // Extract YouTube video ID from trailer URL
    const getYouTubeVideoId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading || cinemaSystemsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    if (error || cinemaSystemsError) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-red-400 text-xl">Error: {error || cinemaSystemsError}</div>
            </div>
        );
    }

    const movie = data?.content;
    const cinemaSystems = cinemaSystemsData?.content;
    const showtimes = showtimesData?.content;

    if (!movie) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white text-xl">Không tìm thấy thông tin phim</div>
            </div>
        );
    }

    // Get video ID after movie is available
    const videoId = getYouTubeVideoId(movie?.trailer);

    // Helper function to extract showtimes from the new API response structure
    const extractShowtimes = (showtimesData) => {
        if (!showtimesData || !Array.isArray(showtimesData.heThongRapChieu)) return [];

        const allShowtimes = [];

        showtimesData.heThongRapChieu.forEach(heThongRap => {
            if (heThongRap.cumRapChieu) {
                heThongRap.cumRapChieu.forEach(cumRap => {
                    if (cumRap.lichChieuPhim) {
                        cumRap.lichChieuPhim.forEach(lichChieu => {
                            allShowtimes.push({
                                ...lichChieu,
                                tenHeThongRap: heThongRap.tenHeThongRap,
                                logoHeThongRap: heThongRap.logo,
                                tenCumRap: cumRap.tenCumRap,
                                diaChi: cumRap.diaChi
                            });
                        });
                    }
                });
            }
        });

        return allShowtimes;
    };

    // Group showtimes by cinema system and complex
    const groupShowtimesByCinema = (showtimes) => {
        const grouped = {};

        showtimes.forEach(showtime => {
            const cinemaKey = showtime.tenHeThongRap;
            if (!grouped[cinemaKey]) {
                grouped[cinemaKey] = {
                    tenHeThongRap: showtime.tenHeThongRap,
                    logo: showtime.logoHeThongRap,
                    cumRap: {}
                };
            }

            const cumRapKey = showtime.tenCumRap;
            if (!grouped[cinemaKey].cumRap[cumRapKey]) {
                grouped[cinemaKey].cumRap[cumRapKey] = {
                    tenCumRap: showtime.tenCumRap,
                    diaChi: showtime.diaChi,
                    showtimes: []
                };
            }

            grouped[cinemaKey].cumRap[cumRapKey].showtimes.push(showtime);
        });

        return grouped;
    };

    const extractedShowtimes = extractShowtimes(showtimes);
    const groupedShowtimes = groupShowtimesByCinema(extractedShowtimes);
    const selectedCinemaData = selectedCinema !== null ? groupedShowtimes[Object.keys(groupedShowtimes)[selectedCinema]] : null;

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Movie Header - Standardized Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Movie Poster - Fixed Height */}
                    <div className="relative h-[500px]">
                        <img
                            src={movie.hinhAnh}
                            alt={movie.tenPhim}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                                e.target.style.display = 'none';
                            }}
                        />
                        <div className="absolute top-4 right-4 bg-yellow-400 text-gray-900 px-3 py-1 rounded text-lg font-semibold">
                            {movie.danhGia}/10
                        </div>
                        <div className="absolute bottom-4 left-4 text-white text-sm">
                            MỘT BỘ PHIM CỦA {movie.daoDien || 'VICTOR VU'}
                        </div>
                    </div>

                    {/* Movie Information - Flexible Height */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold mb-4 text-white uppercase">
                                {movie.tenPhim}
                            </h1>
                            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
                                {movie.moTa}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-yellow-400 font-semibold min-w-[120px]">Ngày khởi chiếu:</span>
                                <span className="text-white">{new Date(movie.ngayKhoiChieu).toLocaleDateString('vi-VN')}</span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="text-yellow-400 font-semibold min-w-[120px]">Đánh giá:</span>
                                <span className="text-white">{movie.danhGia}/10</span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="text-yellow-400 font-semibold min-w-[120px]">Trạng thái:</span>
                                <span className={`px-3 py-1 rounded text-sm font-semibold ${movie.dangChieu ? 'bg-green-500 text-white' :
                                    movie.sapChieu ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
                                    }`}>
                                    {movie.dangChieu ? 'ĐANG CHIẾU' : movie.sapChieu ? 'SẮP CHIẾU' : 'ĐÃ CHIẾU'}
                                </span>
                            </div>

                            {movie.trailer && (
                                <div className="flex items-center space-x-4">
                                    <span className="text-yellow-400 font-semibold min-w-[120px]">Trailer:</span>
                                    <button
                                        onClick={handleTrailerClick}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200 inline-flex items-center cursor-pointer"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                        </svg>
                                        Xem trailer
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <button
                                onClick={() => window.history.back()}
                                className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200 cursor-pointer"
                            >
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>

                {/* Movie Showtimes Section - Standardized Layout */}
                {showtimesLoading ? (
                    <div className="mt-12 text-center">
                        <div className="text-gray-400 text-xl">Đang tải lịch chiếu...</div>
                    </div>
                ) : showtimesError ? (
                    <div className="mt-12 text-center">
                        <div className="text-red-400 text-xl">Lỗi: {showtimesError}</div>
                    </div>
                ) : Object.keys(groupedShowtimes).length > 0 ? (
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold mb-8 text-center">Lịch Chiếu</h2>

                        {/* Date Navigation - Standardized */}
                        <div className="flex items-center justify-between mb-6">
                            <button className="text-gray-400 hover:text-white cursor-pointer">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>

                            <div className="flex space-x-2">
                                {generateDates().map((date, index) => (
                                    <button
                                        key={index}
                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${isDateSelected(date)
                                            ? 'bg-red-500 text-white'
                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer'
                                            }`}
                                        onClick={() => handleDateSelect(date)}
                                    >
                                        {date.getDate()}/{String(date.getMonth() + 1).padStart(2, '0')} {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                                    </button>
                                ))}
                            </div>

                            <button className="text-gray-400 hover:text-white cursor-pointer">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex">
                            {/* Cinema Systems Sidebar - Standardized */}
                            <div className="w-64 bg-gray-800 rounded-l-lg p-4">
                                <div className="space-y-4">
                                    {Object.keys(groupedShowtimes).map((cinemaKey, index) => {
                                        const cinema = groupedShowtimes[cinemaKey];
                                        return (
                                            <div
                                                key={index}
                                                className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedCinema === index
                                                    ? 'bg-yellow-400 text-gray-900'
                                                    : 'hover:bg-gray-700 cursor-pointer'
                                                    }`}
                                                onClick={() => setSelectedCinema(index)}
                                            >
                                                <img
                                                    src={cinema.logo}
                                                    alt={cinema.tenHeThongRap}
                                                    className="w-16 h-16 object-contain mb-2"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                                <span className="text-xs text-center">{cinema.tenHeThongRap}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Showtimes Panel - Standardized */}
                            <div className="flex-1 bg-gray-800 rounded-r-lg p-6">
                                {selectedCinema !== null && selectedCinemaData ? (
                                    <div>
                                        {/* Cinema Complexes - Standardized */}
                                        <div className="space-y-6">
                                            {(() => {
                                                const complexesWithShowtimes = Object.values(selectedCinemaData.cumRap).filter(cumRap =>
                                                    getShowtimesForDate(cumRap.showtimes, selectedDate).length > 0
                                                );

                                                if (complexesWithShowtimes.length > 0) {
                                                    return complexesWithShowtimes.map((cumRap, cumRapIndex) => (
                                                        <div key={cumRapIndex} className="border-b border-gray-700 pb-6">
                                                            <div className="flex items-start mb-4">
                                                                <img
                                                                    src={selectedCinemaData.logo}
                                                                    alt={cumRap.tenCumRap}
                                                                    className="w-16 h-16 object-contain rounded-lg mr-4 flex-shrink-0"
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                        e.target.nextSibling.style.display = 'block';
                                                                    }}
                                                                />
                                                                <div className="w-16 h-16 bg-gray-700 rounded-lg mr-4 flex-shrink-0 hidden"></div>
                                                                <div className="flex-1">
                                                                    <h4 className="text-lg font-semibold text-white mb-1">
                                                                        {cumRap.tenCumRap}
                                                                    </h4>
                                                                    <p className="text-gray-400 text-sm mb-2">
                                                                        {cumRap.diaChi}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Showtimes by format - Standardized */}
                                                            <div className="space-y-3">
                                                                <div className="text-sm text-gray-400 font-semibold">
                                                                    2D DIGITAL
                                                                </div>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {getShowtimesForDate(cumRap.showtimes, selectedDate).map((showtime, showtimeIndex) => (
                                                                        <button
                                                                            key={showtimeIndex}
                                                                            className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-center cursor-pointer"
                                                                            onClick={() => navigate(`/chitietphongve/${showtime.maLichChieu}`)}
                                                                        >
                                                                            {new Date(showtime.ngayChieuGioChieu).toLocaleTimeString('vi-VN', {
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            })}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ));
                                                } else {
                                                    return (
                                                        <div className="text-center py-8">
                                                            <div className="text-gray-400 text-xl">Chưa có lịch chiếu cho ngày này</div>
                                                        </div>
                                                    );
                                                }
                                            })()}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-center h-64">
                                        <div className="text-center text-gray-400">
                                            <div className="text-6xl mb-4">🎬</div>
                                            <p className="text-xl">Chọn rạp để xem lịch chiếu</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mt-12 text-center">
                        <div className="text-gray-400 text-xl">Chưa có lịch chiếu cho phim này</div>
                    </div>
                )}
            </div>

            {/* Trailer Modal */}
            {isTrailerModalOpen && movie?.trailer && (
                <div className="fixed inset-0 flex items-start justify-center z-[99999] pt-8" onClick={handleCloseTrailerModal}>
                    <div className={`bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto shadow-2xl border border-gray-600 transform transition-all duration-300 ease-out ${isTrailerClosing ? 'animate-slide-up' : 'animate-slide-down'}`} onClick={(e) => e.stopPropagation()}>
                        {/* Modal Content */}
                        <div>
                            {videoId ? (
                                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                                    <iframe
                                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                                        title="Movie Trailer"
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400 text-lg">Không thể tải trailer</p>
                                    <a
                                        href={movie.trailer}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 underline mt-2 inline-block cursor-pointer"
                                    >
                                        Xem trên YouTube
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MovieDetail; 