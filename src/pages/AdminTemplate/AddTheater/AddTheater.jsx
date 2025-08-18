import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchTheaterSystems,
    fetchCinemaClusters,
    createShowtime,
    clearCinemaClusters,
} from "./slice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import z from "zod";
import { format } from "date-fns";

export default function AddTheaterForm() {
    const dispatch = useDispatch();
    const {
        theaterSystems,
        cinemaClusters,
        loadingTheaterSystems,
        loadingCinemaClusters,
        loadingCreate,
        error,
    } = useSelector((state) => state.showtimeAdmin);

    const {moviesData} = useSelector((state) => state.moviesAdmin);

    const [formData, setFormData] = useState({
        maPhim: "",
        heThongRap: "",
        cumRap: "",
        ngayChieuGioChieu: "",
        giaVe: "",
    });

    // Load theater systems on mount
    useEffect(() => {
        dispatch(fetchTheaterSystems());
    }, [dispatch]);

    // Fetch cinema clusters when theater system changes
    useEffect(() => {
        if (formData.heThongRap) {
            dispatch(fetchCinemaClusters(formData.heThongRap));
        } else {
            dispatch(clearCinemaClusters());
        }
    }, [dispatch, formData.heThongRap]);

    // Handle input changes
    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const showtimeSchema = z.object({
        maPhim: z.string().nonempty("Vui lòng chọn Phim."),
        heThongRap: z.string().nonempty("Vui lòng chọn hệ thống rạp."),
        cumRap: z.string().nonempty("Vui lòng chọn cụm rạp."),
        ngayChieuGioChieu: z.string().nonempty("Vui lòng chọn ngày giờ chiếu."),
        giaVe: z
            .string()
            .nonempty("Vui lòng nhập giá vé.")
            .refine((val) => Number(val) > 0, { message: "Giá vé phải lớn hơn 0." }),
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = showtimeSchema.safeParse(formData);

        if (!result.success) {
            // Get first error message
            const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
            toast.error(firstError || "Dữ liệu không hợp lệ");
            return;
        }

        // validated data
        const validatedData = result.data;

        const payload = {
            maPhim: Number(validatedData.maPhim), // your movie ID here
            ngayChieuGioChieu: format(new Date(validatedData.ngayChieuGioChieu), "dd/MM/yyyy HH:mm:ss"),
            maRap: validatedData.cumRap,
            giaVe: Number(validatedData.giaVe),
        };

        try {
            await dispatch(createShowtime(payload)).unwrap();
            toast.success("Tạo lịch chiếu thành công!");
            setFormData({
                maPhim: "",
                heThongRap: "",
                cumRap: "",
                ngayChieuGioChieu: "",
                giaVe: "",
            });
            dispatch(clearCinemaClusters());
        } catch (err) {
            toast.error("Tạo lịch chiếu thất bại: " + (err.message || err));
        }
    };

    return (
        <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
            <h2 className="text-xl font-bold mb-4">Tạo lịch chiếu</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold">Danh sách Phim</label>
                    <select
                        name="maPhim"
                        value={formData.maPhim}
                        onChange={handleChange}
                        disabled={loadingTheaterSystems}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">Chọn phim</option>
                        {moviesData && Array.isArray(moviesData) ? moviesData.map((sys) => (
                            <option key={sys.maPhim} value={sys.maPhim}>
                                {sys.tenPhim}
                            </option>
                        )) : <option key='' value=''></option>}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Hệ thống rạp</label>
                    <select
                        name="heThongRap"
                        value={formData.heThongRap}
                        onChange={handleChange}
                        disabled={loadingTheaterSystems}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">Chọn hệ thống rạp</option>
                        {theaterSystems && Array.isArray(theaterSystems) ? theaterSystems.map((sys) => (
                            <option key={sys.maHeThongRap} value={sys.maHeThongRap}>
                                {sys.tenHeThongRap}
                            </option>
                        )) : <option key='' value=''></option>}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Cụm rạp</label>
                    <select
                        name="cumRap"
                        value={formData.cumRap}
                        onChange={handleChange}
                        disabled={!formData.heThongRap || loadingCinemaClusters}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    >
                        <option value="">Chọn cụm rạp</option>
                        {cinemaClusters.map((cluster) => (
                            <option key={cluster.maCumRap} value={cluster.maCumRap}>
                                {cluster.tenCumRap}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Ngày giờ chiếu</label>
                    <input
                        type="datetime-local"
                        name="ngayChieuGioChieu"
                        value={formData.ngayChieuGioChieu}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Giá vé</label>
                    <input
                        type="number"
                        name="giaVe"
                        value={formData.giaVe}
                        onChange={handleChange}
                        min="0"
                        className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loadingCreate}
                    className={`w-full py-2 rounded text-white ${loadingCreate ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loadingCreate ? "Đang tạo..." : "Tạo lịch chiếu"}
                </button>
            </form>

            <ToastContainer />
        </div>
    );
}
