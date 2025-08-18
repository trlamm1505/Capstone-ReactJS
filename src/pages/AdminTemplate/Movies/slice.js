import api from "../../../services/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
    moviesData: [],
    loading: false,
    error: null,
    moviesDataFilter: []
};

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
            console.log('moviesData - API response:', response.data);
            console.log('moviesData - Response content:', response.data.content);
            console.log('moviesData - Content type:', typeof response.data.content);
            console.log('moviesData - Is content array?', Array.isArray(response.data.content));
            return response.data;
        } catch (error) {
            console.error('moviesData - API error:', error);
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Lỗi khi tải danh sách phim";
            return rejectWithValue(errorMessage);
        }
    }
);

export const deleteMovie = createAsyncThunk(
    "listMovie/deleteMovie",
    async (maPhim, { rejectWithValue }) => {
        try {
            console.log('deleteMovie - deleteMovie maPhim=' + maPhim);
            const response = await api.delete("/QuanLyPhim/XoaPhim", {
                params: {
                    maPhim: maPhim
                }
            });
            return maPhim;
        } catch (error) {
            console.error('deleteMovie - API error:', error);
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Lỗi khi tải danh sách phim";
            return rejectWithValue(errorMessage);
        }
    }
);

const listMovieSlice = createSlice({
    name: "moviesSlice",
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
        },
        searchMovies: (state, action) => {
            const textSearch = action.payload;
            console.log("searchMovies textSearch", textSearch);
            state.moviesDataFilter = state.moviesData.filter(s =>
                s.tenPhim.toLowerCase().includes(textSearch.toLowerCase())
            );
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
                state.moviesData = action.payload?.content || [];
                state.error = null;
                state.moviesDataFilter = state.moviesData || [];
            })
            .addCase(fetchMovieList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Lỗi khi tải danh sách phim";
            })
            .addCase(deleteMovie.fulfilled, (state, action) => {
                  const maPhim = action.payload;
                console.error('deleteMovie - Success:', JSON.stringify( maPhim));
                // fetchMovieList();
              
                state.moviesData = state.moviesData.filter(movie => movie.maPhim !== maPhim);
                state.moviesDataFilter = state.moviesDataFilter.filter(movie => movie.maPhim !== maPhim);
            })
            .addCase(deleteMovie.rejected, (state, action) => {
                console.error('deleteMovie - Failed:', action.payload);
                state.error = action.payload;
            });
    }
});

export const { clearError, setFilters, clearFilters, searchMovies } = listMovieSlice.actions;
export default listMovieSlice.reducer;