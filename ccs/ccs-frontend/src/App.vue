<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
      <nav>
        <RouterLink :to="{ name: 'home' }" class="">Home</RouterLink> 
        <RouterLink :to="{ name: 'posts' }" class="">Posts</RouterLink>
        <RouterLink :to="{ name: 'create' }" class="">Create</RouterLink>
      </nav>
  </header>

  <RouterView />
</template>
