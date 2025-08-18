import Home from "../pages/HomeTemplate/HomePage/Home"
import HomeTemplate from "../pages/HomeTemplate/HomeTemplate"
import Cinema from "../pages/HomeTemplate/Cinema/Cinema"
import AdminTemplate from "../pages/AdminTemplate/AdminTemplate"
import Login from "../pages/HomeTemplate/LoginPage/Login"
import Register from "../pages/HomeTemplate/RegisterPage/Register"
import MovieDetail from "../pages/HomeTemplate/MovieDetailPage/MovieDetail"
import Profile from "../pages/HomeTemplate/Profile/Profile"
import ListMovie from "../pages/HomeTemplate/ListMovie/ListMovie"
import CinemaLayout from "../pages/HomeTemplate/CinemaLayout/CinemaLayout"
import BookingSuccess from "../pages/HomeTemplate/BookingSuccess/BookingSuccess"
import { Route } from "react-router-dom";
import MovieDetailAdmin from "../pages/AdminTemplate/MovieDetailPage/MovieDetail"
import AddMovie from "../pages/AdminTemplate/AddMovie/AddMovie"
import AddTheaterForm from "../pages/AdminTemplate/AddTheater/AddTheater"
import Movies from "../pages/AdminTemplate/Movies/Movies"
import EditMovie from "../pages/AdminTemplate/EditMovie/EditMovie"
import Users from "../pages/AdminTemplate/Users/Users"
import UpdateUsers from "../pages/AdminTemplate/UpdateUser/UpdateUsers"

export const routes = [
    {
        path: "",
        element: <HomeTemplate />,
        nested: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "cinema",
                element: <Cinema />
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "listmovie",
                element: <ListMovie />
            },
            {
                path: "chitietphim/:maPhim",
                element: <MovieDetail />
            },
            {
                path: "chitietphongve/:maLichChieu",
                element: <CinemaLayout />
            },
            {
                path: "booking-success",
                element: <BookingSuccess />
            }
        ]
    },
    {
        path: "admin",
        element: <AdminTemplate />,
        nested: [
            {
                path: "movies/list",
                element: <Movies />
            },
            {
                path: "movies/showtimes/:maPhim",
                element: <MovieDetailAdmin />
            },
            {
                path: "movies/theater/update-theater",
                element: <AddTheaterForm />
            },
            {
                path: "movies/add-new",
                element: <AddMovie />
            },
            {
                path: "movies/edit/:maPhim",
                element: <EditMovie />
            },
            {
                path: "users/list",
                element: <Users />
            },
            {
                path: "users/edit/:id",
                element: <UpdateUsers />
            }
        ]
    },
    {
        path: "login",
        element: <Login />
    },
    {
        path: "register",
        element: <Register />
    }
];

export const generateRoutes = (routes) => {
    return routes.map((route) => {
        if (route.nested && route.nested.length > 0) {
            return (
                <Route path={route.path} element={route.element} key={route.path}>
                    {route.nested.map((nestedRoute) => (
                        <Route
                            path={nestedRoute.path}
                            element={nestedRoute.element}
                            key={nestedRoute.path}
                        />
                    ))}
                </Route>
            );
        } else {
            return <Route path={route.path} element={route.element} key={route.path} />
        }
    });
}