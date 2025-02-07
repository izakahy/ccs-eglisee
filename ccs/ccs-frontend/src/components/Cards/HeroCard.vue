<template>
  <div>
    <div :class="[bgColor, 'p-6 min-h-[320px] max-h-[420px] rounded-md flex flex-col']">
      
      <div class="flex-grow overflow-hidden flex flex-col">
        
        <h1 class="font-bold text-3xl mb-4 relative flex items-center justify-between">
          <span class="truncate">{{ cardData.title }}</span>
          <button
            v-if="isAuthenticated"
            @click="openEdit('title')"
            class="flex-shrink-0 ml-2 text-white bg-orange-500 p-1 hover:bg-orange-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label="Edit title"
            title="Edit title"
          >
            <PencilSquareIcon class="h-6 w-6" />
          </button>
        </h1>

        <div class="relative flex-grow overflow-hidden">
          <div class="prose prose-preview overflow-y-auto">
            <div v-html="shortenBody.text" class="h-full"></div>
          </div>
          <div
          v-if="shortenBody.truncated" 
          class="flex justify-center mt-4">
            <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
              Learn more
            </button>
          </div>
          <button
            v-if="isAuthenticated"
            @click="openEdit('body')"
            class="absolute bottom-2 right-2 text-white bg-orange-500 p-1 hover:bg-orange-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            aria-label="Edit body"
            title="Edit body"
          >
            <PencilSquareIcon class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
   
    <EditorDialog
      v-model="showDialog"
      :edit-type="editType"
      :title-value="cardData.title"
      :body-value="cardData.body"
      @update:title="updateTitle"
      @update:body="updateBody"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { PencilSquareIcon } from '@heroicons/vue/24/outline'
import { useAuthStore } from '@/stores/Auth'
import EditorDialog from '../Helper/EditorDialog.vue'
import { useContentStore } from '@/stores/Content'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String,
    default: 'bg-white'
  },
})

const authStore = useAuthStore()
const contentStore = useContentStore()

const isAuthenticated = computed(() => authStore.checkAuth())
const cardData = computed(() => contentStore.cards[props.id])

const showDialog = ref(false)
const editType = ref('')
const MAX_LENGTH = 340

const shortenBody = computed(() => {
  if (!cardData.value || !cardData.value.body) return '' 
  const body = cardData.value.body
  const isTruncated = body.length > MAX_LENGTH 

  return {
    text: body.length > MAX_LENGTH ? body.substring(0, MAX_LENGTH) + '...' : body,
    truncated: isTruncated
  }
})

const openEdit = (type) => {
  editType.value = type
  showDialog.value = true
}

const updateTitle = (newTitle) => {
  contentStore.updateTitle(props.id, newTitle)
}

const updateBody = (newBody) => {
  contentStore.updateBody(props.id, newBody)
}

watch(showDialog, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      editType.value = ''
    }, 100)
  }
})
</script>

<style scoped>
.prose-preview {
  /* Improved scroll handling */
  scrollbar-width: thin;
  scrollbar-color: #4a5568 transparent;
}

/* Custom scrollbar for Webkit browsers */
.prose-preview::-webkit-scrollbar {
  width: 6px;
}

.prose-preview::-webkit-scrollbar-track {
  background: transparent;
}

.prose-preview::-webkit-scrollbar-thumb {
  background-color: #4a5568;
  border-radius: 3px;
}

</style>