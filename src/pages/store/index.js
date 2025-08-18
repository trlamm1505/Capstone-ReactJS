import { configureStore } from "@reduxjs/toolkit";
import listMovieReducer from "../HomeTemplate/HomePage/slice";
import listMoviePageReducer from "../HomeTemplate/ListMovie/slice";
import cinemaReducer from "../HomeTemplate/Cinema/slice";
import movieDetailReducer from "../HomeTemplate/MovieDetailPage/slice";
import loginReducer from "../HomeTemplate/LoginPage/slice";
import registerReducer from "../HomeTemplate/RegisterPage/slice";
import profileReducer from "../HomeTemplate/Profile/slice";
import cinemaLayoutReducer from "../HomeTemplate/CinemaLayout/slice";
import moviesAdminReducer from "../AdminTemplate/Movies/slice";
import movieDetailAdminReducer from "../AdminTemplate/MovieDetailPage/slice";
import showtimeReducer from "../AdminTemplate/AddTheater/slice";
import addMovieReducer from "../AdminTemplate/AddMovie/slice";
import updateMovieReducer from "../AdminTemplate/EditMovie/slice";
import usersAdminReducer from "../AdminTemplate/Users/slice";

export const store = configureStore({
    reducer: {
        listMovie: listMovieReducer,
        listMoviePage: listMoviePageReducer,
        cinema: cinemaReducer,
        movieDetail: movieDetailReducer,
        login: loginReducer,
        register: registerReducer,
        profile: profileReducer,
        cinemaLayout: cinemaLayoutReducer,
        moviesAdmin: moviesAdminReducer,
        movieDetailAdmin: movieDetailAdminReducer,
        showtimeAdmin: showtimeReducer,
        addMovieAdmin: addMovieReducer,
        updateMovieAdmin: updateMovieReducer,
        usersAdmin: usersAdminReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

// Make store available globally for sessionManager
if (typeof window !== 'undefined') {
    window.__REDUX_STORE__ = store;
}

export default store;
