import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../services/api";

export const addMovie = createAsyncThunk(
  "movie/addMovie",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post(
        "/QuanLyPhim/ThemPhimUploadHinh",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          },
        }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || "Lỗi không xác định");
    }
  }
);

const initialState = {
    loading: false,
    error: null,
    success: false
  }

const addMovieSlice = createSlice({
  name: "addMovie",
  initialState,
  reducers: {
    resetAddMovieState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addMovie.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(addMovie.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(addMovie.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetAddMovieState } = addMovieSlice.actions;
export default addMovieSlice.reducer;
