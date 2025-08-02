import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

// Async thunk for fetching movie list
export const fetchMovieList = createAsyncThunk(
    "listMovie/fetchMovieList",
    async (_, { rejectWithValue }) => {
        try {
            console.log('ListMovie - Fetching movie list with maNhom=GP07');
            const response = await api.get("/QuanLyPhim/LayDanhSachPhim", {
                params: {
                    maNhom: "GP07"
                }
            });
            console.log('ListMovie - API response:', response.data);
            console.log('ListMovie - Response content:', response.data.content);
            console.log('ListMovie - Content type:', typeof response.data.content);
            console.log('ListMovie - Is content array?', Array.isArray(response.data.content));
            return response.data;
        } catch (error) {
            console.error('ListMovie - API error:', error);
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Lỗi khi tải danh sách phim";
            return rejectWithValue(errorMessage);
        }
    }
);

const initialState = {
    loading: false,
    data: null,
    error: null,
    filters: {
        maNhom: "GP07", // Changed to GP07
        tenPhim: ""
    }
};

const listMovieSlice = createSlice({
    name: "listMovie",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                maNhom: "GP07", // Changed to GP07
                tenPhim: ""
            };
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovieList.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovieList.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchMovieList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Lỗi khi tải danh sách phim";
            });
    }
});

export const { clearError, setFilters, clearFilters } = listMovieSlice.actions;
export default listMovieSlice.reducer;
