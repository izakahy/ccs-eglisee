<template>
    <ul class="hidden md:flex space-x-8 text-2xl">
      <DropdownMenuItem
        label="ABOUT"
        href="#about"
        :is-open="modelValue.about"
        :items="aboutItems"
        @update:is-open="(value) => $emit('update:modelValue', { ...modelValue, about: value })"
      />
      <li><RouterLink :to="{ name: 'posts' }">CONNECT</RouterLink></li>
      <li><RouterLink :to="{ name: 'create' }">EVENT</RouterLink></li>
      <li><a target="_blank" href="https://www.youtube.com/@CommunauteCompassionShediac">WATCH</a></li>
      <li><RouterLink :to="{ name: 'create' }">FORWARD</RouterLink></li>
      <li><RouterLink :to="{ name: 'create' }">GIVE</RouterLink></li>
    </ul>
  </template>
  
  <script setup>
  import { RouterLink } from 'vue-router'
  import DropdownMenuItem from './DropdownMenuItem.vue';
  
  defineProps({
    modelValue: {
      type: Object,
      required: true
    },
    aboutItems: {
      type: Array,
      required: true
    }
  })
  
  defineEmits(['update:modelValue'])
  </script>