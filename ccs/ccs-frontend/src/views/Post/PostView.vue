<script setup>
import { usePostsStore } from '@/stores/Posts';
import { storeToRefs } from 'pinia';
import { onMounted, ref, computed } from 'vue';
import { RouterLink } from 'vue-router';
import { useAuthStore } from '@/stores/Auth';

const postsStore = usePostsStore();
const authStore = useAuthStore();

const { isLoading, message } = storeToRefs(postsStore); 
const posts = ref([]);

const isAuthenticated = computed(() => authStore.checkAuth());

onMounted(async () => {
  posts.value = await postsStore.getPosts();
});
</script>

<template>
  <main class="flex-grow">
    <h1 class="title">Posts</h1>
    <div class="text-red-500 tooltip" v-if="message">{{ message }}</div>

    <div v-if="isLoading && isAuthenticated">
      <p>Loading posts...</p>
      <div class="spinner">
        <svg
          class="animate-spin h-5 w-5 mr-2"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            class="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    </div>

    <div v-if="postsStore.posts && postsStore.posts.length > 0">
      <div v-for="p in postsStore.posts" :key="p.id">
        <h2>{{ p.name }}</h2>
        <RouterLink class="text-blue-500 font-bold underline" :to="{ name: 'show', params: { id: p.id }}">
          Read more
        </RouterLink>
      </div>
    </div>
    <div v-else-if="!isLoading || !isAuthenticated">
      <h1>No posts</h1>
    </div>
  </main>
</template>
