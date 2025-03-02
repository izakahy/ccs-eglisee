import { defineStore } from "pinia";
import axios from "axios";
import  router from "@/router";

const api = axios.create({
    baseURL: '',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: true,
});

let csrfPromise = null;

api.interceptors.request.use(async (config) => {
    // For API routes that need token auth
    if (config.url.startsWith('/api')) {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    }

    // For non-API mutation requests
    if (['put', 'post', 'delete', 'patch'].includes(config.method?.toLowerCase())) {
        try {
            // Get fresh CSRF token if needed
            if (!document.cookie.includes('XSRF-TOKEN')) {
                csrfPromise = csrfPromise || api.get('/sanctum/csrf-cookie');
                await csrfPromise;
                csrfPromise = null;
            }

            // Get and set CSRF token
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];

            if (token) {
                config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token);
            }
        } catch (error) {
            console.error('CSRF token fetch error:', error);
        }
    }

    return config;
});

export const useAuthStore = defineStore('authStore', {
    state: () => {
        return {
            user: null,
            token: null,
            errors: {},
            message: null,
            isAuthenticated: false,
            isLoading: false,
            isLoggedIn: false,
            alertMsg: null,
            alertType: 'error'
        }
    },
    actions: {
        init() {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');

            // If we fine the token and user save it
            if (token && user) {
                this.token = token;
                this.user = JSON.parse(user);
                this.isAuthenticated = true;
                
                // Default token header
                api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }
        },

        async handleCallBack() {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                
                if (urlParams.has('error')) {
                    const errMsg = urlParams.get('error');
                    this.showAlert(decodeURIComponent(errMsg), 'error');
                    
                    setTimeout(() => {
                        router.push({ name: 'home' });
                    }, 1300)
                    return;
                }

                const token = urlParams.get('token');
                const userEncoded = urlParams.get('user');
        
                if (token && userEncoded) {
                    // Decode and parse user data
                    const user = JSON.parse(decodeURIComponent(userEncoded));
                    
                    // Update state
                    this.token = token;
                    this.user = user;
                    this.isAuthenticated = true;
        
                    // Store in localStorage
                    localStorage.setItem('token', token);
                    localStorage.setItem('user', JSON.stringify(user));
        
                    // Set default axios header
                    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

                    this.showAlert('Successfully logged in!', 'success');
                    router.push({ name: 'home' });
                }
            } catch (error) {
                this.errors = { auth: 'Failed to process login response' };
                this.showAlert('Failed to process login response. Please try again.', 'error');

                setTimeout(() => {
                    router.push({ name: 'home' })
                }, 1300)
            }
        },
        // Start google login
        async googleLogin() {
            window.location.href = '/api/auth/google/redirect';
        },
       
        async logout() {
            try {
                this.isLoading = true;
                
                // Make logout request
                await api.post('/api/auth/google/logout', {}, {
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                    }
                });
              
                // Clear state
                this.user = null;
                this.token = null;
                this.isAuthenticated = false;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete api.defaults.headers.common['Authorization'];
                
                this.showAlert('Successfully logged out!', 'success');
                router.push({ name: 'home' });
            } catch (error) {
                console.error("Logout error:", error.response?.data || error);
                this.errors = { auth: error.response?.data?.message || 'Failed to logout' };
                this.showAlert('Failed to logout. Please try again.', 'error');
            } finally {
                this.isLoading = false;
            }
        },


        // Helper to check if user is authenticated
        checkAuth() {
            return this.isAuthenticated && Boolean(this.token);
        },

        showAlert(msg, type = 'error') {
            this.alertMsg = msg;
            this.alertType = type;

            setTimeout(() =>{
                this.alertMsg = null
                this.alertType = null
            }, 1300)
        }
    }
});

export { api };