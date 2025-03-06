<template>
  <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div :class="[
      'bg-white rounded-xl shadow-sm overflow-hidden flex flex-col transition-all duration-300',
      dialogSize === 'fullscreen' ? 'w-full h-full' : 
      dialogSize === 'minimized' ? 'w-64 h-12 bottom-4 right-4 fixed' : 
      'w-full max-w-4xl max-h-[80vh]'
    ]">
      <div class="px-4 py-3 bg-gray-50 border-b flex items-center justify-between">
        <h3 class="text-sm font-bold text-gray-700">
          <span><i class="fa-solid fa-eye mr-2"></i></span>
          Preview
        </h3>
        <div class="flex items-center gap-2">
          <button 
            v-if="dialogSize !== 'minimized'"
            @click="toggleSize('minimized')"
            class="text-gray-500 hover:text-gray-700 p-1 rounded"
            title="Minimize"
          >
            <i class="fa-solid fa-window-minimize w-4 h-4"></i>
          </button>
          
          <button 
            @click="toggleSize(dialogSize === 'fullscreen' ? 'normal' : 'fullscreen')"
            class="text-gray-500 hover:text-gray-700 p-1 rounded"
            :title="dialogSize === 'fullscreen' ? 'Exit Fullscreen' : 'Fullscreen'"
          >
            <i :class="dialogSize === 'fullscreen' ? 'fa-solid fa-compress' : 'fa-solid fa-expand'"></i>
          </button>
          
          <button 
            @click="closeDialog"
            class="text-gray-500 hover:text-gray-700 p-1 rounded"
            title="Close"
          >
            <i class="fa-solid fa-times w-5 h-5"></i>
          </button>
        </div>
      </div>
      
      <div v-if="dialogSize !== 'minimized'" class="p-6 break-words overflow-y-auto flex-1">
        <component 
          :is="layoutComponents[layout]" 
          :contents="contents" 
          :key="layout"
          class="h-full"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import SingleColumnLayout from './SingleColumnLayout.vue';
import TwoColumnLayout from './TwoColumnLayout.vue';
import DefaultLayout from './DefaultLayout.vue';

const layoutComponents = {
  single: SingleColumnLayout,
  twoColumn: TwoColumnLayout,
  default: DefaultLayout,
}

const props = defineProps({
  modelValue: Boolean,
  layout: {
    type: String,
    required: true,
  },
  contents: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['update:modelValue']);
const show = ref(props.modelValue);
const dialogSize = ref('normal'); // 'normal', 'fullscreen', or 'minimized'

// Sync dialog visibility with modelValue
watch(() => props.modelValue, (newVal) => {
  show.value = newVal;
  if (!newVal) dialogSize.value = 'normal'; // Reset size when closing
});

const toggleSize = (size) => {
  dialogSize.value = size;
};

const closeDialog = () => {
  show.value = false;
  dialogSize.value = 'normal';
  emit('update:modelValue', false);
};
</script>

<style scoped>
/* Add smooth transitions */
.transition-all {
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 300ms;
}

/* Minimized state styling */
.w-64.h-12 {
  min-width: 256px;
  height: 48px;
  cursor: pointer;
}
</style>