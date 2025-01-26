<script setup>
import HeroCard from '@/components/InfoCards/HeroCard.vue';
import YoutubePlayer from '@/components/YoutubePlayer.vue';


</script>

<template>
  <main>
    <!-- hero -->
    <div class="mx-auto bg-gray-200 relative">
      <div class="absolute z-1 inset-0 flex justify-center items-center">
        <h1 class="hero-text">Welcome</h1>
      </div>
      <img
        loading="lazy"
        class="w-full img-fluid h-48 sm:h-64 lg:h-[500px] object-cover"
        src="https://images.unsplash.com/photo-1519491050282-cf00c82424b4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2h1cmNofGVufDB8fDB8fHww"
        alt="image-of-church"
        >
    </div>

    <div class="p-5">
      <h2 class="text-center text-4xl lg:text-7xl lg:mt-3.5">SERVICE TIMES</h2>
      <p class="text-bold text-center P-2">58 FESTIVAL STREET, SHEDIAC, NB E4P IS4</p>
      
      <div class="flex justify-center p-5">
        <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Learn more</button>
      </div>
      
      <div class="mt-11 mb-11">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-11 gap-y-5 mx-auto max-w-6xl">
          <HeroCard bgColor="bg-red-800" title="Title 1"></HeroCard>
          <HeroCard bgColor="bg-blue-500" title="Title 2"></HeroCard>
          <HeroCard bgColor="bg-green-500" title="Title 3"></HeroCard>
        </div>
      </div>
    </div>

    <YoutubePlayer />

    <div>
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 mx-auto max-w-7xl mt-5 mb-5">
        <div class="flex flex-col justify-evenly">
          <h1 class="h-about-pastor" id="about">ABOUT PASTOR</h1>

          <div class="pl-0 p-2">
            <p class="text-center lg:text-start text-lg">
               Lorem ipsum dolor sit amet consectetur. Vitae vitae amet nunc orci sit pharetra adipiscing aenean.
               Non at aliquam cursus feugiat dapibus suspendisse leo risus tempor. Sem scelerisque urna sapien vel venenatis dolor elit ut id.
               Vulputate vel luctus iaculis pretium sem eget feugiat.
            </p>
          </div>
          <div class="text-center lg:text-start transition duration-500 ease-in-out">
            <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-lg px-5 py-4 me-2 w-5/12 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Learn more</button>
          </div>
        </div>

        <div class="relative w-full h-64 md:h-96 lg:h-[32rem]">
          <img 
            class="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            src="https://preview.redd.it/is-there-a-sniper-default-pfp-that-someone-made-v0-78az45pd9f6c1.jpg?width=396&format=pjpg&auto=webp&s=5be4618605b25e0546d72dff52a7b897c3d4e1d4" 
            alt="Profile image"
          >
        </div>

        <div class="relative bg-blue-50 p-8 sm:p-16 md:p-32 lg:p-48">
            <div class="relative z-10 flex justify-center items-center">
              <a class="group relative" href="#">
                <p 
                  class="text-center text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl pop-up-a">
                  HOUSE FELLOWSHIPS
                </p>
                <span class="s-highlight"></span>
              </a>
            </div>
            <img 
              class="absolute inset-0 w-full h-full object-cover blur-sm"
              loading="lazy"
              src="https://media.istockphoto.com/id/623901114/photo/real-friends-are-there-when-you-need-them.jpg?s=612x612&w=0&k=20&c=8xuB03fm7Kw7f0xTsx32ZoqF-6v6cvOT1uORy8q3Tho="
              alt="UPCOMING-EVENTS-IMAGE"
            >
        </div>

        <div class="relative p-8 sm:p-16 md:p-32 lg:p-48">
          <div class="relative z-10 flex justify-center items-center">
            <a class="group relative" href="#">
              <p 
                class="text-center text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl pop-up-a">
                UPCOMING EVENTS
              </p>
              <span class="s-highlight"></span>
            </a>
          </div>
          <img 
            class="absolute inset-0 w-full h-full object-cover blur-sm"
            loading="lazy"
            src="https://www.vancopayments.com/hs-fs/hubfs/Church%20Fellowship%20Event%20-%20Concert.jpg?width=800&height=534&name=Church%20Fellowship%20Event%20-%20Concert.jpg"
            alt="UPCOMING-EVENTS-IMAGE"
          >
        </div>
      </div>
    </div>
  </main>
</template>
