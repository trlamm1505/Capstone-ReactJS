import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus, logout } from '../LoginPage/slice';
import sessionManager from '../../../utils/sessionManager';
import { store } from '../../store';

const AuthInitializer = ({ children }) => {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((state) => state.login);

    useEffect(() => {
        console.log('AuthInitializer: Checking authentication status on app load');

        // Set Redux store for sessionManager
        sessionManager.setStore(store);

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
                console.log('AuthInitializer: Session has expired, clearing data but staying on current page');
                // Don't logout, just clear the data
                sessionManager.stopSession();
                // Clear localStorage without redirecting
                localStorage.removeItem('auth_user');
                localStorage.removeItem('auth_isAuthenticated');
                localStorage.removeItem('accessToken');
                localStorage.removeItem('lastActivity');
            }
        } else {
            console.log('AuthInitializer: User is not authenticated, stopping session management');
            sessionManager.stopSession();
        }
    }, [isAuthenticated, dispatch]);

    return <>{children}</>;
};

export default AuthInitializer; 