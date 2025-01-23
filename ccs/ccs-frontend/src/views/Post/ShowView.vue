<script setup>
import { usePostsStore } from '@/stores/Posts';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { RouterLink } from 'vue-router';

const route = useRoute();
const { getPost, deletPost } = usePostsStore();
const post = ref(null); 
onMounted(async () => (post.value = await getPost(route.params.id)));
console.log('Calling updatePost with:', post);
console.log('API URL:', `/api/posts/${post}`);
</script>

<template>
    <main>
        <h1 v-if="post">{{ post.name }}</h1>
        <div v-if="post">
        <div>
            <p class="text-gray-500 text-md">{{ post.desc }}</p>

            <div>
                <form @submit.prevent="deletPost(post.id)">
                    <button
                     class="text-red-500 font-bold px-2 py-1 border border-dashed-300">
                        Delete
                    </button>
                </form>
                <RouterLink
                :to="{ name: 'update', params: { id: post.id } }"
                class="text-green-500 font-bold px-2 py-1 border border-dashed-300"
                >
                Update
                </RouterLink>
            </div>
        </div>  
        </div>
        <div v-else>
        <h1>No posts</h1>
        </div>
    </main>
</template>