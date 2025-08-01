<template>
  <div class="h-full">
    <div :class="[bgColor, 'p-6 h-[420px] rounded-md flex flex-col']">
      
      <div class="flex-grow overflow-hidden flex flex-col">
        
        <h1 class="font-bold text-3xl mb-4 relative flex items-center justify-between">
          <template v-if="isCardLoading">
            <div class="h-8 bg-gray-300 rounded-full w-3/4 animate-pulse"></div>
            <div class="h-8 w-8 bg-gray-300 rounded-lg animate-pulse"></div>
          </template>
          <template v-else>
            <span class="truncate">{{ cardData.title }}</span>
            <button
              v-if="isAuthenticated"
              @click="openEdit('title')"
              class="flex-shrink-0 ml-2 text-white bg-orange-500 p-1 hover:bg-orange-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Edit title"
              title="Edit title"
            >
              <PencilSquareIcon class="h-6 w-6" />
            </button>
          </template>
        </h1>

        <div class="relative flex-grow overflow-hidden">
          <div class="prose prose-preview">
            <template v-if="isCardLoading">
              <!-- Skeleton for body text -->
              <div class="space-y-2 my-10">
                <div class="h-4 bg-gray-300 rounded-full w-full animate-pulse"></div>
                <div class="h-4 bg-gray-300 rounded-full w-5/6 animate-pulse"></div>
                <div class="h-4 bg-gray-300 rounded-full w-full animate-pulse"></div>
                <div class="h-4 bg-gray-300 rounded-full w-full animate-pulse"></div>
                <div class="h-4 bg-gray-300 rounded-full w-5/6 animate-pulse"></div>
                <div class="h-4 bg-gray-300 rounded-full w-4/6 animate-pulse"></div>
              </div>
            </template>
            <div v-else v-html="shortenBody.text" class="h-full break-words"></div>
          </div>
          
          <div class="flex justify-center mt-4">
            <template v-if="isCardLoading">
              <!-- Skeleton for "Learn more" button -->
              <div class="h-10 w-28 bg-gray-300 rounded-lg animate-pulse"></div>
            </template>
            <a v-else-if="shortenBody.truncated" 
              class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">
              Learn more
            </a>
          </div>
          
          <template v-if="isCardLoading">
            <!-- Skeleton for edit button -->
            <div class="absolute bottom-2 right-2 h-8 w-8 bg-gray-300 rounded-lg animate-pulse"></div>
          </template>
          <button
            v-else-if="isAuthenticated"
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
      :is-loading="isCardLoading"
      @update:title="updateTitle"
      @update:body="updateBody"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
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
const isCardLoading = computed(() => contentStore.isCardLoading(props.id))

const storeState = computed(() => ({
  cards: contentStore.cards,
  allContent: contentStore.allContent,
  errors: contentStore.errors
}))

const cardData = computed(() => {
  const card = contentStore.cards[props.id]
  return card || { title: '', body: '' }
})

const showDialog = ref(false)
const editType = ref('')
const MAX_LENGTH = 340

const shortenBody = computed(() => {
  if (!cardData.value || !cardData.value.body) return { text: '', truncated: false } 
  const body = cardData.value.body
  const isTruncated = body.length > MAX_LENGTH 

  return {
    text: body.length > MAX_LENGTH ? body.substring(0, MAX_LENGTH) + '...' : body,
    truncated: isTruncated
  }
})

const openEdit = (type) => {
  if (!cardData.value?.title || !cardData.value?.body) return
  editType.value = type
  showDialog.value = true
}

const updateTitle = async (newTitle) => {
  try {
    await contentStore.updateTitle(props.id, newTitle)
    showDialog.value = false
  } catch (error) {
    console.error(error)
  }
}

const updateBody = async (newBody) => {
  try {
    await contentStore.updateBody(props.id, newBody)
    showDialog.value = false
  } catch (error) {
    console.error(error)
  }
}

watch(showDialog, (newVal) => {
  if (!newVal) {
    setTimeout(() => {
      editType.value = ''
    }, 100)
  }
})

onMounted(async () => {
  try {
    // Only get content on initial mount
    if (!Object.values(contentStore.cards).some(card => card.title !== 'Title')) {
      await contentStore.getContent()
    }
  } catch (error) {
    console.error('Error fetching content:', error)
  }
})
</script>