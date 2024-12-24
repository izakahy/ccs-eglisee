<script setup>
</script>

<template>
  <main>
    <!-- hero -->
    <div class="mx-auto bg-gray-200 relative">
      <div class="absolute inset-0 flex justify-center items-center">
        <h1 class="text-center font-bold text-8xl text-white">Welcome</h1>
      </div>
      <img class="w-full img-fluid h-[500px] object-cover" src="https://images.unsplash.com/photo-1519491050282-cf00c82424b4?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2h1cmNofGVufDB8fDB8fHww" alt="">
    </div>

    <div class="p-5">
      <h2 class="text-center text-4xl">SERVICE TIMES</h2>
      <p class="text-bold text-center P-2">58 FESTIVAL STREET, SHEDIAC, NB E4P IS4</p>
      <div class="flex justify-center p-5">
        <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Learn more</button>
      </div>
      <div class="mt-11 mb-11">
        <div class="grid grid-cols-3 gap-11 gap-y-5 mx-auto max-w-6xl">
          <div class="bg-red-950 p-11 rounded-md">
            <p>
              Lorem ipsum dolor sit amet consectetur. Vitae vitae amet nunc orci sit pharetra adipiscing aenean.
               Non at aliquam cursus feugiat dapibus suspendisse leo risus tempor. Sem scelerisque urna sapien vel venenatis dolor elit ut id.
               Vulputate vel luctus iaculis pretium sem eget feugiat.
            </p>
          </div>
          <div class="bg-blue-800 p-11 rounded-md">
            <p>
              Lorem ipsum dolor sit amet consectetur. Vitae vitae amet nunc orci sit pharetra adipiscing aenean.
               Non at aliquam cursus feugiat dapibus suspendisse leo risus tempor. Sem scelerisque urna sapien vel venenatis dolor elit ut id.
               Vulputate vel luctus iaculis pretium sem eget feugiat.
            </p>
          </div>
          <div class="bg-green-800 p-11 rounded-md">
            <p>
              Lorem ipsum dolor sit amet consectetur. Vitae vitae amet nunc orci sit pharetra adipiscing aenean.
               Non at aliquam cursus feugiat dapibus suspendisse leo risus tempor. Sem scelerisque urna sapien vel venenatis dolor elit ut id.
               Vulputate vel luctus iaculis pretium sem eget feugiat.
            </p>
          </div>
          <div class="flex justify-center gap-0">
            <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Learn more</button>
          </div>
          <div class="flex justify-center">
            <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Learn more</button>
          </div>
          <div class="flex justify-center">
            <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Learn more</button>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-black flex flex-col justify-center items-center relative pb-11">
      <h3 class="text-white text-center font-normal text-4xl mb-4">LATEST SERMONS</h3>
      <iframe 
        class="w-full max-w-7xl h-[500px]"
        src="https://www.youtube.com/embed/YA2Lxfw4SSw?autoplay=1&mute=1&loop=1" 
        frameborder="0"
        allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
      </iframe>
    </div>

    <div>
      <div class="grid grid-cols-2 gap-3 mx-auto max-w-7xl mt-5 mb-5">
        <div class="bg-yellow-500 flex flex-col justify-between">
          <h1 class="text-7xl font-medium text-start" id="about">ABOUT PASTOR</h1>

          <div class="pl-0 p-2">
            <p class="text-lg">
               Lorem ipsum dolor sit amet consectetur. Vitae vitae amet nunc orci sit pharetra adipiscing aenean.
               Non at aliquam cursus feugiat dapibus suspendisse leo risus tempor. Sem scelerisque urna sapien vel venenatis dolor elit ut id.
               Vulputate vel luctus iaculis pretium sem eget feugiat.
            </p>
          </div>
          <div class="">
            <button class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium text-lg px-5 py-4 me-2 w-5/12 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700">Learn more</button>
          </div>
        </div>
        <div class="bg-red-500 p-48 relative">
          <img class="w-full h-full object-cover absolute top-0 left-0" src="https://preview.redd.it/is-there-a-sniper-default-pfp-that-someone-made-v0-78az45pd9f6c1.jpg?width=396&format=pjpg&auto=webp&s=5be4618605b25e0546d72dff52a7b897c3d4e1d4" alt="">
        </div>
        <div class="bg-orange-500 p-48">
          <div class="flex justify-center items-center">
            <p class="text-center font-bold text-6xl">HOUSE FELLOWSHIPS</p>
          </div>
        </div>
        <div class="bg-purple-500 p-48">
          <div class="flex justify-center items-center">
            <p class="text-center font-bold text-6xl">UPCOMING EVENTS</p>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
