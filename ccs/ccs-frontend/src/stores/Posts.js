import { defineStore } from "pinia"
import { api } from "./Auth";
import router  from "@/router";

export const usePostsStore = defineStore('postsStore', {
    state: () => {
        return {
            errors: {},
            message: null,
            isLoading: false,
            posts: [],
        }
    },
    actions: {
        // Get all posts
        async getPosts() {
            try {
                this.isLoading = true;
                const res = await api.get('/api/posts');
                
                this.posts = res.data;
            } catch (error) {
                this.errors = error.response?.data || { message: "Failed to fetch posts" };
            } finally {
                this.isLoading = false;
            }
        },
        // Gett a posts
        async getPost(post) {
           try {
             const res = await fetch(`/api/posts/${post}`);
            const data = await res.json();

            console.log(data);
            return data.post;
           } catch (error) {
            
           }
        },
        // Create a post
        async createPost(fromData) {
            
            const res = await fetch('/api/posts', {
                method :'post',
                headers: {
                    // auth
                },
                body: JSON.stringify(fromData),
            })

            const data = await res.json();

            if (data.errors) {
                this.errors = data.errors
            } else {
                // redirect user back home
                this.router.push({name: 'posts'})
            }
        },
        // delete post
        async deletPost(post) {
            // auth check
            const res = await fetch(`/api/posts/${post}`, {
                method: 'delete',
                headers: {

                },
            });

            const data = await res.json();
            
            if (res.ok) {
                this.router.push({ name: 'posts'});
                this.message = data.message;
            }
            
            console.log(data)
        },
        async updatePost(post, formData) {
            const res = await fetch(`/api/posts/${post.id}`, {
                method: 'put',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            
            if (data.errors) {
                this.errors = data.errors;
            } else {
                this.router.push({ name: 'posts'});
                this.message = data.message;
            }
        }
    }
});