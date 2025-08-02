import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchListMovie, fetchBanner, fetchCinemaShowtimes, fetchCinemaComplex, fetchCinemaShowtimesByComplex } from './slice';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    loading,
    data,
    error,
    bannerLoading,
    bannerData,
    bannerError,
    cinemaShowtimesLoading,
    cinemaShowtimesData,
    cinemaShowtimesError,
    cinemaComplexLoading,
    cinemaComplexData,
    cinemaComplexError,
    cinemaShowtimesByComplexLoading,
    cinemaShowtimesByComplexData,
    cinemaShowtimesByComplexError
  } = useSelector((state) => state.listMovie);
  // Get user info from login state
  const { user, isAuthenticated } = useSelector((state) => state.login);

  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [selectedCinemaSystem, setSelectedCinemaSystem] = useState(null);
  const [selectedCinemaComplex, setSelectedCinemaComplex] = useState(null);

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

  useEffect(() => {
    dispatch(fetchListMovie());
    dispatch(fetchBanner());
    dispatch(fetchCinemaShowtimes()); // Fetch cinema systems
  }, [dispatch]);

  // Auto-select first cinema system and complex when data loads
  useEffect(() => {
    if (cinemaShowtimesData?.content && cinemaShowtimesData.content.length > 0 && !selectedCinemaSystem) {
      const firstCinemaSystem = cinemaShowtimesData.content[0];
      setSelectedCinemaSystem(firstCinemaSystem);
      dispatch(fetchCinemaComplex(firstCinemaSystem.maHeThongRap));
    }
  }, [cinemaShowtimesData, selectedCinemaSystem, dispatch]);

  // Auto-select first cinema complex when complex data loads
  useEffect(() => {
    if (cinemaComplexData?.content && cinemaComplexData.content.length > 0 && selectedCinemaSystem && !selectedCinemaComplex) {
      const firstCinemaComplex = cinemaComplexData.content[0];
      setSelectedCinemaComplex(firstCinemaComplex);
      dispatch(fetchCinemaShowtimesByComplex({
        maHeThongRap: selectedCinemaSystem.maHeThongRap,
        maNhom: "GP07"
      }));
    }
  }, [cinemaComplexData, selectedCinemaSystem, selectedCinemaComplex, dispatch]);

  // Auto-rotate banner every 5 seconds
  useEffect(() => {
    if (bannerData?.content && bannerData.content.length > 1) {
      const interval = setInterval(() => {
        setCurrentBannerIndex((prev) =>
          prev === bannerData.content.length - 1 ? 0 : prev + 1
        );
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [bannerData]);

  const handleMovieClick = (maPhim) => {
    navigate(`/chitietphim/${maPhim}`);
  };

  const handleCinemaSystemClick = (heThongRap) => {
    setSelectedCinemaSystem(heThongRap);
    setSelectedCinemaComplex(null); // Clear selected complex when system changes
    dispatch(fetchCinemaComplex(heThongRap.maHeThongRap));
  };

  const handleCinemaComplexClick = (cumRap) => {
    setSelectedCinemaComplex(cumRap);
    // Fetch showtimes for this specific cinema system
    dispatch(fetchCinemaShowtimesByComplex({
      maHeThongRap: selectedCinemaSystem.maHeThongRap,
      maNhom: "GP07"
    }));
  };

  // Helper function to extract movies and showtimes from API response
  const extractMoviesAndShowtimes = (showtimesData, selectedCinemaComplex) => {
    if (!showtimesData?.content || !Array.isArray(showtimesData.content) || !selectedCinemaComplex) {
      return [];
    }

    const movies = [];

    // The API returns content as an array, where each item contains lstCumRap
    showtimesData.content.forEach(heThongRap => {
      if (heThongRap.lstCumRap) {
        heThongRap.lstCumRap.forEach(cumRap => {
          // Check if this is the selected cinema complex
          if (cumRap.maCumRap === selectedCinemaComplex.maCumRap) {
            if (cumRap.danhSachPhim) {
              cumRap.danhSachPhim.forEach(phim => {
                const movie = {
                  maPhim: phim.maPhim,
                  tenPhim: phim.tenPhim,
                  hinhAnh: phim.hinhAnh,
                  showtimes: []
                };

                if (phim.lstLichChieuTheoPhim) {
                  phim.lstLichChieuTheoPhim.forEach(lichChieu => {
                    movie.showtimes.push({
                      maLichChieu: lichChieu.maLichChieu,
                      tenRap: lichChieu.tenRap,
                      ngayChieuGioChieu: lichChieu.ngayChieuGioChieu,
                      giaVe: lichChieu.giaVe
                    });
                  });
                }

                movies.push(movie);
              });
            }
          }
        });
      }
    });

    return movies;
  };

  const moviesWithShowtimes = extractMoviesAndShowtimes(cinemaShowtimesByComplexData, selectedCinemaComplex);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Banner Section */}
      {bannerData?.content && bannerData.content.length > 0 && (
        <section className="relative h-[500px] bg-gradient-to-r from-gray-800 to-gray-900 overflow-hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>

          {/* Banner Images */}
          <div className="relative z-10 h-full">
            {bannerData.content.map((banner, index) => (
              <div
                key={banner.maBanner}
                className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBannerIndex ? 'opacity-100' : 'opacity-0'
                  }`}
              >
                <img
                  src={banner.hinhAnh}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
            ))}
          </div>

          {/* Banner Navigation Dots */}
          {bannerData.content.length > 1 && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex space-x-2">
              {bannerData.content.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBannerIndex(index)}
                  className={`w-3 h-3 rounded-full transition-colors duration-200 ${index === currentBannerIndex
                    ? 'bg-yellow-400'
                    : 'bg-white bg-opacity-50 hover:bg-opacity-75'
                    }`}
                />
              ))}
            </div>
          )}

          {/* Previous/Next Buttons */}
          {bannerData.content.length > 1 && (
            <>
              <button
                onClick={() => setCurrentBannerIndex(prev =>
                  prev === 0 ? bannerData.content.length - 1 : prev - 1
                )}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentBannerIndex(prev =>
                  prev === bannerData.content.length - 1 ? 0 : prev + 1
                )}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-30 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </section>
      )}

      {/* Movie List Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {data && data.content && data.content.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {data.content.map((movie) => (
                <div key={movie.maPhim} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative cursor-pointer" onClick={() => handleMovieClick(movie.maPhim)}>
                    <img
                      src={movie.hinhAnh}
                      alt={movie.tenPhim}
                      className="w-full h-80 object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <div className="absolute top-3 right-3 bg-yellow-400 text-gray-900 px-3 py-1 rounded text-base font-semibold">
                      {movie.danhGia}/10
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-xl text-center">{movie.tenPhim}</h3>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 text-xl">
              Không có phim nào được tìm thấy
            </div>
          )}
        </div>
      </section>

      {/* Cinema Showtimes Section (3-column layout) */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {cinemaShowtimesLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-gray-400">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                <p className="text-xl">Đang tải hệ thống rạp...</p>
              </div>
            </div>
          ) : cinemaShowtimesError ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-red-400">
                <p className="text-xl">Lỗi: {cinemaShowtimesError}</p>
              </div>
            </div>
          ) : cinemaShowtimesData?.content && cinemaShowtimesData.content.length > 0 ? (
            <div className="flex">
              {/* Cinema Systems Sidebar (Column 1) */}
              <div className="w-64 bg-gray-800 rounded-l-lg p-4">
                <div className="space-y-4">
                  {cinemaShowtimesData.content.map((heThongRap, index) => (
                    <div
                      key={heThongRap.maHeThongRap}
                      className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedCinemaSystem?.maHeThongRap === heThongRap.maHeThongRap
                        ? 'bg-yellow-400 text-gray-900'
                        : 'hover:bg-gray-700'
                        }`}
                      onClick={() => handleCinemaSystemClick(heThongRap)}
                    >
                      <img
                        src={heThongRap.logo}
                        alt={heThongRap.tenHeThongRap}
                        className="w-16 h-16 object-contain mb-2"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                      <span className={`text-xs text-center font-semibold ${selectedCinemaSystem?.maHeThongRap === heThongRap.maHeThongRap
                        ? 'text-gray-900'
                        : 'text-white'
                        }`}>
                        {heThongRap.tenHeThongRap}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Content Panels (Column 2 & 3) */}
              {selectedCinemaSystem && cinemaComplexData?.content ? (
                <div className="flex flex-1">
                  {/* Cinema Complexes Sidebar (Column 2) */}
                  <div className="w-80 bg-gray-700 p-4">
                    <div className="space-y-4">
                      {cinemaComplexData.content.map((cumRap, index) => (
                        <div
                          key={cumRap.maCumRap}
                          className={`flex flex-col items-center p-3 rounded-lg cursor-pointer transition-colors ${selectedCinemaComplex?.maCumRap === cumRap.maCumRap ? 'bg-yellow-400 text-gray-900' : 'hover:bg-gray-600'
                            }`}
                          onClick={() => handleCinemaComplexClick(cumRap)}
                        >
                          <img
                            src={selectedCinemaSystem.logo}
                            alt={selectedCinemaSystem.tenHeThongRap}
                            className="w-16 h-16 object-contain mb-2"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                          <span className={`text-xs text-center font-semibold ${selectedCinemaComplex?.maCumRap === cumRap.maCumRap
                            ? 'text-gray-900'
                            : 'text-white'
                            }`}>
                            {cumRap.tenCumRap}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Movies Panel (Column 3) */}
                  <div className="flex-1 bg-gray-800 rounded-r-lg p-6">
                    {selectedCinemaComplex ? (
                      <div>
                        {cinemaShowtimesByComplexLoading ? (
                          <div className="flex items-center justify-center h-64">
                            <div className="text-center text-gray-400">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                              <p className="text-xl">Đang tải lịch chiếu...</p>
                            </div>
                          </div>
                        ) : moviesWithShowtimes.length > 0 ? (
                          <div className="space-y-6">
                            {moviesWithShowtimes.map((phim, phimIndex) => (
                              <div key={phimIndex} className="flex items-start space-x-4 p-4 bg-gray-700 rounded-lg">
                                <img
                                  src={phim.hinhAnh}
                                  alt={phim.tenPhim}
                                  className="w-20 h-28 object-cover rounded"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                  }}
                                />
                                <div className="flex-1">
                                  <h5 className="font-semibold text-white mb-2">{phim.tenPhim}</h5>
                                  <div className="space-y-2">
                                    <div className="border-l-2 border-yellow-400 pl-3">
                                      <div className="text-sm text-gray-400 mb-1">
                                        {selectedCinemaComplex.tenCumRap} - {new Date().toLocaleDateString('vi-VN')}
                                      </div>
                                      <div className="flex flex-wrap gap-2">
                                        {phim.showtimes.map((showtime, showtimeIndex) => (
                                          <button
                                            key={showtimeIndex}
                                            className="px-3 py-1 bg-yellow-400 text-gray-900 rounded text-sm font-semibold hover:bg-yellow-300 transition-colors"
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
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-64">
                            <div className="text-center text-gray-400">
                              <div className="text-6xl mb-4">🎬</div>
                              <p className="text-xl">Không có lịch chiếu cho rạp này</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-64">
                        <div className="text-center text-gray-400">
                          <div className="text-6xl mb-4">🎬</div>
                          <p className="text-xl">Chọn rạp để xem phim</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 bg-gray-800 rounded-r-lg p-6">
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-gray-400">
                      <div className="text-6xl mb-4">🎬</div>
                      <p className="text-xl">Chọn hệ thống rạp để xem thông tin</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-4">🎬</div>
                <p className="text-xl">Không có hệ thống rạp nào</p>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;