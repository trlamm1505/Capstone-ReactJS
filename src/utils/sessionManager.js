// Session Manager Utility

class SessionManager {
    constructor() {
        this.sessionTimeout = 5 * 60 * 1000; // 5 minutes in milliseconds
        this.activityTimer = null;
        this.sessionExpiryTimer = null;
        this.isSessionActive = false;
        this.store = null; // Will be set by setStore method
    }

    // Set Redux store for dispatching actions
    setStore(store) {
        this.store = store;
        console.log('SessionManager: Store set successfully');
    }

    // Initialize session
    initSession() {
        console.log('SessionManager: Initializing session');
        this.isSessionActive = true;
        this.updateLastActivity();
        this.startActivityTracking();
        this.startSessionTimer();
    }

    // Update last activity timestamp
    updateLastActivity() {
        try {
            localStorage.setItem('lastActivity', Date.now().toString());
            console.log('SessionManager: Updated last activity timestamp');
        } catch (error) {
            console.error('SessionManager: Error updating last activity:', error);
        }
    }

    // Start tracking user activity
    startActivityTracking() {
        // Clear existing timer
        if (this.activityTimer) {
            clearInterval(this.activityTimer);
        }

        // Set up activity tracking
        this.activityTimer = setInterval(() => {
            this.updateLastActivity();
        }, 60000); // Update every minute

        // Add event listeners for user activity
        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];

        const handleActivity = () => {
            this.updateLastActivity();
        };

        activityEvents.forEach(event => {
            document.addEventListener(event, handleActivity, true);
        });

        console.log('SessionManager: Activity tracking started');
    }

    // Start session timer for auto logout
    startSessionTimer() {
        // Clear existing timer
        if (this.sessionExpiryTimer) {
            clearTimeout(this.sessionExpiryTimer);
        }

        // Set session expiry timer
        this.sessionExpiryTimer = setTimeout(() => {
            console.log('SessionManager: Session expired, auto logout');
            this.autoLogout();
        }, this.sessionTimeout);

        console.log('SessionManager: Session timer started with', this.sessionTimeout / 1000, 'seconds timeout');
    }

    // Auto logout when session expires
    autoLogout() {
        if (!this.isSessionActive) return;

        console.log('SessionManager: Auto logout due to session expiry');
        this.logout();

        // Dispatch logout action to Redux if store is available
        if (this.store) {
            console.log('SessionManager: Dispatching logout action to Redux');
            try {
                this.store.dispatch({
                    type: 'login/logout',
                    payload: undefined
                });
                console.log('SessionManager: Logout action dispatched successfully');
            } catch (error) {
                console.error('SessionManager: Error dispatching logout action:', error);
            }
        } else {
            console.log('SessionManager: No Redux store available for logout dispatch');
        }
    }

    // Check if session is still valid
    isSessionValid() {
        try {
            const lastActivity = localStorage.getItem('lastActivity');
            if (!lastActivity) {
                return false;
            }

            const lastActivityTime = parseInt(lastActivity);
            const currentTime = Date.now();
            const timeDiff = currentTime - lastActivityTime;

            console.log('SessionManager: Session check - Time diff:', timeDiff, 'ms');
            console.log('SessionManager: Session check - Timeout:', this.sessionTimeout, 'ms');

            return timeDiff < this.sessionTimeout;
        } catch (error) {
            console.error('SessionManager: Error checking session validity:', error);
            return false;
        }
    }

    // Get remaining session time in minutes
    getRemainingTime() {
        try {
            const lastActivity = localStorage.getItem('lastActivity');
            if (!lastActivity) {
                return 0;
            }

            const lastActivityTime = parseInt(lastActivity);
            const currentTime = Date.now();
            const timeDiff = currentTime - lastActivityTime;
            const remainingTime = this.sessionTimeout - timeDiff;

            return Math.max(0, Math.floor(remainingTime / 60000)); // Return minutes
        } catch (error) {
            console.error('SessionManager: Error getting remaining time:', error);
            return 0;
        }
    }

    // Logout user
    logout() {
        console.log('SessionManager: Logging out due to session timeout');
        this.isSessionActive = false;

        // Clear timers
        if (this.activityTimer) {
            clearInterval(this.activityTimer);
            this.activityTimer = null;
        }
        if (this.sessionExpiryTimer) {
            clearTimeout(this.sessionExpiryTimer);
            this.sessionExpiryTimer = null;
        }

        // Clear localStorage
        try {
            localStorage.removeItem('auth_user');
            localStorage.removeItem('auth_isAuthenticated');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('lastActivity');
        } catch (error) {
            console.error('SessionManager: Error clearing localStorage:', error);
        }

        console.log('SessionManager: Session expired, data cleared');
    }

    // Stop session management
    stopSession() {
        console.log('SessionManager: Stopping session management');
        this.isSessionActive = false;

        if (this.activityTimer) {
            clearInterval(this.activityTimer);
            this.activityTimer = null;
        }
        if (this.sessionExpiryTimer) {
            clearTimeout(this.sessionExpiryTimer);
            this.sessionExpiryTimer = null;
        }
    }

    // Set session timeout (in minutes)
    setSessionTimeout(minutes) {
        this.sessionTimeout = minutes * 60 * 1000;
        console.log('SessionManager: Session timeout set to', minutes, 'minutes');
    }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager; 