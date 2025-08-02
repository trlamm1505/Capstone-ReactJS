import React, { createContext, useContext, useState } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error('useNavigation must be used within a NavigationProvider');
    }
    return context;
};

export const NavigationProvider = ({ children }) => {
    const [allowedRoutes, setAllowedRoutes] = useState(new Set());

    const allowNavigation = (route) => {
        setAllowedRoutes(prev => new Set([...prev, route]));
    };

    const clearAllowedRoutes = () => {
        setAllowedRoutes(new Set());
    };

    const isRouteAllowed = (route) => {
        return allowedRoutes.has(route);
    };

    return (
        <NavigationContext.Provider value={{
            allowNavigation,
            clearAllowedRoutes,
            isRouteAllowed
        }}>
            {children}
        </NavigationContext.Provider>
    );
}; 