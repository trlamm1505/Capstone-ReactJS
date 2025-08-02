import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCinemaSystems, fetchCinemaComplexes, setSelectedSystem, clearComplexes } from './slice';

function Cinema() {
  const dispatch = useDispatch();
  const {
    systemsLoading,
    systemsData,
    systemsError,
    complexesLoading,
    complexesData,
    complexesError,
    selectedSystem
  } = useSelector((state) => state.cinema);

  const [isModalOpen, setIsModalOpen] = useState(true);
  const [allComplexes, setAllComplexes] = useState([]);
  const [loadingAllComplexes, setLoadingAllComplexes] = useState(false);

  useEffect(() => {
    dispatch(fetchCinemaSystems());
  }, [dispatch]);

  // Fetch all complexes when systems data is loaded
  useEffect(() => {
    if (systemsData?.content && systemsData.content.length > 0) {
      fetchAllComplexes();
    }
  }, [systemsData]);

  const fetchAllComplexes = async () => {
    setLoadingAllComplexes(true);
    const allComplexesData = [];

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

    setAllComplexes(allComplexesData);
    setLoadingAllComplexes(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Hệ Thống Rạp Chiếu Phim</h1>
          <p className="text-gray-400">Danh sách tất cả các rạp chiếu phim</p>
        </div>

        {/* Loading State */}
        {systemsLoading && (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
              <p className="text-xl text-gray-400">Đang tải hệ thống rạp...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {systemsError && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-6 text-center">
            <p className="text-red-400 text-xl">{systemsError}</p>
          </div>
        )}

        {/* Modal with all complexes */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Danh Sách Tất Cả Rạp Chiếu Phim</h2>
                  <p className="text-gray-400">Chọn rạp để xem lịch chiếu</p>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ×
                </button>
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
                          className="w-20 h-20 mx-auto mb-4 object-contain"
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
                      <div className="flex-shrink-0">
                        <button className="bg-yellow-400 text-gray-900 px-4 py-2 rounded font-semibold hover:bg-yellow-300 transition-colors">
                          Bán vé
                        </button>
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
      </div>
    </div>
  );
}

export default Cinema;
