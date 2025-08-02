import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

const initialState = {
    loading: false,
    data: null,
    error: null,
    showtimesLoading: false,
    showtimesData: null,
    showtimesError: null,
    cinemaSystemsLoading: false,
    cinemaSystemsData: null,
    cinemaSystemsError: null,
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

export const fetchMovieDetail = createAsyncThunk(
    "movieDetail/fetchData",
    async (maPhim, { rejectWithValue }) => {
        try {
            const response = await api.get(`/QuanLyPhim/LayThongTinPhim?MaPhim=${maPhim}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch movie details");
        }
    }
);

export const fetchMovieShowtimes = createAsyncThunk(
    "movieDetail/fetchShowtimes",
    async (maPhim, { rejectWithValue }) => {
        try {
            const response = await api.get(`/QuanLyRap/LayThongTinLichChieuPhim?MaPhim=${maPhim}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch movie showtimes");
        }
    }
);

export const fetchCinemaSystems = createAsyncThunk(
    "movieDetail/fetchCinemaSystems",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/QuanLyRap/LayThongTinHeThongRap");
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch cinema systems");
        }
    }
);

export const fetchCinemaShowtimes = createAsyncThunk(
    "movieDetail/fetchCinemaShowtimes",
    async ({ maHeThongRap, maNhom }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/QuanLyRap/LayThongTinLichChieuHeThongRap?maHeThongRap=${maHeThongRap}&maNhom=${maNhom}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch cinema showtimes");
        }
    }
);

export const fetchCinemaComplex = createAsyncThunk(
    "movieDetail/fetchCinemaComplex",
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
    "movieDetail/fetchCinemaShowtimesByComplex",
    async ({ maCumRap, maNhom }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/QuanLyRap/LayThongTinLichChieuCumRap?maCumRap=${maCumRap}&maNhom=${maNhom}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch cinema showtimes by complex");
        }
    }
);

const movieDetailSlice = createSlice({
    name: "movieDetail",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearShowtimesError: (state) => {
            state.showtimesError = null;
        },
        clearCinemaSystemsError: (state) => {
            state.cinemaSystemsError = null;
        },
        clearCinemaShowtimesError: (state) => {
            state.cinemaShowtimesError = null;
        },
        clearCinemaComplexError: (state) => {
            state.cinemaComplexError = null;
        },
        clearCinemaShowtimesByComplexError: (state) => {
            state.cinemaShowtimesByComplexError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMovieDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMovieDetail.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.error = null;
            })
            .addCase(fetchMovieDetail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMovieShowtimes.pending, (state) => {
                state.showtimesLoading = true;
                state.showtimesError = null;
            })
            .addCase(fetchMovieShowtimes.fulfilled, (state, action) => {
                state.showtimesLoading = false;
                state.showtimesData = action.payload;
                state.showtimesError = null;
            })
            .addCase(fetchMovieShowtimes.rejected, (state, action) => {
                state.showtimesLoading = false;
                state.showtimesError = action.payload;
            })
            .addCase(fetchCinemaSystems.pending, (state) => {
                state.cinemaSystemsLoading = true;
                state.cinemaSystemsError = null;
            })
            .addCase(fetchCinemaSystems.fulfilled, (state, action) => {
                state.cinemaSystemsLoading = false;
                state.cinemaSystemsData = action.payload;
                state.cinemaSystemsError = null;
            })
            .addCase(fetchCinemaSystems.rejected, (state, action) => {
                state.cinemaSystemsLoading = false;
                state.cinemaSystemsError = action.payload;
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

export const { clearError, clearShowtimesError, clearCinemaSystemsError, clearCinemaShowtimesError, clearCinemaComplexError, clearCinemaShowtimesByComplexError } = movieDetailSlice.actions;
export default movieDetailSlice.reducer; 