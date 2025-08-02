import Home from "../pages/HomeTemplate/HomePage/Home"
import HomeTemplate from "../pages/HomeTemplate/HomeTemplate"
import Cinema from "../pages/HomeTemplate/Cinema/Cinema"
import AdminTemplate from "../pages/AdminTemplate/AdminTemplate"
import Login from "../pages/HomeTemplate/LoginPage/Login"
import Register from "../pages/HomeTemplate/RegisterPage/Register"
import MovieDetail from "../pages/HomeTemplate/MovieDetailPage/MovieDetail"
import Profile from "../pages/HomeTemplate/Profile/Profile"
import ListMovie from "../pages/HomeTemplate/ListMovie/ListMovie"
import { Route } from "react-router-dom";

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
                path: "home",
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
            }
        ]
    },
    {
        path: "admin",
        element: <AdminTemplate />,
        nested: [
            // Add admin routes here if needed
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