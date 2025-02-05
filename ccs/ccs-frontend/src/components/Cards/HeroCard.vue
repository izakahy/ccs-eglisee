<template>
  <div>
    <div :class="[bgColor, 'p-6 min-h-[320px] max-h-[420px] rounded-md flex flex-col']">
      <div class="flex-grow overflow-hidden flex flex-col">
        <h1 class="font-bold text-3xl mb-4 relative flex items-center justify-between">
          <span class="truncate">{{ cardData.title }}</span>
          <button
            v-if="isAuthenticated"
            @click="openEdit('title')"
            class="flex-shrink-0 ml-2 text-white hover:text-yellow-300 active:font-bold rounded-full p-1"
            aria-label="Edit title"
            title="Edit title"
          >
            <PencilSquareIcon class="h-6 w-6" />
          </button>
        </h1>
        <div class="relative flex-grow overflow-hidden">
          <div class="prose prose-preview overflow-y-auto">
            <div v-html="cardData.body"></div>
          </div>
          <button
            v-if="isAuthenticated"
            @click="openEdit('body')"
            class="absolute bottom-2 right-2 text-white hover:text-yellow-300 active:font-bold rounded-full p-1"
            aria-label="Edit body"
            title="Edit body"
          >
            <PencilSquareIcon class="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
    <div class="flex justify-center mt-4">
      <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
        Learn more
      </button>
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

const authStore = useAuthStore()
const contentStore = useContentStore()

const isAuthenticated = computed(() => authStore.checkAuth())
const cardData = computed(() => contentStore.cards[props.id])

const showDialog = ref(false)
const editType = ref('')

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
  max-height: calc(100% - 2rem); /* Adjust based on your needs */
}
</style>