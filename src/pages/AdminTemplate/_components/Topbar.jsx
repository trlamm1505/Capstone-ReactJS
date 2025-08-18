import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../HomeTemplate/LoginPage/slice";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const { user } = useSelector((state) => state.login);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <div className="h-16 bg-white border-b px-6 flex items-center justify-between">
      <div></div>
      <div className="flex items-center space-x-4">
        <span className="bg-pink-200 text-pink-900 px-3 py-1 rounded-full">{user?.hoTen || user?.taikhoan || 'A'}.</span>
        <button onClick={handleLogout} className="text-blue-600 hover:underlin cursor-pointer">Đăng xuất</button>
      </div>
    </div>
  );
}
