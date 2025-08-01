<template>
    <div 
      v-if="isAuthenticated && isEditing" 
      class="fixed bottom-10 right-24 z-50 flex flex-col gap-2 items-end"
    >
      <div 
        v-if="showOptions" 
        class="bg-white rounded-lg shadow-lg p-2 mb-2 flex flex-col gap-2 items-stretch animate-fade-in"
      >
        <button
          @click="$emit('delete')"
          class="flex items-center px-4 py-2 bg-white border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors"
        >
          <i class="fa-solid fa-trash-can mr-2"></i>
          Delete
        </button>
        <button
          @click="$emit('preview')"
          class="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
        >
          <i class="fa-solid fa-eye mr-2"></i>
          Preview
        </button>
      </div>
  
      <button
        @click="$emit('save')"
        class="flex items-center justify-center w-20 h-20 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        title="Save Changes"
      >
        <i class="fa-solid fa-floppy-disk text-3xl"></i>
      </button>
  
      <button 
        @click="showOptions = !showOptions"
        class="mt-2 flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        title="More Options"
      >
        <i class="fa-solid fa-ellipsis x1"></i>
      </button>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    isAuthenticated: {
      type: Boolean,
      required: true
    },
    isEditing: {
      type: Boolean,
      required: true
    }
  });
  
  const emit = defineEmits(['save', 'delete', 'preview']);
  
  const showOptions = ref(false);
  </script>
  
  <style scoped>
  .animate-fade-in {
    animation: fadeIn 0.2s ease-in-out;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  </style>