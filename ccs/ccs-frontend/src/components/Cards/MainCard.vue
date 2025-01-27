<template>
  <div class="mx-auto bg-gray-200 relative">
      <div class="absolute z-1 inset-0 flex justify-center items-center">
        <h1 class="hero-text text-shadow">{{ title }}</h1>
      </div>
      <img
        loading="lazy"
        class="w-full img-fluid h-48 sm:h-64 lg:h-[500px] object-cover"
        :src="image"
        alt="image-of-church"
        >
    </div>
</template>

<script setup>
  const props = defineProps({
    title: {
        type: String,
        default: 'Welcome'
    },
    image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1519491050282-cf00c82424b4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2h1cmNofGVufDB8fDB8fHww'
    }
  });

</script>