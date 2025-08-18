// pages/Movies.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { deleteMovie, fetchMovieList, searchMovies } from "./slice";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

export default function Movies() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, moviesData, moviesDataFilter, error } = useSelector((state) => state.moviesAdmin);
  const [textSearch, setTextSearch] = useState('');

  useEffect(() => {
    dispatch(fetchMovieList());
  }, []);

  useEffect(() => {
    dispatch(searchMovies(textSearch));
  }, [textSearch])

 const handleDelete  = async (maphim) => {
    dispatch(deleteMovie(maphim));
    toast.success("Delete success")
  }

  function scrollToBottom() {
    window.scrollTo({
      top: document.body.scrollHeight/3,
      behavior: "smooth",
    });
  }

  if (!moviesData) return (<div>Loading.....</div>);

  return (
    <div className="p-6">
      <div className="flex flex-col justify-between mb-4 gap-3">
        <h2 className=" block text-2xl font-bold">Quản lý Phim</h2>
        <NavLink
          to="/admin/movies/add-new"
          className="bg-transparent cursor-pointer text-black border border-blue-600 px-4 py-2 rounded w-max inline-block text-center"
        >
          Thêm phim
        </NavLink>
      </div>

      <div className="flex w-full  mb-3">
        <input
          type="text"
          placeholder="Input search text"
          value={textSearch}
          onChange={(e) => setTextSearch(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
        <button
          className="flex items-center justify-center px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 transition"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M10 2a8 8 0 015.29 13.71l4.58 4.58a1 1 0 01-1.42 1.42l-4.58-4.58A8 8 0 1110 2zm0 2a6 6 0 100 12 6 6 0 000-12z" />
          </svg>
        </button>
      </div>

      <table className="w-full text-left ">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Mã phim</th>
            <th>Hình ảnh</th>
            <th>Tên phim</th>
            <th>Mô tả</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {moviesDataFilter && Array.isArray(moviesDataFilter) ? moviesDataFilter.map((movie) => (
            <tr key={movie.maPhim} className="hover:bg-gray-50">
              <td className="p-2">{movie.maPhim}</td>
              <td>
                <img src={movie.hinhAnh} alt={movie.tenPhim} className="h-16 w-12 object-cover" />
              </td>
              <td>{movie.tenPhim}</td>
              <td className="max-w-md truncate">{movie.moTa.slice(0, 50)}...</td>
              <td className="space-x-2">
                <NavLink
                  to={`/admin/movies/edit/${movie.maPhim}`}
                  title="Edit"
                  className="inline-block cursor-pointer"
                >
                  ✏️
                </NavLink>
                <NavLink
                  to=''
                  title="Delete"
                  onClick={() => handleDelete(movie.maPhim)}
                  className="inline-block cursor-pointer text-red-500 hover:text-red-700 transition"
                >
                  🗑️
                </NavLink>
                <NavLink
                  to={`/admin/movies/showtimes/${movie.maPhim}`}
                  title="Showtime"
                  className="inline-block cursor-pointer"
                  onClick={scrollToBottom}
                >
                  📅
                </NavLink>
              </td>
            </tr>
          )) : ''}
        </tbody>
      </table>
       <ToastContainer />
    </div>
  );
}
