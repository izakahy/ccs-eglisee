<script setup>
    import { PhoneIcon, EnvelopeIcon, ClockIcon, BuildingChurchIcon } from '@heroicons/vue/24/outline'
</script>

<template>
    <footer class="bg-black w-full p-8 text-white">
    <p>506-588-3245</p>
    <p><a href="mailto:info@ccs-eglise.org">INFO@CCS-EGLISE.ORG</a></p>
    <p>Date Time</p>
    <p class="text-gray-50 text-sm">
        &copy; {{ new Date().getFullYear() }} Communauté De La Compassion, Shediac
    </p>
  </footer>
</template>