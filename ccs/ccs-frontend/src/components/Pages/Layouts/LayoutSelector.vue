<template>
    <div v-if="show" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-lg p-6 w-full max-w-md  justify-center max-h-[500px] overflow-y-auto shadow-lg">
        <h3 class="text-lg font-bold mb-4">Choose a Layout</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div 
            v-for="layout in layouts" 
            :key="layout.id" 
            @click="selectLayout(layout.id)"
            :class="[
              'p-4 border rounded-lg cursor-pointer transition-all duration-200 flex flex-col items-center',
              selectedLayout === layout.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:bg-gray-100'
            ]"
          >
            <!-- Visual Representation -->
            <div class="mb-2">
              <div v-if="layout.id === 'single'" class="w-16 h-12 bg-gray-300 rounded"></div>
              <div v-else-if="layout.id === 'gallary'" class="flex gap-2">
                <div class="w-10 h-12 bg-gray-300 rounded"></div>
                <div class="w-4 h-12 bg-gray-300 rounded"></div>
              </div>
              <div v-else-if="layout.id === 'default'" class="flex flex-col gap-1">
                <div class="w-16 h-6 bg-gray-300 rounded"></div>
                <div class="w-16 h-5 bg-gray-300 rounded"></div>
              </div>
              <div v-else-if="layout.id === 'board'" class="flex flex-col gap-1 p-1">
                <div class="w-full h-4 bg-gray-300 rounded flex items-center justify-center">
                  <div class="w-8 h-2 bg-gray-400 rounded"></div>
                </div>
                <div class="w-full h-3 bg-gray-200 rounded flex items-center justify-center">
                  <div class="w-8 h-1 bg-gray-400 rounded"></div>
                </div>
                <div class="w-full flex items-center gap-1 mt-1">
                  <div class="w-4 h-4 rounded-full bg-gray-400"></div>
                  <div class="flex-1 h-2 bg-gray-300 rounded"></div>
                </div>
                <div class="w-full flex items-center gap-1 mt-1 flex-row-reverse">
                  <div class="w-4 h-4 rounded-full bg-gray-400"></div>
                  <div class="flex-1 h-2 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
            <!-- Text Label -->
            <span class="text-sm font-medium">{{ layout.name }}</span>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-2">
          <button 
            @click="closeDialog"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import layouts from '@/stores/layout';

const props = defineProps({
    modelValue: Boolean,
    currentLayout: String,
})

const emit = defineEmits(['update:modelValue', 'update:layout'])

const show = ref(props.modelValue)
const selectedLayout = ref(props.currentLayout)

watch(() => props.modelValue, (newVal) => {
    show.value = newVal
})

const selectLayout = (layoutId) => {
    selectedLayout.value = layoutId
    emit('update:layout', layoutId);
    closeDialog()
}

const closeDialog = () => {
    show.value = false
    emit('update:modelValue', false)
}
</script>