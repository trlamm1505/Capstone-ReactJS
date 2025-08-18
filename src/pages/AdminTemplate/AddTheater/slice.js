import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

// Async Thunks
export const fetchTheaterSystems = createAsyncThunk(
  "showtime/fetchTheaterSystems",
  async () => {
    const response = await api.get("/QuanLyRap/LayThongTinHeThongRap");
    return response.data;
  }
);

export const fetchCinemaClusters = createAsyncThunk(
  "showtime/fetchCinemaClusters",
  async (maHeThongRap) => {
    const response = await api.get(
      `/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`
    );
    return response.data;
  }
);

export const createShowtime = createAsyncThunk(
  "showtime/createShowtime",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/QuanLyDatVe/TaoLichChieu", payload);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const showtimeSlice = createSlice({
  name: "showtime",
  initialState: {
    theaterSystems: [],
    cinemaClusters: [],
    loadingTheaterSystems: false,
    loadingCinemaClusters: false,
    loadingCreate: false,
    error: null,
  },
  reducers: {
    clearCinemaClusters(state) {
      state.cinemaClusters = [];
    },
  },
  extraReducers(builder) {
    builder
      .addCase(fetchTheaterSystems.pending, (state) => {
        state.loadingTheaterSystems = true;
        state.error = null;
      })
      .addCase(fetchTheaterSystems.fulfilled, (state, action) => {
        state.loadingTheaterSystems = false;
        state.theaterSystems = action.payload.content;
      })
      .addCase(fetchTheaterSystems.rejected, (state, action) => {
        state.loadingTheaterSystems = false;
        state.error = action.error.message;
      })
      .addCase(fetchCinemaClusters.pending, (state) => {
        state.loadingCinemaClusters = true;
        state.error = null;
      })
      .addCase(fetchCinemaClusters.fulfilled, (state, action) => {
        state.loadingCinemaClusters = false;
        state.cinemaClusters = action.payload.content;
      })
      .addCase(fetchCinemaClusters.rejected, (state, action) => {
        state.loadingCinemaClusters = false;
        state.error = action.error.message;
      })
      .addCase(createShowtime.pending, (state) => {
        state.loadingCreate = true;
        state.error = null;
      })
      .addCase(createShowtime.fulfilled, (state) => {
        state.loadingCreate = false;
      })
      .addCase(createShowtime.rejected, (state, action) => {
        state.loadingCreate = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearCinemaClusters } = showtimeSlice.actions;
export default showtimeSlice.reducer;
