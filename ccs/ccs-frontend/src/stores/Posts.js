import { defineStore } from "pinia"
import router from "@/router";

export const usePostsStore = defineStore('postsStore', {
    state: () => {
        return {
            errors: {},
            message: null
        }
    },
    actions: {
        // Get all posts
        async getPosts() {
            const res = await fetch('/api/posts');
            const data = await res.json();

            console.log(data);
            return data;
        },
        // Gett a posts
        async getPost(post) {
            const res = await fetch(`/api/posts/${post}`);
            const data = await res.json();

            console.log(data);
            return data.post;
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

// we dont get redirected to to google callback need to fix that 