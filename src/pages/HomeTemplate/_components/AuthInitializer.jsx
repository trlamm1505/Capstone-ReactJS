import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus, logout } from '../LoginPage/slice';
import sessionManager from '../../../utils/sessionManager';

const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.login);

    useEffect(() => {
        console.log('AuthInitializer: Checking authentication status on app load');

        // Check if user is authenticated
        const checkAuth = async () => {
            await dispatch(checkAuthStatus());
        };

        checkAuth();
    }, [dispatch]);

    useEffect(() => {
        // If user is authenticated, start session management
        if (isAuthenticated) {
            console.log('AuthInitializer: User is authenticated, starting session management');

            // Check if session is still valid
            if (sessionManager.isSessionValid()) {
                console.log('AuthInitializer: Session is valid, initializing session management');
                sessionManager.initSession();
            } else {
                console.log('AuthInitializer: Session has expired, logging out');
                dispatch(logout());
            }
        } else {
            console.log('AuthInitializer: User is not authenticated, stopping session management');
            sessionManager.stopSession();
        }
    }, [isAuthenticated, dispatch]);

    return <>{children}</>;
};

export default AuthInitializer; 