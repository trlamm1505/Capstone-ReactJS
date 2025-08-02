import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";
import sessionManager from "../../../utils/sessionManager";

// Helper functions for localStorage
const saveAuthToStorage = (user, isAuthenticated, accessToken) => {
    try {
        console.log('Saving auth to localStorage:', { user, isAuthenticated, accessToken });
        localStorage.setItem('auth_user', JSON.stringify(user));
        localStorage.setItem('auth_isAuthenticated', JSON.stringify(isAuthenticated));
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
        console.log('Auth saved successfully to localStorage');
    } catch (error) {
        console.error('Error saving auth to localStorage:', error);
    }
};

const loadAuthFromStorage = () => {
    try {
        const user = localStorage.getItem('auth_user');
        const isAuthenticated = localStorage.getItem('auth_isAuthenticated');
        const accessToken = localStorage.getItem('accessToken');

        console.log('Raw localStorage data:', { user, isAuthenticated, accessToken });

        const result = {
            user: user ? JSON.parse(user) : null,
            isAuthenticated: isAuthenticated ? JSON.parse(isAuthenticated) : false,
            accessToken: accessToken || null
        };
        console.log('Parsed auth data from localStorage:', result);
        return result;
    } catch (error) {
        console.error('Error loading auth from localStorage:', error);
        return { user: null, isAuthenticated: false, accessToken: null };
    }
};

const clearAuthFromStorage = () => {
    try {
        console.log('Clearing auth from localStorage');
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_isAuthenticated');
        localStorage.removeItem('accessToken');
        console.log('Auth cleared from localStorage');
    } catch (error) {
        console.error('Error clearing auth from localStorage:', error);
    }
};

// Update last activity timestamp
const updateLastActivity = () => {
    try {
        localStorage.setItem('lastActivity', Date.now().toString());
    } catch (error) {
        console.error('Error updating last activity:', error);
    }
};

// Load initial state from localStorage
const storedAuth = loadAuthFromStorage();

const initialState = {
    loading: false,
    user: null, // Changed from storedAuth.user to null
    error: null,
    registerLoading: false,
    registerError: null,
    isAuthenticated: false, // Changed from storedAuth.isAuthenticated to false
};

console.log('Login slice initial state:', initialState);
console.log('Stored auth data:', {
    user: storedAuth.user,
    isAuthenticated: storedAuth.isAuthenticated
});

export const loginUser = createAsyncThunk(
    "login/loginUser",
    async (credentials, { rejectWithValue }) => {
        try {
            console.log('Login API call with credentials:', credentials);
            const response = await api.post("/QuanLyNguoiDung/DangNhap", credentials);
            console.log('Login API response:', response.data);
            console.log('Login API response content:', response.data.content);
            console.log('Login API response accessToken:', response.data.accessToken);
            return response.data;
        } catch (error) {
            console.error('Login API error:', error);
            const errorMessage = error.response?.data?.content || error.response?.data || error.message || "Đăng nhập thất bại";
            return rejectWithValue(errorMessage);
        }
    }
);

export const registerUser = createAsyncThunk(
    "login/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await api.post("/QuanLyNguoiDung/DangKy", userData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Đăng ký thất bại");
        }
    }
);

// Check if user is still authenticated on app load
export const checkAuthStatus = createAsyncThunk(
    "login/checkAuthStatus",
    async (_, { getState, rejectWithValue }) => {
        try {
            console.log('Checking auth status...');

            // Check localStorage first
            const storedUser = localStorage.getItem('auth_user');
            const storedAuth = localStorage.getItem('auth_isAuthenticated');
            const storedAccessToken = localStorage.getItem('accessToken');

            console.log('Stored data from localStorage:', {
                storedUser,
                storedAuth,
                storedAccessToken,
                hasUser: !!storedUser,
                hasAuth: !!storedAuth,
                hasToken: !!storedAccessToken
            });

            if (storedUser && storedAuth && JSON.parse(storedAuth)) {
                console.log('Found stored auth data, checking session validity');

                // Check if session is still valid
                if (sessionManager.isSessionValid()) {
                    console.log('Session is valid, restoring from localStorage');
                    const userData = JSON.parse(storedUser);
                    console.log('Parsed user data:', userData);
                    return { content: userData };
                } else {
                    console.log('Session has expired, clearing auth data');
                    // Clear expired session data
                    sessionManager.stopSession();
                    return null;
                }
            } else {
                console.log('No stored auth data found');
                return null;
            }
        } catch (error) {
            console.error('Auth check failed:', error);
            return null;
        }
    }
);

const loginSlice = createSlice({
    name: "login",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearRegisterError: (state) => {
            state.registerError = null;
        },
        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
            clearAuthFromStorage();
            // Stop session management
            sessionManager.stopSession();
        },
    },
    extraReducers: (builder) => {
        builder
            // Login cases
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log('Login fulfilled - Full response:', action.payload);
                state.loading = false;

                // Clear all old authentication data first
                clearAuthFromStorage();
                console.log('Cleared old authentication data');

                // API trả về dữ liệu trong content field
                state.user = action.payload.content;
                state.isAuthenticated = true;
                state.error = null;

                // Check if accessToken exists in response - try different possible locations
                let accessToken = null;
                if (action.payload.accessToken) {
                    accessToken = action.payload.accessToken;
                    console.log('Found accessToken in action.payload.accessToken');
                } else if (action.payload.content && action.payload.content.accessToken) {
                    accessToken = action.payload.content.accessToken;
                    console.log('Found accessToken in action.payload.content.accessToken');
                } else {
                    console.log('No accessToken found in response');
                }

                console.log('Final access token to save:', accessToken);

                // Save to localStorage
                saveAuthToStorage(action.payload.content, true, accessToken);

                // Also save accessToken separately for easy access
                if (accessToken) {
                    localStorage.setItem('accessToken', accessToken);
                    console.log('Access token saved to localStorage:', accessToken);
                    console.log('Access token length:', accessToken.length);
                    console.log('Access token starts with:', accessToken.substring(0, 20));
                } else {
                    console.log('No access token to save');
                }

                // Initialize session management
                console.log('Initializing session management after successful login');
                sessionManager.initSession();
            })
            .addCase(loginUser.rejected, (state, action) => {
                console.log('Login rejected:', action.payload);
                state.loading = false;
                state.error = action.payload || "Đăng nhập thất bại";
                state.isAuthenticated = false;
                // Clear from localStorage on failed login
                clearAuthFromStorage();
            })
            // Register cases
            .addCase(registerUser.pending, (state) => {
                state.registerLoading = true;
                state.registerError = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.registerLoading = false;
                state.registerError = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.registerLoading = false;
                state.registerError = action.payload;
            })
            // Check auth status cases
            .addCase(checkAuthStatus.pending, (state) => {
                console.log('Check auth status pending');
                state.loading = true;
            })
            .addCase(checkAuthStatus.fulfilled, (state, action) => {
                console.log('Check auth status fulfilled:', action.payload);
                state.loading = false;
                if (action.payload && action.payload.content) {
                    state.user = action.payload.content;
                    state.isAuthenticated = true;
                    console.log('Auth restored successfully from localStorage');
                } else {
                    console.log('No valid auth data found, clearing state');
                    state.user = null;
                    state.isAuthenticated = false;
                }
            })
            .addCase(checkAuthStatus.rejected, (state, action) => {
                console.log('Check auth status rejected:', action.payload);
                state.loading = false;
                // Don't clear state on rejection, just keep what we have
                console.log('Auth check rejected, keeping current state');
            });
    },
});

export const { clearError, clearRegisterError, logout } = loginSlice.actions;
export default loginSlice.reducer; 