import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../services/api";

export const updateMovie = createAsyncThunk(
  "movie/updateMovie",
  async (formData, thunkAPI) => {

    console.log("🔥 Calling updateMovie thunk with:", formData);
    try {
      const res = await api.post(
        "/QuanLyPhim/CapNhatPhimUpload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        }
      );
      return res.data;
    } catch (err) {
      console.error("❌ updateMovie error", err.response?.data || err.message);
      return thunkAPI.rejectWithValue(err.response?.data || "Lỗi không xác định");
    }
  }
);

const initialState = {
    loading: false,
    error: null,
    success: false
  }

const updateMovieSlice = createSlice({
  name: "updateMovie",
  initialState,
  reducers: {
    resetUpdateMovieState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(updateMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateMovie.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateMovie.rejected, (state, action) => {
        state.loading = false;
        state.success = false;
        state.error = action.payload.content;
      });
  },
});

export const { resetUpdateMovieState } = updateMovieSlice.actions;
export default updateMovieSlice.reducer;
