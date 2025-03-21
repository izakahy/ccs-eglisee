<template>
  <div ref="videoContainer" class="bg-black flex flex-col justify-center items-center relative pb-11">
    <div class="mb-0 mt-10">
      <h3 class="text-white text-center font-bold text-4xl mb-2">{{ title }}</h3>
    </div>
    
    <!-- Video Wrapper -->
    <div class="relative w-full max-w-7xl">
      <div
        v-if="isLoading && !showURLInput"
        role="status" 
        class="w-full h-[500px] bg-gray-800 animate-pulse flex flex-col items-center justify-center"
      >
        <div class="w-16 h-16 mb-4">
            <svg class="animate-spin text-gray-500 w-full h-full" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
        <div class="sr-only">Loading video...</div>
      </div>

      <div
        v-else-if="ytURL === '' && !showURLInput"
        role="status" 
        class="w-full h-[500px] bg-gray-950 animate-pulse flex flex-col items-center justify-center"
      >
        <div class="">
            <p class="text-white text-md">Video not found.</p>
        </div>
        <div class="sr-only">Loading video...</div>
      </div>

      <div v-else :class="{ 'blur-sm': showURLInput }">
        <iframe 
          v-if="isVideoVisible"
          :key="currentYTURL"
          :src="currentYTURL"
          class="w-full h-[500px]"
          frameborder="0"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          allowfullscreen
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-presentation allow-top-navigation-by-user-activation"
          @load="createPlayer"
        ></iframe>

        <div 
          v-if="showURLInput"
          class="absolute inset-0 z-10"
          @click.prevent
          @dblclick.prevent
          @contextmenu.prevent
        ></div>
      </div>

      <div 
        v-if="showURLInput && isAuthenticated" 
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-6 space-y-4"
      >
      <div class=" bg-gray-800/80 rounded-lg p-6 space-y-4 shadow-xl backdrop-blur-sm">
          <div
            v-if="showURLInput" 
            class="flex justify-end"
          >
            <button @click="closeInput()">
              <XMarkIcon class="w-6 h-6 text-white hover:scale-125 transition-transform duration-200 ease-in-out" />
            </button>
          </div>
          <input
            v-model="inputURL"
            type="text"
            placeholder="Enter YouTube URL"
            class="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            :disabled="isLoading"
          />
          <button
            @click="updateYouTubeURL"
            class="w-full py-2 px-4 bg-red-600 hover:bg-red-800 text-white rounded transition-colors duration-200"
            :disabled="isLoading"
          >
            <span v-if="!isLoading">Update Video</span>
            <div v-else class="flex items-center justify-center">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="ml-2">Updating...</span>
            </div>
          </button>
        </div>
      </div>
    </div>

    <!-- Edit Button -->
    <div class="absolute top-4 right-4 z-10">
      <button
        v-if="isAuthenticated && !showURLInput"
        @click="openInput"
        class="p-2 bg-gray-300/50 hover:bg-gray-500/50 rounded-full backdrop-blur-sm hover:scale-110 transition-all duration-200 ease-in-out"
        aria-label="Change youtube video"
        title="Change video"
      >
        <PencilSquareIcon class="w-8 h-8 text-white" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import { PencilSquareIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { useYTPlayerStore } from '@/stores/YoutubePlayer';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const ytPlayerStore = useYTPlayerStore()
const { ytURL, isLoading } = storeToRefs(ytPlayerStore)

const videoContainer = ref(null);
const isVideoVisible = ref(false);
const inputURL = ref(''); 
const showURLInput = ref(false); 
const isPaused = ref(false);
let observer = null;
let player = null;

const currentYTURL = computed(() => ytURL.value)
const isAuthenticated = computed(() => authStore.checkAuth());

const props = defineProps({
  title: {
    type: String,
    default: 'LATEST SERMONS',
  },
});

const extractVideoID = (url) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

const constructEmbedURL = (videoID) => {
  const baseURL = 'https://www.youtube-nocookie.com/embed/';
  const settings = 'mute=1&loop=1&modestbranding=1&rel=0&enablejsapi=1';
  const playlistParam = videoID ? `&playlist=${videoID}` : ''; 
  return `${baseURL}${videoID}?${settings}${playlistParam}`;
};

const updateYouTubeURL = async () => {
    const videoID = extractVideoID(inputURL.value);
    if (videoID) {
        await ytPlayerStore.updateURL(1, inputURL.value);  // Pass ID (1 in this case) and URL
        if (ytPlayerStore.errors.length === 0) {
            showURLInput.value = false;
            if (player && typeof player.cueVideoById === 'function') {
                player.cueVideoById(videoID);
            }
        } else {
            alert(ytPlayerStore.errors.message);
        }
    } else {
        alert('Invalid YouTube URL. Please provide a valid YouTube video link.');
        showURLInput.value = true;
    }
};

const openInput = () => {
  inputURL.value = '';
  showURLInput.value = true;
  if (showURLInput.value) {
    pauseVideo();
  }  else {
    playVideo();
  }
};

const closeInput = () => {
  inputURL.value = ''
  showURLInput.value = false
  if (showURLInput.value) {
    pauseVideo();
  }  else {
    playVideo();
  }
}

const loadYoutubeAPI = () => {
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
};

const pauseVideo = () => {
  if (player && typeof player.pauseVideo === 'function') {
    player.pauseVideo();
    isPaused.value = true
  }
};

const playVideo = () => {
  if (player && typeof player.playVideo === 'function') {
    player.playVideo();
    isPaused.value = false;
  }
};

const createPlayer = () => {
  if (!videoContainer.value) return; 

  const iframe = videoContainer.value.querySelector('iframe');
  
  if (iframe && window.YT && window.YT.Player) {
    // Destroy existing player first
    if (player && typeof player.destroy === 'function') {
      player.destroy();
      player = null
    }
    
    player = new window.YT.Player(iframe, {
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }
};

const onPlayerReady = (event) => {
  // event.target.playVideo();
};

const onPlayerStateChange = (event) => {
  if (event.data === YT.PlayerState.PLAYING && showURLInput.value) {
    pauseVideo();
  }
};

onMounted(async () => {
  loadYoutubeAPI();
  await ytPlayerStore.getYTURL(1)
  
  if (videoContainer.value) {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isVideoVisible.value = true;
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '200px', threshold: 0.1 });
    
    observer.observe(videoContainer.value);
  }
});

onUnmounted(() => {
  if (observer) {
    observer.disconnect();
  }
  
  if (player && typeof player.destroy === 'function') {
    player.destroy();
    player = null;
  }
  
  // Add delay for iframe cleanup
  setTimeout(() => {
    const iframe = videoContainer.value?.querySelector('iframe');
    if (iframe) {
      iframe.src = '';
      iframe.remove();
    }
  }, 100);
});
</script>