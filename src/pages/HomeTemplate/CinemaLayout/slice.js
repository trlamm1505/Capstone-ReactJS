import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../services/api";

const initialState = {
    loading: false,
    error: null,
    showtimeInfo: null,
    seats: [],
    selectedSeats: [],
    bookingInfo: {
        movieTitle: '',
        showDate: '',
        showTime: '',
        cinemaComplex: '',
        cinemaRoom: '',
        totalPrice: 0,
        discount: 0
    },
    timer: {
        minutes: 5,
        seconds: 0,
        isActive: false
    },
    seatTypes: {
        normal: { price: 75000, color: 'gray' },
        vip: { price: 90000, color: 'orange' },
        selected: { price: 75000, color: 'green' },
        booked: { price: 0, color: 'red' },
        selecting: { price: 75000, color: 'blue' }
    }
};

// Generate seats from API data
const generateSeatsFromAPI = (apiSeats) => {
    if (!apiSeats || !Array.isArray(apiSeats)) return [];

    // Create a more realistic cinema layout with 160 seats (16 seats per row)
    // Divide into 10 rows (A-J) with 16 seats each
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const seatsPerRow = 16;
    const totalSeats = 160;

    const organizedSeats = [];

    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
        const row = rows[rowIndex];
        for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
            const seatIndex = rowIndex * seatsPerRow + (seatNum - 1);

            // Use API data if available, otherwise create default seat
            const apiSeat = apiSeats[seatIndex] || {};

            // Determine seat type and status from API data
            let seatType = 'normal';
            let isBooked = false;
            let isSelecting = false;

            // Check if seat exists in API data
            if (apiSeat.maGhe) {
                // Use actual API data
                seatType = apiSeat.loaiGhe === 'Vip' ? 'vip' : 'normal';
                isBooked = apiSeat.daDat || false;
                isSelecting = false; // This would come from real-time data
            } else {
                // Demo data for seats not in API
                const isCenterRow = ['C', 'D', 'E', 'F', 'G', 'H'].includes(row);
                const isCenterSeat = seatNum >= 3 && seatNum <= 14;

                if (isCenterRow && isCenterSeat) {
                    seatType = 'vip';
                }
            }

            // Always apply demo booked and selecting seats regardless of API data
            // Demo: Some seats are booked (realistic positions)
            if ((row === 'D' && (seatNum === 3 || seatNum === 4 || seatNum === 5)) ||
                (row === 'J' && seatNum === 15)) {
                isBooked = true;
            }

            // Demo: Some seats are being selected by others
            if ((row === 'I' && seatNum === 12) || (row === 'I' && seatNum === 13)) {
                isSelecting = true;
            }

            organizedSeats.push({
                id: apiSeat.maGhe || `seat_${row}${seatNum}`,
                seatNumber: apiSeat.tenGhe || `${row}${seatNum}`,
                row: row,
                column: seatNum,
                type: seatType,
                price: seatType === 'vip' ? 90000 : (apiSeat.giaVe || 75000),
                isSelected: false,
                isBooked: isBooked,
                isSelecting: isSelecting,
                stt: apiSeat.stt || `${row}${seatNum}`
            });
        }
    }

    return organizedSeats;
};

