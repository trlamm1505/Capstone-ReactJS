import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

const initialState = {
    loading: false,
    error: null,
    success: false,
};

export const registerUser = createAsyncThunk(
    "register/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            console.log('Register API - Sending data:', userData);
            const response = await api.post("/QuanLyNguoiDung/DangKy", userData);
            console.log('Register API - Response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Register API - Error:', error);
            console.error('Register API - Error response:', error.response);
            console.error('Register API - Error data:', error.response?.data);

            // Extract error message from different possible locations
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

            console.log('Register API - Final error message:', errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

const registerSlice = createSlice({
    name: "register",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });
    },
});

export const { clearError, clearSuccess } = registerSlice.actions;
export default registerSlice.reducer; 