// Session Manager Utility
class SessionManager {
    constructor() {
        this.sessionTimeout = 10 * 60 * 1000; // 10 minutes in milliseconds
        this.warningTimeout = 2 * 60 * 1000; // 2 minutes warning before session expires
        this.activityTimer = null;
        this.warningTimer = null;
        this.isSessionActive = false;
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

    // Start session timer
    startSessionTimer() {
        // Clear existing warning timer
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
        }

        // Set warning timer
        this.warningTimer = setTimeout(() => {
            this.showSessionWarning();
        }, this.sessionTimeout - this.warningTimeout);

        console.log('SessionManager: Session timer started');
    }

    // Show session warning
    showSessionWarning() {
        if (!this.isSessionActive) return;

        const warningMessage = 'Phiên làm việc của bạn sẽ hết hạn trong 2 phút. Bạn có muốn tiếp tục?';

        if (confirm(warningMessage)) {
            // User wants to continue, extend session
            this.extendSession();
        } else {
            // User doesn't want to continue, logout
            this.logout();
        }
    }

    // Extend session
    extendSession() {
        console.log('SessionManager: Extending session');
        this.updateLastActivity();
        this.startSessionTimer();
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
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
            this.warningTimer = null;
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

        // Redirect to login page
        window.location.href = '/login';
    }

    // Stop session management
    stopSession() {
        console.log('SessionManager: Stopping session management');
        this.isSessionActive = false;

        if (this.activityTimer) {
            clearInterval(this.activityTimer);
            this.activityTimer = null;
        }
        if (this.warningTimer) {
            clearTimeout(this.warningTimer);
            this.warningTimer = null;
        }
    }

    // Set session timeout (in minutes)
    setSessionTimeout(minutes) {
        this.sessionTimeout = minutes * 60 * 1000;
        this.warningTimeout = Math.min(5 * 60 * 1000, this.sessionTimeout / 6); // Warning at 1/6 of session time
        console.log('SessionManager: Session timeout set to', minutes, 'minutes');
    }
}

// Create singleton instance
const sessionManager = new SessionManager();

export default sessionManager; 