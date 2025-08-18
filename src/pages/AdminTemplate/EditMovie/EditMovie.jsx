import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from "react-router-dom";
import { updateMovie, resetUpdateMovieState } from "./slice";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovieDetail } from '../MovieDetailPage/slice';
import { toast, ToastContainer } from 'react-toastify';
import { format } from "date-fns";
import { z } from "zod";

const schema = z.object({
    tenPhim: z.string().nonempty("Tên phim không được để trống"),
    trailer: z.string().url("Trailer phải là URL hợp lệ"),
    moTa: z.string().min(10, "Mô tả phải từ 10 ký tự"),
    ngayKhoiChieu: z.string().nonempty("Vui lòng chọn ngày"),
    dangChieu: z.boolean(),
    sapChieu: z.boolean(),
    hot: z.boolean(),
    danhGia: z.string().nonempty("Đánh giá không được để trống").refine((val) => !isNaN(val) && +val >= 0 && +val <= 10, {
        message: "Số sao từ 0 đến 10",
    }),
    hinhAnh: z.any()
});

export default function EditMovie() {

    const { maPhim } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    console.log('movie edit maPhim...', maPhim);
    const [formData, setFormData] = useState({
        maPhim: "",
        tenPhim: "",
        trailer: "",
        moTa: "",
        ngayKhoiChieu: "",
        dangChieu: false,
        sapChieu: false,
        hot: false,
        danhGia: "",
        hinhAnh: null,
    });

    const { data } = useSelector((state) => state.movieDetailAdmin);
    const { loading, error, success } = useSelector((state) => state.updateMovieAdmin);


    // useEffect(() => {
    //     const testUpdate = async () => {
    //         const testFormData = new FormData();
    //         testFormData.append("maPhim", 12345);
    //         testFormData.append("tenPhim", "Test Movie");
    //         // Add required fields...

    //         await dispatch(updateMovie(testFormData));
    //     };

    //     testUpdate();
    // }, []);

    useEffect(() => {
        if (maPhim) {
            dispatch(fetchMovieDetail(maPhim));
        }
    }, [dispatch, maPhim]);

    const movie = data?.content;

    useEffect(() => {
        if (movie) {
            setFormData({
                maPhim: movie.maPhim,
                tenPhim: movie.tenPhim || "",
                trailer: movie.trailer || "",
                moTa: movie.moTa || "",
                ngayKhoiChieu: new Date(movie.ngayKhoiChieu).toISOString().split("T")[0], // convert to yyyy-MM-dd
                dangChieu: movie.dangChieu || false,
                sapChieu: movie.sapChieu || false,
                hot: movie.hot || false,
                danhGia: movie.danhGia?.toString() || "",
                hinhAnh: null, // keep null to allow uploading a new one
            });
            setPreview(movie.hinhAnh);
        }
    }, [movie]);


    const [preview, setPreview] = useState(null);
    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setFormData({ ...formData, [name]: checked });
        } else if (type === "file") {
            const file = files[0];
            setFormData({ ...formData, hinhAnh: file });
            setPreview(URL.createObjectURL(file));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        console.log('formData edit', formData);
        const validation = schema.safeParse(formData);
        if (!validation.success) {
            const firstError = Object.values(validation.error.flatten().fieldErrors)[0]?.[0];
            toast.error(firstError || "Dữ liệu không hợp lệ");
            return;
        }

        const payload = new FormData();
        payload.append("maPhim", maPhim);
        payload.append("tenPhim", formData.tenPhim);
        payload.append("trailer", formData.trailer);
        payload.append("moTa", formData.moTa);
        payload.append("ngayKhoiChieu", format(new Date(formData.ngayKhoiChieu), "dd/MM/yyyy"));
        payload.append("dangChieu", formData.dangChieu);
        payload.append("sapChieu", formData.sapChieu);
        payload.append("hot", formData.hot);
        payload.append("danhGia", formData.danhGia);
        payload.append("maNhom", "GP07");
        if (formData.hinhAnh) {
            payload.append("hinhAnh", formData.hinhAnh, formData.hinhAnh.name);
        }

        console.log('payloadpayload edit', payload);
        dispatch(updateMovie(payload));
        if (success) {
            setTimeout(()=> {
                toast.success("Edit success");
            
            }, 500)
            navigate('/admin/movies/list')
        }
        else
            toast.error(error);

    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4 ">Cập nhật phim</h2>
            <div className="max-w-screen-xl mx-auto p-4 ">
                <form
                    // onSubmit={handleEditSubmit}
                    className="w-full max-w-2xl mx-auto bg-white p-6 rounded shadow space-y-4"
                >

                    <div>
                        <label className="block mb-1">Tên phim:</label>
                        <input
                            name="tenPhim"
                            value={formData.tenPhim}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-l-md px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Trailer:</label>
                        <input
                            name="trailer"
                            value={formData.trailer}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-l-md px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Mô tả:</label>
                        <textarea
                            name="moTa"
                            value={formData.moTa}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-l-md px-3 py-2"
                            rows="3"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Ngày khởi chiếu:</label>
                        <input
                            type="date"
                            name="ngayKhoiChieu"
                            value={formData.ngayKhoiChieu}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-l-md px-3 py-2"
                        />
                    </div>

                    <div className="flex items-center gap-6">

                        <label className="inline-flex items-center cursor-pointer">
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Đang chiếu</span>
                            <input type="checkbox" name="dangChieu" value={formData.dangChieu} onChange={(e) => setFormData((prev) => ({ ...prev, dangChieu: e.target.checked }))} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>

                        </label>

                        <label className="inline-flex items-center cursor-pointer">
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"> Sắp chiếu</span>
                            <input type="checkbox" name="sapChieu"
                                onChange={(e) => setFormData((prev) => ({ ...prev, sapChieu: e.target.checked }))} value={formData.sapChieu} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>

                        </label>

                        <label className="inline-flex items-center cursor-pointer">
                            <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300"> Hot</span>
                            <input type="checkbox" name="hot" value={formData.hot} onChange={(e) => setFormData((prev) => ({ ...prev, hot: e.target.checked }))} className="sr-only peer" />
                            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600"></div>

                        </label>
                    </div>


                    <div>
                        <label className="block mb-1">Số sao:</label>
                        <input
                            type="number"
                            name="danhGia"
                            value={formData.danhGia}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-l-md px-3 py-2"
                            min="0"
                            max="10"
                        />
                    </div>

                    <div>
                        <label className="block mb-1">Hình ảnh:</label>
                        <input
                            type="file"
                            name="hinhAnh"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        {preview && <img src={preview} alt="preview" className="h-32 mt-2" />}
                    </div>

                    <div>
                        <button
                            type="button"
                            onClick={handleEditSubmit}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Cập nhật
                        </button>
                        <button
                            type="button"
                            onClick={() => window.history.back()}
                            className="bg-orange-300 text-white px-4 py-2 rounded hover:bg-orange-600 ml-[10px]"
                        >
                            Quay lại
                        </button>
                    </div>
                </form>
                <ToastContainer />
            </div>
        </div>

    );
}
