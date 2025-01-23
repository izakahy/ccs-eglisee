<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const videoContainer = ref(null);
const isVideoVisible = ref(false);
let observer = null;
let player = null;

// YouTube IFrame API setup
const loadYoutubeAPI = () => {
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }
};

const createPlayer = () => {
  if (window.YT && window.YT.Player) {
    player = new window.YT.Player(videoContainer.value.querySelector('iframe'), {
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }
};

const onPlayerReady = (event) => {
  event.target.playVideo();
};

const onPlayerStateChange = (event) => {
  // Handle player state changes if needed
};

onMounted(() => {
  loadYoutubeAPI();
  
  observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isVideoVisible.value = true;
        observer.unobserve(videoContainer.value);
      }
    });
  }, {
    rootMargin: '200px',
    threshold: 0.1
  });

  if (videoContainer.value) {
    observer.observe(videoContainer.value);
  }
});

onUnmounted(() => {
  // Cleanup YouTube player
  if (player && typeof player.destroy === 'function') {
    player.destroy();
  }
  
  // Cleanup observer
  if (observer) {
    observer.disconnect();
  }
  
  // Force remove iframe
  const iframe = videoContainer.value.querySelector('iframe');
  if (iframe) {
    iframe.src = '';
    iframe.remove();
  }
});
</script>

<template>
  <div ref="videoContainer" class="bg-black flex flex-col justify-center items-center relative pb-11">
    <h3 class="text-white text-center font-normal text-4xl mb-4">LATEST SERMONS</h3>
    <iframe 
      v-if="isVideoVisible"
      class="w-full max-w-7xl h-[500px]"
      :src="`https://www.youtube-nocookie.com/embed/YA2Lxfw4SSw?autoplay=1&mute=1&loop=1&modestbranding=1&rel=0&enablejsapi=1&playlist=YA2Lxfw4SSw`"
      frameborder="0"
      allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
      loading="lazy"
      allowfullscreen
      sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-presentation"
      @load="createPlayer"
    >
    </iframe>
  </div>
</template>