export const fetchShowtimeInfo = createAsyncThunk(
    "cinemaLayout/fetchShowtimeInfo",
    async (showtimeId, { rejectWithValue }) => {
        try {
            const response = await api.get(`/QuanLyDatVe/LayDanhSachPhongVe?MaLichChieu=${showtimeId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to fetch showtime info");
        }
    }
);

export const bookTickets = createAsyncThunk(
    "cinemaLayout/bookTickets",
    async (bookingData, { rejectWithValue }) => {
        try {
            const response = await api.post('/QuanLyDatVe/DatVe', bookingData);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || "Failed to book tickets");
        }
    }
);

const cinemaLayoutSlice = createSlice({
    name: "cinemaLayout",
    initialState,
    reducers: {
        selectSeat: (state, action) => {
            const { seatId } = action.payload;
            const seat = state.seats.find(s => s.id === seatId);

            if (seat && !seat.isBooked && !seat.isSelecting) {
                if (seat.isSelected) {
                    // Deselect seat
                    seat.isSelected = false;
                    state.selectedSeats = state.selectedSeats.filter(s => s.id !== seatId);
                } else {
                    // Select seat
                    seat.isSelected = true;
                    state.selectedSeats.push({
                        id: seat.id,
                        seatNumber: `${seat.row}${seat.column}`,
                        row: seat.row,
                        column: seat.column,
                        price: seat.price,
                        type: seat.type
                    });
                }

                // Update total price
                state.bookingInfo.totalPrice = state.selectedSeats.reduce((total, seat) => total + seat.price, 0);
            }
        },

        startTimer: (state) => {
            state.timer.isActive = true;
            state.timer.minutes = 5;
            state.timer.seconds = 0;
        },

        updateTimer: (state) => {
            if (state.timer.isActive) {
                if (state.timer.seconds > 0) {
                    state.timer.seconds--;
                } else if (state.timer.minutes > 0) {
                    state.timer.minutes--;
                    state.timer.seconds = 59;
                } else {
                    state.timer.isActive = false;
                    // Auto clear selections when timer expires
                    state.selectedSeats = [];
                    state.seats.forEach(seat => {
                        seat.isSelected = false;
                    });
                    state.bookingInfo.totalPrice = 0;
                }
            }
        },

        setShowtimeInfo: (state, action) => {
            state.showtimeInfo = action.payload;
            if (action.payload.thongTinPhim) {
                const movieInfo = action.payload.thongTinPhim;
                state.bookingInfo = {
                    ...state.bookingInfo,
                    movieTitle: movieInfo.tenPhim || '',
                    showDate: movieInfo.ngayChieu || '',
                    showTime: movieInfo.gioChieu || '',
                    cinemaComplex: movieInfo.tenCumRap || '',
                    cinemaRoom: movieInfo.tenRap || ''
                };
            }
        },

        clearSelections: (state) => {
            state.selectedSeats = [];
            state.seats.forEach(seat => {
                seat.isSelected = false;
            });
            state.bookingInfo.totalPrice = 0;
        },

        resetState: (state) => {
            return initialState;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchShowtimeInfo.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchShowtimeInfo.fulfilled, (state, action) => {
                state.loading = false;
                state.showtimeInfo = action.payload;
                state.seats = generateSeatsFromAPI(action.payload.content?.danhSachGhe);
                state.error = null;

                // Update booking info from API response
                if (action.payload.content?.thongTinPhim) {
                    const movieInfo = action.payload.content.thongTinPhim;
                    const cinemaInfo = action.payload.content;

                    state.bookingInfo = {
                        ...state.bookingInfo,
                        movieTitle: movieInfo.tenPhim || '',
                        showDate: movieInfo.ngayChieu || '',
                        showTime: movieInfo.gioChieu || '',
                        cinemaComplex: movieInfo.tenCumRap || '',
                        cinemaRoom: movieInfo.tenRap || '',
                        // Save additional cinema info for booking
                        maRap: cinemaInfo.maRap,
                        tenRap: cinemaInfo.tenRap,
                        maHeThongRap: cinemaInfo.maHeThongRap,
                        tenHeThongRap: cinemaInfo.tenHeThongRap,
                        maCumRap: cinemaInfo.maCumRap,
                        tenCumRap: cinemaInfo.tenCumRap
                    };
                }
            })
            .addCase(fetchShowtimeInfo.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(bookTickets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(bookTickets.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                // Save complete booking information to localStorage for Profile display
                const bookingData = action.payload;
                if (bookingData) {
                    // Extract seat and cinema info from the array
                    const firstTicket = Array.isArray(bookingData) ? bookingData[0] : bookingData;

                    // Get current booking info from state
                    const currentBookingInfo = state.bookingInfo;

                    const bookingInfo = {
                        maVe: bookingData.maVe,
                        ngayDat: bookingData.ngayDat,
                        tenPhim: bookingData.tenPhim,
                        hinhAnh: bookingData.hinhAnh,
                        giaVe: bookingData.giaVe,
                        thoiLuongPhim: bookingData.thoiLuongPhim,
                        // Extract complete cinema and seat information
                        maRap: firstTicket?.maRap || currentBookingInfo.maRap,
                        tenRap: firstTicket?.tenRap || currentBookingInfo.tenRap,
                        maGhe: firstTicket?.maGhe,
                        tenGhe: firstTicket?.tenGhe,
                        maHeThongRap: firstTicket?.maHeThongRap || currentBookingInfo.maHeThongRap,
                        tenHeThongRap: firstTicket?.tenHeThongRap || currentBookingInfo.tenHeThongRap,
                        maCumRap: firstTicket?.maCumRap || currentBookingInfo.maCumRap,
                        tenCumRap: firstTicket?.tenCumRap || currentBookingInfo.tenCumRap
                    };

                    console.log('Saving complete booking info:', bookingInfo);

                    // Save to localStorage for Profile to access
                    const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
                    existingBookings.push(bookingInfo);
                    localStorage.setItem('userBookings', JSON.stringify(existingBookings));
                }

                // Clear selections after successful booking
                state.selectedSeats = [];
                state.seats.forEach(seat => {
                    seat.isSelected = false;
                });
                state.bookingInfo.totalPrice = 0;
            })
            .addCase(bookTickets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    selectSeat,
    startTimer,
    updateTimer,
    setShowtimeInfo,
    clearSelections,
    resetState
} = cinemaLayoutSlice.actions;

export default cinemaLayoutSlice.reducer;
