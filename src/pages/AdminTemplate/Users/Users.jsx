
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, fetchUserTypes, addUser, searchUsers, editUser, resetState } from './slice';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/16/solid';
import { z } from "zod";
import { toast, ToastContainer } from 'react-toastify';

const userSchema = z.object({
    taiKhoan: z.string().nonempty("Tài khoản không được để trống"),
    matKhau: z.string().nonempty("Mật khẩu không được để trống"),
    hoTen: z.string().nonempty("Họ tên không được để trống"),
    email: z.email().nonempty("Email không đúng định dạng"),
    soDT: z.string().regex(/^\d{10}$/, "Số điện thoại phải có 10 chữ số"),
    maLoaiNguoiDung: z.string().nonempty("Mã người dùng không được để trống"),
});

export default function Users() {
    const dispatch = useDispatch();
    // const usersOrg = useSelector((state) => state.usersAdmin.list);
    // const users = useSelector((state) => state.usersAdmin.listFilter);
    const { error, success, listFilter } = useSelector((state) => state.usersAdmin);
    const users = listFilter;

    const user = useSelector((state) => state.usersAdmin.user);
    const userTypes = useSelector((state) => state.usersAdmin.userTypes || []);
    const [textSearch, setTextSearch] = useState('');

    const [form, setForm] = useState({
        taiKhoan: '',
        matKhau: '',
        hoTen: '',
        email: '',
        soDT: '',
        maNhom: 'GP01',
        maLoaiNguoiDung: '',
    });

    useEffect(() => {
        dispatch(fetchUsers());
        dispatch(fetchUserTypes());
    }, [dispatch]);

    useEffect(() => {
        dispatch(searchUsers(textSearch));
    }, [textSearch]);

    useEffect(() => {
        if (success && error != "") {
            toast.success(error);
        } else if (error != "") {
            toast.error(error);
        }
        dispatch(resetState());
    }, [error, success]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };


    const resetForm = () => {
        setForm({
            taiKhoan: '',
            matKhau: '',
            hoTen: '',
            email: '',
            soDT: '',
            maNhom: 'GP01',
            maLoaiNguoiDung: '',
        });
        setAction('themmoi');
    }

    const fillFormData = (taiKhoan) => {
        setAction('sua');
        const data = users.find(sv => sv.taiKhoan == taiKhoan);
        setForm({
            taiKhoan: data.taiKhoan,
            matKhau: data.matKhau,
            hoTen: data.hoTen,
            email: data.email,
            soDT: data.soDT,
            maNhom: data.maNhom,
            maLoaiNguoiDung: data.maLoaiNguoiDung
        });
    };

    const [action, setAction] = useState('themmoi');
    const handleOnAddNew = async (e) => {
        e.preventDefault();
        setAction('themmoi');

        const payload = handlePayload();
        if (!payload) return;
        await dispatch(addUser(payload));
        dispatch(fetchUsers());

        resetForm();
    }

    const handleOnEdit = async (e) => {
        e.preventDefault();
        setAction('sua');
        const payload = handlePayload();
        if (!payload) return;
        await dispatch(editUser(payload));
        dispatch(fetchUsers());

        resetForm();
    }

    const handlePayload = () => {
        const result = userSchema.safeParse(form)
        if (!result.success) {
            const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
            toast.error(firstError || "Dữ liệu không hợp lệ");
            return;
        }

        const payload = new FormData();
        payload.append("taiKhoan", form.taiKhoan);
        payload.append("matKhau", form.matKhau);
        payload.append("hoTen", form.hoTen);
        payload.append("email", form.email);
        payload.append("soDT", form.soDT);
        payload.append("maNhom", "GP00");
        payload.append("maLoaiNguoiDung", form.maLoaiNguoiDung);

        return Object.fromEntries(payload.entries());
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Quản lý người dùng</h1>

            <form className="space-y-4 bg-white p-4 rounded shadow">
                <div className="grid grid-cols-2 gap-4">
                    <div className='flex flex-col'>
                        <label htmlFor="Tài khoản" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Tài khoản</label>
                        <input name="taiKhoan" value={form.taiKhoan} onChange={handleChange} placeholder="Tài khoản" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="Tài khoản" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Mật khẩu</label>
                        <input name="matKhau" value={form.matKhau} onChange={handleChange} placeholder="Mật khẩu" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="Tài khoản" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Họ tên</label>
                        <input name="hoTen" value={form.hoTen} onChange={handleChange} placeholder="Họ tên" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>

                    <div className='flex flex-col'>
                        <label htmlFor="Tài khoản" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Email</label>
                        <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>


                    <div>
                        <label htmlFor="Tài khoản" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Số điện thoại</label>
                        <input name="soDT" value={form.soDT} onChange={handleChange} placeholder="Số điện thoại" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" />
                    </div>
                    <div>
                        <label htmlFor="Loại người dùng" className="text-left block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Loại người dùng</label>
                        <select name="maLoaiNguoiDung" value={form.maLoaiNguoiDung} onChange={handleChange} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                            <option value="">-- Loại người dùng --</option>
                            {userTypes.map((type) => (
                                <option key={type.maLoaiNguoiDung} value={type.maLoaiNguoiDung}>
                                    {type.tenLoai}
                                </option>
                            ))}
                        </select>

                    </div>
                </div>
                {action && action == 'themmoi' && (
                    <button type="button" onClick={handleOnAddNew} className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">Thêm người dùng</button>
                )}

                {action && action == 'sua' && (
                    <button type="button" onClick={handleOnEdit} className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded">Sửa người dùng</button>
                )}
            </form>

            <div className='pt-5'>
                <div className='flex w-full'>
                    <input
                        type="text"
                        placeholder="Tìm kiếm người dùng..."
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
                <table className="w-full mt-6 border border-gray-300 rounded shadow">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 text-left">Tài khoản</th>
                            <th className="px-4 py-2 text-left">Họ tên</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">SĐT</th>
                            <th className="px-4 py-2 text-left">Loại</th>
                            <th className="px-4 py-2 text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users && Array.isArray(users) ? users.map((user) => (
                            <tr key={user.taiKhoan} className='cursor-pointer hover:bg-gray-100'>
                                <td className="px-4 py-2">{user.taiKhoan}</td>
                                <td className="px-4 py-2">{user.hoTen}</td>
                                <td className="px-4 py-2">{user.email}</td>
                                <td className="px-4 py-2">{user.soDT}</td>
                                <td className="px-4 py-2">{user.maLoaiNguoiDung}</td>
                                <td className="text-left px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <button className="btn btn-info" data-toggle="modal" onClick={() => fillFormData(user.taiKhoan)}><PencilSquareIcon className="h-5 w-5 text-purple-500" /></button>
                                    <button className="btn btn-danger" onClick={() => handleOnDelete(user.taiKhoan)}><TrashIcon className="h-5 w-5 text-red-500" /> </button>
                                </td>
                            </tr>
                        )) : ''}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
}
