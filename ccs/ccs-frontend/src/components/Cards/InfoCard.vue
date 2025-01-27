<template>
    <div class="max-w-3xl mx-auto text-center">
      <h2 class="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl lg:text-7xl">
        <span class="block">{{ title }}</span>
      </h2>
      <p class="mt-4 text-xl font-semibold text-gray-600">
        {{ address }}
      </p>
      <div class="mt-10">
        <button
          class="btn-secondary"
        >
          Learn More
        </button>
      </div>
    </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'SERVICE TIMES'
  },
  address: {
    type: String,
    default: '58 FESTIVAL STREET, SHEDIAC, NB E4P IS4'
  }
});
</script> 