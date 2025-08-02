import { configureStore } from "@reduxjs/toolkit";
import listMovieReducer from "../HomeTemplate/HomePage/slice";
import listMoviePageReducer from "../HomeTemplate/ListMovie/slice";
import cinemaReducer from "../HomeTemplate/Cinema/slice";
import movieDetailReducer from "../HomeTemplate/MovieDetailPage/slice";
import loginReducer from "../HomeTemplate/LoginPage/slice";
import registerReducer from "../HomeTemplate/RegisterPage/slice";
import profileReducer from "../HomeTemplate/Profile/slice";

export const store = configureStore({
    reducer: {
        listMovie: listMovieReducer,
        listMoviePage: listMoviePageReducer,
        cinema: cinemaReducer,
        movieDetail: movieDetailReducer,
        login: loginReducer,
        register: registerReducer,
        profile: profileReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
