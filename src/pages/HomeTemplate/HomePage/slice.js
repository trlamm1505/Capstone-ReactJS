import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

const initialState = {
    loading: false,
    data: null,
    error: null,
    bannerLoading: false,
    bannerData: null,
    bannerError: null,
    cinemaShowtimesLoading: false,
    cinemaShowtimesData: null,
    cinemaShowtimesError: null,
    cinemaComplexLoading: false,
    cinemaComplexData: null,
    cinemaComplexError: null,
    cinemaShowtimesByComplexLoading: false,
    cinemaShowtimesByComplexData: null,
    cinemaShowtimesByComplexError: null,
};

export const fetchListMovie = createAsyncThunk(
    "listMovie/fetchData",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/QuanLyPhim/LayDanhSachPhim", {
                params: {
                    maNhom: "GP07"
                }
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch movies");
        }
    }
);

export const fetchBanner = createAsyncThunk(
    "listMovie/fetchBanner",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/QuanLyPhim/LayDanhSachBanner");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch banners");
        }
    }
);

export const fetchCinemaShowtimes = createAsyncThunk(
    "listMovie/fetchCinemaShowtimes",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/QuanLyRap/LayThongTinHeThongRap");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch cinema systems");
        }
    }
);

export const fetchCinemaComplex = createAsyncThunk(
    "listMovie/fetchCinemaComplex",
    async (maHeThongRap, { rejectWithValue }) => {
        try {
            const response = await api.get(`/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch cinema complex");
        }
    }
);

export const fetchCinemaShowtimesByComplex = createAsyncThunk(
    "listMovie/fetchCinemaShowtimesByComplex",
    async ({ maHeThongRap, maNhom }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${maHeThongRap}&maNhom=${maNhom}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch cinema showtimes by complex");
        }
    }
);

const listMovieSlice = createSlice({
    name: "listMovie",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchListMovie.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchListMovie.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchListMovie.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBanner.pending, (state) => {
                state.bannerLoading = true;
                state.bannerError = null;
            })
            .addCase(fetchBanner.fulfilled, (state, action) => {
                state.bannerLoading = false;
                state.bannerData = action.payload;
                state.bannerError = null;
            })
            .addCase(fetchBanner.rejected, (state, action) => {
                state.bannerLoading = false;
                state.bannerError = action.payload;
            })
            .addCase(fetchCinemaShowtimes.pending, (state) => {
                state.cinemaShowtimesLoading = true;
                state.cinemaShowtimesError = null;
            })
            .addCase(fetchCinemaShowtimes.fulfilled, (state, action) => {
                state.cinemaShowtimesLoading = false;
                state.cinemaShowtimesData = action.payload;
                state.cinemaShowtimesError = null;
            })
            .addCase(fetchCinemaShowtimes.rejected, (state, action) => {
                state.cinemaShowtimesLoading = false;
                state.cinemaShowtimesError = action.payload;
            })
            .addCase(fetchCinemaComplex.pending, (state) => {
                state.cinemaComplexLoading = true;
                state.cinemaComplexError = null;
            })
            .addCase(fetchCinemaComplex.fulfilled, (state, action) => {
                state.cinemaComplexLoading = false;
                state.cinemaComplexData = action.payload;
                state.cinemaComplexError = null;
            })
            .addCase(fetchCinemaComplex.rejected, (state, action) => {
                state.cinemaComplexLoading = false;
                state.cinemaComplexError = action.payload;
            })
            .addCase(fetchCinemaShowtimesByComplex.pending, (state) => {
                state.cinemaShowtimesByComplexLoading = true;
                state.cinemaShowtimesByComplexError = null;
            })
            .addCase(fetchCinemaShowtimesByComplex.fulfilled, (state, action) => {
                state.cinemaShowtimesByComplexLoading = false;
                state.cinemaShowtimesByComplexData = action.payload;
                state.cinemaShowtimesByComplexError = null;
            })
            .addCase(fetchCinemaShowtimesByComplex.rejected, (state, action) => {
                state.cinemaShowtimesByComplexLoading = false;
                state.cinemaShowtimesByComplexError = action.payload;
            });
    },
});

export const { clearError } = listMovieSlice.actions;
export default listMovieSlice.reducer;
