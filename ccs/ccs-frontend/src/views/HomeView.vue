<script setup>
import HeroCard from '@/components/Cards/HeroCard.vue';
import YoutubePlayer from '@/components/YoutubePlayer.vue';
import InvitationCard from '@/components/Cards/InvitationCard.vue';
import MainCard from '@/components/Cards/MainCard.vue';
import InfoCard from '@/components/Cards/InfoCard.vue';

</script>

<template>
  <main>
    <!-- hero -->
   <MainCard image="https://images3.alphacoders.com/110/1109183.jpg" />

    <div class="p-5 py-16 px-4 sm:px-6 lg:px-8">
      <InfoCard />
      <div class="mt-11 mb-11">
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-11 gap-y-5 mx-auto max-w-6xl">
          <HeroCard bgColor="bg-red-800" title="Title 1"></HeroCard>
          <HeroCard bgColor="bg-blue-500" title="Title 2"></HeroCard>
          <HeroCard bgColor="bg-green-500" title="Title 3"></HeroCard>
        </div>
      </div>
    </div>

    <div>
      <YoutubePlayer />
    </div>

    <div>
      <div class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3 mx-auto max-w-7xl mt-5 mb-5">
        <InvitationCard 
        type="content"
        title="ABOUT PASTOR"
        container-class="flex flex-col justify-evenly"
        showButton="true"
        >
        <p class="text-center lg:text-start text-lg">
          Lorem ipsum dolor sit amet consectetur. Vitae vitae amet nunc orci sit pharetra adipiscing aenean.
          Non at aliquam cursus feugiat dapibus suspendisse leo risus tempor. Sem scelerisque urna sapien vel venenatis dolor elit ut id.
          Vulputate vel luctus iaculis pretium sem eget feugiat.
        </p>
        </InvitationCard>

        <InvitationCard
        type="image"
        image="https://preview.redd.it/is-there-a-sniper-default-pfp-that-someone-made-v0-78az45pd9f6c1.jpg?width=396&format=pjpg&auto=webp&s=5be4618605b25e0546d72dff52a7b897c3d4e1d4"
        image-alt="Profile image"
        />

        <InvitationCard
        type="image-card"
        image="https://media.istockphoto.com/id/623901114/photo/real-friends-are-there-when-you-need-them.jpg?s=612x612&w=0&k=20&c=8xuB03fm7Kw7f0xTsx32ZoqF-6v6cvOT1uORy8q3Tho="
        image-alt="Fellowship image"
        content-class="bg-blue-50 p-8 sm:p-16 md:p-32 lg:p-48"
        >
          <template #highlight-content>
            <a class="group relative" href="#">
              <p class="text-center text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl pop-up-a">
                HOUSE FELLOWSHIPS
              </p>
              <span class="s-highlight"></span>
            </a>
          </template>
        </InvitationCard>

        <InvitationCard
        type="image-card"
        image="https://www.vancopayments.com/hs-fs/hubfs/Church%20Fellowship%20Event%20-%20Concert.jpg?width=800&height=534&name=Church%20Fellowship%20Event%20-%20Concert.jpg"
        image-alt="Events image"
        content-class="p-8 sm:p-16 md:p-32 lg:p-48"
        >
        <template #highlight-content>
          <a class="group relative" href="#">
            <p class="text-center text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl pop-up-a">
              UPCOMING EVENTS
            </p>
            <span class="s-highlight"></span>
          </a>
        </template>
        </InvitationCard>
      </div>
    </div>
  </main>
</template>