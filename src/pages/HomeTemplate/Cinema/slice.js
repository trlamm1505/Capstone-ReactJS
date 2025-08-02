import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

// Async thunk for fetching cinema systems
export const fetchCinemaSystems = createAsyncThunk(
    "cinema/fetchCinemaSystems",
    async (_, { rejectWithValue }) => {
        try {
            console.log('Cinema - Fetching cinema systems');
            const response = await api.get("/QuanLyRap/LayThongTinHeThongRap");
            console.log('Cinema - Systems response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Cinema - Systems API error:', error);
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Lỗi khi tải hệ thống rạp";
            return rejectWithValue(errorMessage);
        }
    }
);

// Async thunk for fetching cinema complexes by system
export const fetchCinemaComplexes = createAsyncThunk(
    "cinema/fetchCinemaComplexes",
    async (maHeThongRap, { rejectWithValue }) => {
        try {
            console.log('Cinema - Fetching complexes for:', maHeThongRap);
            const response = await api.get(`/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`);
            console.log('Cinema - Complexes response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Cinema - Complexes API error:', error);
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Lỗi khi tải thông tin rạp con";
            return rejectWithValue(errorMessage);
        }
    }
);

const initialState = {
    systemsLoading: false,
    systemsData: null,
    systemsError: null,
    complexesLoading: false,
    complexesData: null,
    complexesError: null,
    selectedSystem: null
};

const cinemaSlice = createSlice({
    name: "cinema",
    initialState,
    reducers: {
        clearError: (state) => {
            state.systemsError = null;
            state.complexesError = null;
        },
        setSelectedSystem: (state, action) => {
            state.selectedSystem = action.payload;
        },
        clearComplexes: (state) => {
            state.complexesData = null;
            state.complexesError = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Cinema Systems cases
            .addCase(fetchCinemaSystems.pending, (state) => {
                state.systemsLoading = true;
                state.systemsError = null;
            })
            .addCase(fetchCinemaSystems.fulfilled, (state, action) => {
                state.systemsLoading = false;
                state.systemsData = action.payload;
                state.systemsError = null;
            })
            .addCase(fetchCinemaSystems.rejected, (state, action) => {
                state.systemsLoading = false;
                state.systemsError = action.payload || "Lỗi khi tải hệ thống rạp";
            })
            // Cinema Complexes cases
            .addCase(fetchCinemaComplexes.pending, (state) => {
                state.complexesLoading = true;
                state.complexesError = null;
            })
            .addCase(fetchCinemaComplexes.fulfilled, (state, action) => {
                state.complexesLoading = false;
                state.complexesData = action.payload;
                state.complexesError = null;
            })
            .addCase(fetchCinemaComplexes.rejected, (state, action) => {
                state.complexesLoading = false;
                state.complexesError = action.payload || "Lỗi khi tải thông tin rạp con";
            });
    }
});

export const { clearError, setSelectedSystem, clearComplexes } = cinemaSlice.actions;
export default cinemaSlice.reducer;
