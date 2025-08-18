import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../services/api';


export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await api.get(`/QuanLyNguoiDung/LayDanhSachNguoiDung`);
    return response.data;
});

export const fetchUserTypes = createAsyncThunk('users/fetchUserTypes', async (_, { rejectWithValue }) => {
    try {

        const response = await api.get(`/QuanLyNguoiDung/LayDanhSachLoaiNguoiDung`);
        return response.data;
    }
    catch (error) {
        let errorMessage = "";

        if (error.response?.data?.content) {
            errorMessage = error.response.data.content;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.response?.data) {
            errorMessage = typeof error.response.data === 'string'
                ? error.response.data
                : JSON.stringify(error.response.data);
        } else if (error.message) {
            errorMessage = error.message;
        }

        return rejectWithValue(errorMessage);
    }
});

export const addUser = createAsyncThunk('users/addUser', async (userData, { rejectWithValue }) => {

    try {
        const res = await api.post(`/QuanLyNguoiDung/ThemNguoiDung`, userData, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        console.log(res, 'res addUser');
        return res.data;
    } catch (error) {
        let errorMessage = "Error system";

        if (error.response?.data?.content) {
            errorMessage = error.response.data.content;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.response?.data) {
            errorMessage = typeof error.response.data === 'string'
                ? error.response.data
                : JSON.stringify(error.response.data);
        } else if (error.message) {
            errorMessage = error.message;
        }

        return rejectWithValue(errorMessage);
    }

});

export const editUser = createAsyncThunk('users/editUser', async (userData, { rejectWithValue }) => {
    try {
        const res = await api.put(`/QuanLyNguoiDung/CapNhatThongTinNguoiDung`, userData, {
            headers: {
                "Content-Type": "application/json"
            },
        });
        console.log(res, 'res editUser');
        return res.data;
    }
    catch (error) {
        let errorMessage = "Đăng ký thất bại";

        if (error.response?.data?.content) {
            errorMessage = error.response.data.content;
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.response?.data) {
            errorMessage = typeof error.response.data === 'string'
                ? error.response.data
                : JSON.stringify(error.response.data);
        } else if (error.message) {
            errorMessage = error.message;
        }

        return rejectWithValue(errorMessage);
    }
});

const userSlice = createSlice({
    name: 'users',
    initialState: {
        user: {
            taiKhoan: "",
            matKhau: "",
            hoTen: "",
            email: "",
            soDT: "",
            maNhom: "",
            maLoaiNguoiDung: "",
            accessToken: ""
        },
        list: [],
        userTypes: [],
        status: 'idle',
        listFilter: [],
        loading: false,
        error: "",
        success: false
    },
    reducers: {
        searchUsers: (state, action) => {
            const textSearch = action.payload;
            state.listFilter = state.list.filter(user =>
                user.hoTen?.toLowerCase().includes(textSearch.toLowerCase()) ||
                user.taiKhoan?.toLowerCase().includes(textSearch.toLowerCase()) ||
                user.soDT?.toLowerCase().includes(textSearch.toLowerCase()) ||
                user.maNhom?.toLowerCase().includes(textSearch.toLowerCase()) ||
                user.maLoaiNguoiDung?.toLowerCase().includes(textSearch.toLowerCase()) ||
                user.email?.includes(textSearch)
            );
        },
        resetState: (state) => {
            state.error = "";
            state.success = false;
            state.loading = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state, action) => {
                state.error = "";
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.list = action.payload.content;
                state.listFilter = action.payload.content;
                state.status = 'succeeded';
            })
            .addCase(fetchUserTypes.fulfilled, (state, action) => {
                state.userTypes = action.payload.content;
            })
            .addCase(addUser.pending, (state, action) => {
                state.error = "";
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.user = action.payload.content;
                state.error = action.payload.message;
                state.success = true;
            })
            .addCase(addUser.rejected, (state, action) => {
                state.error = action.payload || "Lỗi hệ thống";
                state.success = false;
            })
            .addCase(editUser.pending, (state, action) => {
                state.error = "";
                state.success = false;
            })
            .addCase(editUser.fulfilled, (state, action) => {
                state.user = action.payload.content;
                state.error = action.payload.message;
                state.success = true;
            })
            .addCase(editUser.rejected, (state, action) => {
                state.error = action.payload || "Lỗi hệ thống";
                state.success = false;
            });

    },
});

export const { searchUsers, resetState } = userSlice.actions;

export default userSlice.reducer;
