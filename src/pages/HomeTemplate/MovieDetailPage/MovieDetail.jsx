import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetail, fetchCinemaSystems, fetchCinemaShowtimes } from './slice';

function MovieDetail() {
    const { maPhim } = useParams();
    const dispatch = useDispatch();
    const {
        loading,
        data,
        error,
        cinemaSystemsLoading,
        cinemaSystemsData,
        cinemaSystemsError,
        cinemaShowtimesLoading,
        cinemaShowtimesData,
        cinemaShowtimesError
    } = useSelector((state) => state.movieDetail);

    const [selectedCinema, setSelectedCinema] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        if (maPhim) {
            dispatch(fetchMovieDetail(maPhim));
            dispatch(fetchCinemaSystems());
        }
    }, [maPhim, dispatch]);

    // Fetch showtimes when cinema is selected
    useEffect(() => {
        if (selectedCinema !== null && cinemaSystemsData?.content) {
            const cinema = cinemaSystemsData.content[selectedCinema];
            console.log('Selected cinema:', cinema);
            dispatch(fetchCinemaShowtimes({
                maHeThongRap: cinema.maHeThongRap,
                maNhom: "GP07"
            }));
        }
    }, [selectedCinema, cinemaSystemsData, dispatch]);

    // Debug showtimes data
    useEffect(() => {
        if (cinemaShowtimesData) {
            console.log('Cinema showtimes data:', cinemaShowtimesData);
        }
    }, [cinemaShowtimesData]);

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
    const showtimes = cinemaShowtimesData?.content;

    if (!movie) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900">
                <div className="text-white text-xl">Không tìm thấy thông tin phim</div>
            </div>
        );
    }

    // Helper function to extract showtimes from the API response
    const extractShowtimes = (showtimesData) => {
        if (!showtimesData || !Array.isArray(showtimesData)) return [];

        const allShowtimes = [];

        showtimesData.forEach(cumRap => {
            if (cumRap.danhSachPhim) {
                cumRap.danhSachPhim.forEach(phim => {
                    if (phim.lstLichChieuTheoPhim) {
                        phim.lstLichChieuTheoPhim.forEach(lichChieu => {
                            allShowtimes.push({
                                ...lichChieu,
                                tenRap: lichChieu.tenRap,
                                ngayChieuGioChieu: lichChieu.ngayChieuGioChieu,
                                giaVe: lichChieu.giaVe
                            });
                        });
                    }
                });
            }
        });

        return allShowtimes;
    };

    const extractedShowtimes = extractShowtimes(showtimes);

    return (
        <div className="min-h-screen bg-gray-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Movie Header */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    {/* Movie Image */}
                    <div className="relative">
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
                    </div>

                    {/* Movie Info */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{movie.tenPhim}</h1>
                            <p className="text-xl text-gray-300 mb-4">{movie.moTa}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center space-x-4">
                                <span className="text-yellow-400 font-semibold">Ngày khởi chiếu:</span>
                                <span>{new Date(movie.ngayKhoiChieu).toLocaleDateString('vi-VN')}</span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="text-yellow-400 font-semibold">Đánh giá:</span>
                                <span>{movie.danhGia}/10</span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <span className="text-yellow-400 font-semibold">Trạng thái:</span>
                                <span className={`px-3 py-1 rounded text-sm font-semibold ${movie.dangChieu ? 'bg-green-500 text-white' :
                                    movie.sapChieu ? 'bg-blue-500 text-white' : 'bg-gray-500 text-white'
                                    }`}>
                                    {movie.dangChieu ? 'ĐANG CHIẾU' : movie.sapChieu ? 'SẮP CHIẾU' : 'ĐÃ CHIẾU'}
                                </span>
                            </div>

                            {movie.trailer && (
                                <div className="flex items-center space-x-4">
                                    <span className="text-yellow-400 font-semibold">Trailer:</span>
                                    <a
                                        href={movie.trailer}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:text-blue-300 underline"
                                    >
                                        Xem trailer
                                    </a>
                                </div>
                            )}
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={() => window.history.back()}
                                className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition-colors duration-200"
                            >
                                Quay lại
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cinema Showtimes Section */}
                {cinemaSystems && cinemaSystems.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-3xl font-bold mb-8 text-center">Lịch Chiếu</h2>

                        <div className="flex">
                            {/* Cinema Systems Sidebar */}
                            <div className="w-64 bg-gray-800 rounded-l-lg p-4">
                                <div className="space-y-4">
                                    {cinemaSystems.map((cinema, index) => (
                                        <div
                                            key={index}
                                            className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedCinema === index
                                                ? 'bg-yellow-400 text-gray-900'
                                                : 'hover:bg-gray-700'
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
                                    ))}
                                </div>
                            </div>

                            {/* Showtimes Panel */}
                            <div className="flex-1 bg-gray-800 rounded-r-lg p-6">
                                {selectedCinema !== null && cinemaSystems[selectedCinema] ? (
                                    <div>
                                        {/* Date Navigation */}
                                        <div className="flex items-center justify-between mb-6">
                                            <button className="text-gray-400 hover:text-white">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                                </svg>
                                            </button>

                                            <div className="flex space-x-2">
                                                {generateDates().map((date, index) => (
                                                    <button
                                                        key={index}
                                                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${index === 0
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                                            }`}
                                                        onClick={() => setSelectedDate(date)}
                                                    >
                                                        {date.getDate()}/{String(date.getMonth() + 1).padStart(2, '0')} {date.toLocaleDateString('vi-VN', { weekday: 'short' })}
                                                    </button>
                                                ))}
                                            </div>

                                            <button className="text-gray-400 hover:text-white">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Cinema Details */}
                                        <div className="flex items-center mb-6">
                                            <img
                                                src={cinemaSystems[selectedCinema].logo}
                                                alt={cinemaSystems[selectedCinema].tenHeThongRap}
                                                className="w-12 h-12 object-contain mr-4"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                            <div>
                                                <h3 className="text-2xl font-bold text-yellow-400">
                                                    {cinemaSystems[selectedCinema].tenHeThongRap}
                                                </h3>
                                                <p className="text-gray-400">L5-Vincom 3/2, 3C Đường 3/2, Q.10</p>
                                            </div>
                                        </div>

                                        {/* Showtimes */}
                                        {cinemaShowtimesLoading ? (
                                            <div className="text-center py-8">
                                                <div className="text-gray-400">Loading showtimes...</div>
                                            </div>
                                        ) : extractedShowtimes.length > 0 ? (
                                            <div className="space-y-6">
                                                <h4 className="text-lg font-semibold text-gray-300 mb-4">VIEWING TIMES</h4>
                                                <div className="grid grid-cols-3 gap-3">
                                                    {extractedShowtimes.map((lichChieu, index) => (
                                                        <button
                                                            key={index}
                                                            className="px-4 py-3 bg-yellow-400 text-gray-900 rounded-lg font-semibold hover:bg-yellow-300 transition-colors text-center"
                                                        >
                                                            {new Date(lichChieu.ngayChieuGioChieu).toLocaleTimeString('vi-VN', {
                                                                hour: '2-digit',
                                                                minute: '2-digit',
                                                                second: '2-digit'
                                                            })}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-8">
                                                <div className="text-gray-400">Chưa có lịch chiếu cho ngày này</div>
                                                {cinemaShowtimesError && (
                                                    <div className="text-red-400 mt-2">Error: {cinemaShowtimesError}</div>
                                                )}
                                            </div>
                                        )}
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
                )}
            </div>
        </div>
    );
}

export default MovieDetail; 