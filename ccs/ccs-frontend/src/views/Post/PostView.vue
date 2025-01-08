<script setup>
import { usePostsStore } from '@/stores/Posts';
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';

const { getPosts } = usePostsStore();
const posts = ref([]);
const { message } = storeToRefs(usePostsStore());

onMounted(async () => (posts.value = await getPosts()));
</script>

<template>
  <main class="flex-grow">
    <h1 class="title">Posts</h1>
    <div class="text-red-500 tooltip" v-if="message">{{ message.message }}</div>

    <div v-if="posts.length > 0">
      <div v-for="p in posts" :key="p.id">
          <h2>{{ p.name }}</h2>
          <a class="text-blue-500 font-bold underline" href="">
            <RouterLink :to="{ name: 'show', params: { id: p.id }}">
                Read more
            </RouterLink>
            
          </a>
      </div>
    </div>
    <div v-else>
      <h1>No posts</h1>
    </div>
    
  </main>
</template>
