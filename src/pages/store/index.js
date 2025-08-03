import { configureStore } from "@reduxjs/toolkit";
import listMovieReducer from "../HomeTemplate/HomePage/slice";
import listMoviePageReducer from "../HomeTemplate/ListMovie/slice";
import cinemaReducer from "../HomeTemplate/Cinema/slice";
import movieDetailReducer from "../HomeTemplate/MovieDetailPage/slice";
import loginReducer from "../HomeTemplate/LoginPage/slice";
import registerReducer from "../HomeTemplate/RegisterPage/slice";
import profileReducer from "../HomeTemplate/Profile/slice";
import cinemaLayoutReducer from "../HomeTemplate/CinemaLayout/slice";

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
