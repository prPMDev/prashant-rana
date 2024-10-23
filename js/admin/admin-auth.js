// js/admin/admin-auth.js
import ADMIN_CONFIG from './config.js';

class AdminAuth {
    static #hashPassword(password) {
        // Simple hash function for example purposes
        // In production, use a proper crypto library
        return password.split('').reduce((hash, char) => {
            return ((hash << 5) - hash) + char.charCodeAt(0);
        }, 0).toString(16);
    }

    static isAuthenticated() {
        const token = localStorage.getItem('admin_token');
        if (!token) return false;

        try {
            const { timestamp, hash } = JSON.parse(token);
            const now = Date.now();

            // Check if session has expired
            if (now - timestamp > ADMIN_CONFIG.sessionDuration * 1000) {
                this.logout();
                return false;
            }

            return true;
        } catch (e) {
            return false;
        }
    }

    static login(password) {
        const hashedInput = this.#hashPassword(password);

        if (hashedInput === ADMIN_CONFIG.password) {
            const token = {
                timestamp: Date.now(),
                hash: hashedInput
            };
            localStorage.setItem('admin_token', JSON.stringify(token));
            return true;
        }
        return false;
    }

    static logout() {
        localStorage.removeItem('admin_token');
        window.location.href = '/admin.html';
    }
}

export default AdminAuth;