<template>
     <!-- User Info and Logout -->
     <div class="flex items-center space-x-4">
              <span
              v-if="isLoggedIn"
              class="text-sm md:text-base text-orange-300">
                 Welcome: <span class="text-white font-bold">{{ username }}</span>
              </span> 
              <a 
                  type="button" 
                  v-if="isLoggedIn" 
                  @click="onLogout"
                  class="text-lg cursor-pointer hover:font-extrabold hover:text-red-500 text-white"
                  :disabled="loading"
                >
                  <span v-if="!loading">Logout</span>
                  <span v-else class="flex items-center">
                    <svg class="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Logging out...
                  </span>
                </a>
          </div>
</template>

<script setup>
const props = defineProps({
  isLoggedIn: {
    type: Boolean,
    required: true
  },
  username:  String,
  pfp: String,
  onLogout: {
    type: Function,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
});
</script>