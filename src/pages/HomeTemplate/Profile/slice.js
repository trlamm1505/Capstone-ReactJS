import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

const initialState = {
    loading: false,
    userInfo: null,
    bookingHistory: [],
    error: null,
    updateLoading: false,
    updateError: null,
    updateSuccess: false
};

// Fetch user profile information using API
export const fetchUserProfile = createAsyncThunk(
    "profile/fetchUserProfile",
    async (_, { rejectWithValue }) => {
        try {
            console.log('Fetching user profile from API...');

            const accessToken = localStorage.getItem('accessToken');
            console.log('Access token from localStorage:', accessToken);

            if (!accessToken) {
                throw new Error('No access token found');
            }

            console.log('Calling ThongTinTaiKhoan API...');
            const response = await api.post("/QuanLyNguoiDung/ThongTinTaiKhoan", {}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                    // TokenCybersoft is automatically added by interceptor
                }
            });

            console.log('ThongTinTaiKhoan API response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            const errorMessage = error.response?.data?.content || error.response?.data?.message || error.message || "Failed to fetch user profile";
            return rejectWithValue(errorMessage);
        }
    }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
    "profile/updateUserProfile",
    async (userData, { rejectWithValue }) => {
        try {
            console.log('=== UPDATE PROFILE START ===');
            console.log('User data to update:', userData);

            const accessToken = localStorage.getItem('accessToken');
            console.log('Access token from localStorage:', accessToken);
            console.log('Access token length:', accessToken?.length);
            console.log('Access token starts with:', accessToken?.substring(0, 20));

            if (!accessToken) {
                throw new Error('No access token found');
            }

            // Prepare the request data according to API documentation
            const requestData = {
                taiKhoan: userData.taiKhoan,
                matKhau: userData.matKhau,
                email: userData.email,
                soDt: userData.soDt,
                maNhom: userData.maNhom,
                maLoaiNguoiDung: userData.maLoaiNguoiDung,
                hoTen: userData.hoTen
            };

            console.log('Request data to send:', requestData);
            console.log('=== MAKING API CALL ===');

            const response = await api.put("/QuanLyNguoiDung/CapNhatThongTinNguoiDung", requestData, {
                headers: {
                    'Content-Type': 'application/json-patch+json'
                    // Authorization and TokenCybersoft are automatically added by interceptor
                }
            });

            console.log('=== API CALL SUCCESS ===');
            console.log('Update profile response:', response.data);
            return response.data;
        } catch (error) {
            console.error('=== UPDATE PROFILE ERROR ===');
            console.error('Error object:', error);
            console.error('Error response:', error.response);
            console.error('Error status:', error.response?.status);
            console.error('Error status text:', error.response?.statusText);
            console.error('Error data:', error.response?.data);
            console.error('Error headers:', error.response?.headers);
            console.error('Error config:', error.config);

            // Extract error message from different possible locations
            let errorMessage = "Cập nhật thông tin thất bại";

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

            console.log('Update profile - Final error message:', errorMessage);
            return rejectWithValue(errorMessage);
        }
    }
);

// Fetch booking history - use data from user profile API
export const fetchBookingHistory = createAsyncThunk(
    "profile/fetchBookingHistory",
    async (_, { rejectWithValue }) => {
        try {
            console.log('Fetching booking history from ThongTinTaiKhoan API...');

            const accessToken = localStorage.getItem('accessToken');

            if (!accessToken) {
                throw new Error('No access token found');
            }

            // Call the same API to get user info including booking history
            const response = await api.post("/QuanLyNguoiDung/ThongTinTaiKhoan", {}, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                    // TokenCybersoft is automatically added by interceptor
                }
            });

            // Extract booking history from response
            const bookingHistory = response.data.content?.thongTinDatVe || [];
            console.log('Booking history from API:', bookingHistory);

            return { content: bookingHistory };
        } catch (error) {
            console.error('Error fetching booking history:', error);
            // If fails, return empty array
            console.log('Failed to get booking history, returning empty array');
            return { content: [] };
        }
    }
);

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearUpdateError: (state) => {
            state.updateError = null;
        },
        clearUpdateSuccess: (state) => {
            state.updateSuccess = false;
        },
        updateUserInfo: (state, action) => {
            state.userInfo = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch user profile cases
            .addCase(fetchUserProfile.pending, (state) => {
                console.log('Profile slice - fetchUserProfile.pending');
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserProfile.fulfilled, (state, action) => {
                console.log('Profile slice - fetchUserProfile.fulfilled:', action.payload);
                state.loading = false;
                state.userInfo = action.payload.content || action.payload;
                state.error = null;
            })
            .addCase(fetchUserProfile.rejected, (state, action) => {
                console.log('Profile slice - fetchUserProfile.rejected:', action.payload);
                state.loading = false;
                state.error = action.payload;
            })
            // Update user profile cases
            .addCase(updateUserProfile.pending, (state) => {
                console.log('Profile slice - updateUserProfile.pending');
                state.updateLoading = true;
                state.updateError = null;
                state.updateSuccess = false;
            })
            .addCase(updateUserProfile.fulfilled, (state, action) => {
                console.log('Profile slice - updateUserProfile.fulfilled:', action.payload);
                state.updateLoading = false;
                state.updateSuccess = true;
                state.updateError = null;

                // Update userInfo with the data that was sent (since API might not return updated data)
                // We'll update it in the component instead
            })
            .addCase(updateUserProfile.rejected, (state, action) => {
                console.log('Profile slice - updateUserProfile.rejected:', action.payload);
                state.updateLoading = false;
                state.updateError = action.payload;
                state.updateSuccess = false;
            })
            // Fetch booking history cases
            .addCase(fetchBookingHistory.pending, (state) => {
                console.log('Profile slice - fetchBookingHistory.pending');
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookingHistory.fulfilled, (state, action) => {
                console.log('Profile slice - fetchBookingHistory.fulfilled:', action.payload);
                state.loading = false;
                state.bookingHistory = action.payload.content || action.payload || [];
                state.error = null;
            })
            .addCase(fetchBookingHistory.rejected, (state, action) => {
                console.log('Profile slice - fetchBookingHistory.rejected:', action.payload);
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, clearUpdateError, clearUpdateSuccess, updateUserInfo } = profileSlice.actions;
export default profileSlice.reducer;
