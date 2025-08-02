import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchMovieList } from './slice';

function ListMovie() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, data, error } = useSelector((state) => state.listMoviePage);

    // Debug: Log the current state
    console.log('ListMovie - Current state:', { loading, data, error });

    useEffect(() => {
        // Load all movies automatically when component mounts
        console.log('ListMovie - Dispatching fetchMovieList with GP07');
        dispatch(fetchMovieList());
    }, [dispatch]);

    const handleMovieClick = (maPhim) => {
        navigate(`/chitietphim/${maPhim}`);
    };

    const getMovieStatus = (movie) => {
        if (movie.dangChieu) return { text: "Đang Chiếu", color: "bg-green-500" };
        if (movie.sapChieu) return { text: "Sắp Chiếu", color: "bg-yellow-500" };
        return { text: "Đã Chiếu", color: "bg-gray-500" };
    };

    // Check if image URL is valid
    const isValidImageUrl = (url) => {
        if (!url) return false;
        // Check if URL contains common broken image patterns
        if (url.includes('gp07.jpg') && !url.includes('http')) return false;
        return true;
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold mb-4">Danh Sách Phim</h1>
                    <p className="text-gray-400">Khám phá bộ sưu tập phim đa dạng</p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                            <p className="text-xl text-gray-400">Đang tải danh sách phim...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center">
                        <p className="text-red-400 text-xl">{error}</p>
                    </div>
                )}

                {/* Movie Grid */}
                {!loading && !error && data && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {Array.isArray(data.content) ? data.content.map((movie) => {
                            const status = getMovieStatus(movie);
                            console.log('Movie image URL:', movie.hinhAnh);
                            const shouldShowImage = isValidImageUrl(movie.hinhAnh);

                            return (
                                <div key={movie.maPhim} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex flex-col h-full">
                                    <div className="relative cursor-pointer flex-shrink-0" onClick={() => handleMovieClick(movie.maPhim)}>
                                        {shouldShowImage ? (
                                            <img
                                                src={movie.hinhAnh}
                                                alt={movie.tenPhim}
                                                className="w-full h-64 object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    const parent = e.target.parentNode;
                                                    if (!parent.querySelector('.image-fallback')) {
                                                        const fallback = document.createElement('div');
                                                        fallback.className = 'image-fallback w-full h-64 bg-gray-700 flex items-center justify-center';
                                                        fallback.innerHTML = '<div class="text-gray-500 text-center"><div class="text-4xl mb-2">🎬</div><div class="text-sm">Không có ảnh</div></div>';
                                                        parent.appendChild(fallback);
                                                    }
                                                }}
                                                onLoad={(e) => {
                                                    const parent = e.target.parentNode;
                                                    const fallback = parent.querySelector('.image-fallback');
                                                    if (fallback) {
                                                        fallback.remove();
                                                    }
                                                }}
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                                                <div className="text-gray-500 text-center">
                                                    <div className="text-4xl mb-2">🎬</div>
                                                    <div className="text-sm">Không có ảnh</div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute top-2 right-2 bg-yellow-400 text-gray-900 px-2 py-1 rounded text-sm font-semibold">
                                            {movie.danhGia}/10
                                        </div>
                                        <div className={`absolute top-2 left-2 ${status.color} text-white px-2 py-1 rounded text-xs font-semibold`}>
                                            {status.text}
                                        </div>
                                        {movie.hot && (
                                            <div className="absolute top-2 left-2 mt-8 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                                                HOT
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col flex-grow">
                                        <h3 className="font-semibold text-base text-center mb-2 line-clamp-2 min-h-[2.5rem] flex items-center justify-center">{movie.tenPhim}</h3>
                                        <p className="text-gray-400 text-sm text-center line-clamp-3 mb-3 flex-grow">{movie.moTa}</p>
                                        <div className="mt-auto text-center">
                                            <span className="text-yellow-400 text-xs">
                                                Ngày khởi chiếu: {new Date(movie.ngayKhoiChieu).toLocaleDateString('vi-VN')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        }) : (
                            <div className="col-span-full text-center py-12">
                                <div className="text-6xl mb-4">🎬</div>
                                <p className="text-xl text-gray-400">Dữ liệu không đúng định dạng</p>
                                <p className="text-gray-500 mt-2">Vui lòng thử lại sau</p>
                                <pre className="mt-4 text-xs text-gray-600 bg-gray-800 p-4 rounded overflow-auto">
                                    {JSON.stringify(data, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && (!data || !Array.isArray(data.content) || data.content.length === 0) && (
                    <div className="text-center py-12">
                        <div className="text-6xl mb-4">🎬</div>
                        <p className="text-xl text-gray-400">Không tìm thấy phim nào</p>
                        <p className="text-gray-500 mt-2">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ListMovie;
