<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useAuthStore } from '@/stores/Auth';
import { PencilSquareIcon, XMarkIcon } from '@heroicons/vue/24/outline';

const authStore = useAuthStore();

const videoContainer = ref(null);
const isVideoVisible = ref(false);
const ytURL = ref(''); 
const inputURL = ref(''); 
const showURLInput = ref(false); 
const isPaused = ref(false);
let observer = null;
let player = null;

const isAuthenticated = computed(() => authStore.checkAuth());

const props = defineProps({
  title: {
    type: String,
    default: 'LATEST SERMONS',
  },
  ytURL: {
    type: String,
    default: 'https://www.youtube-nocookie.com/embed/YA2Lxfw4SSw?mute=1&loop=1&modestbranding=1&rel=0&enablejsapi=1&playlist=YA2Lxfw4SSw',
  }
});


ytURL.value = props.ytURL;

watch(() => props.ytURL, (newURL) => {
  ytURL.value = newURL;
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

const updateYouTubeURL = () => {
  const videoID = extractVideoID(inputURL.value);
  if (videoID) {
    ytURL.value = constructEmbedURL(videoID);
    showURLInput.value = false
    // playVideo()
  } else {
    alert('Invalid YouTube URL. Please provide a valid YouTube video link.');
    showURLInput.value = true
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
  if (!videoContainer.value) return; // Add null check for container
  const iframe = videoContainer.value.querySelector('iframe');
  
  if (iframe && window.YT && window.YT.Player) {
    // Destroy existing player first
    if (player && typeof player.destroy === 'function') {
      player.destroy();
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

onMounted(() => {
  loadYoutubeAPI();
  
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

<template>
  <div ref="videoContainer" class="bg-black flex flex-col justify-center items-center relative pb-11">
    <div class="mb-0 mt-10">
      <h3 class="text-white text-center font-bold text-4xl mb-2">{{ title }}</h3>
    </div>
    
    <!-- Video Wrapper -->
    <div class="relative w-full max-w-7xl">
     
      <div :class="{ 'blur-sm': showURLInput }">
        <iframe 
          v-if="isVideoVisible"
          class="w-full h-[500px]"
          :src="ytURL"
          frameborder="0"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          loading="lazy"
          allowfullscreen
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-presentation"
          @load="createPlayer"
        ></iframe>

        <div 
          v-if="isPaused"
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
          class="flex justify-end">
            <button
              @click="closeInput()"
            >
              <XMarkIcon class="w-6 h-6 text-white hover:scale-125 transition-transform duration-200 ease-in-out" />
            </button>
          </div>
          <input
            v-model="inputURL"
            type="text"
            placeholder="Enter YouTube URL"
            class="w-full p-3 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            @click="updateYouTubeURL"
            class="w-full py-2 px-4 bg-red-600 hover:bg-red-800 text-white rounded transition-colors duration-200"
          >
            Update Video
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