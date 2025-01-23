import { defineStore } from "pinia";
import axios from "axios";
import  router from "@/router";

const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    },
    withCredentials: true,
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
        
                    // Redirect to home
                    router.push({ name: 'home' });
                }
        
                // Handle errors
                if (urlParams.has('error')) {
                    this.errors = { auth: urlParams.get('error') };
                }
            } catch (error) {
                this.errors = { auth: 'Failed to process login response' };
                console.error('Callback error:', error);
            }
        },
        // Start google login
        async googleLogin() {
            window.location.href = 'http://localhost:8000/auth/google/redirect';
        },
       
       
        async logout() {
            try {
                this.isLoading = true;
                await api.get('/sanctum/csrf-cookie');
        
                // Add CSRF token to headers manually
                const xsrfToken = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('XSRF-TOKEN='))
                    ?.split('=')[1];
        
                // Make logout request with both headers
                await api.post('/api/auth/google/logout', {}, {
                    headers: {
                        'X-XSRF-TOKEN': decodeURIComponent(xsrfToken),
                        'Authorization': `Bearer ${this.token}`
                    }
                });
                
                // Clear local state
                this.user = null;
                this.token = null;
                this.isAuthenticated = false;
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete api.defaults.headers.common['Authorization'];
        
                this.message = "Successfully logged out!";
                router.push({ name: 'home' });
        
            } catch (error) {
                console.error("Logout error:", error.response?.data || error);
                this.errors = { 
                    auth: error.response?.data?.message || 'Failed to logout' 
                };
            } finally {
                this.isLoading = false;
            }
        },

        // async logout() {
        //     try {
        //         const res = await fetch('http://localhost:8000/api/auth/google/logout', { 
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //                 'Authorization': `Bearer ${this.token}`,
        //                 'Accept': 'application/json',
        //             },
        //         });
    
        //         const data = await res.json(); 
    
        //         if (res.ok) {
        //             // Clear user data
        //             this.user = null;
        //             this.token = null;
        //             this.isAuthenticated = false;
        //             localStorage.removeItem('token');
        //             localStorage.removeItem('user');
        //             this.message = "Successfully logged out!";
        //             router.push({ name: 'home' });
        //         } else {
        //             this.errors = { auth: data.message || 'Failed to logout' };
        //         }
        //     } catch (error) {
        //         this.errors = { auth: 'Failed to logout' };
        //     }
        // },

        // Helper to check if user is authenticated
        checkAuth() {
            return this.isAuthenticated && this.token;
        }
    }
});

export { api };