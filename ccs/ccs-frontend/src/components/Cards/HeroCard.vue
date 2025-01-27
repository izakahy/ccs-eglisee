<script setup>
    import { ref, computed, watch } from 'vue';
    import { PencilSquareIcon } from '@heroicons/vue/24/outline';
    import { useAuthStore } from '@/stores/Auth';
    import EditorDialog from '../Helper/EditorDialog.vue';
    

    const authStore = useAuthStore();
    const emit = defineEmits(['update:title', 'update:body']);
    
    const isAuthenticated = computed(() => authStore.checkAuth());
    const showDialog = ref(false);
    const editType = ref('');
    
    const props = defineProps({
        bgColor: {
            type: String,
            default: 'bg-white'
        },
        title: {
            type: String,
            default: 'title',
        },
        body: {
            type: String,
            default: `Lorem ipsum dolor sit amet consectetur. Vitae vitae amet nunc
                orci sit pharetra adipiscing aenean. Non at aliquam cursus
                feugiat dapibus suspendisse leo risus tempor. Sem scelerisque
                urna sapien vel venenatis dolor elit ut id. Vulputate vel luctus
                iaculis pretium sem eget feugiat.`,
        },
    });

    const openEdit = (type) => {
        editType.value = type;
        showDialog.value = true; 
    }

    watch(showDialog, (newVal) => {
        if (!newVal) {
           setTimeout(() => {
             editType.value = ''
           }, 100)
        }
    })
</script>

<template>
    <div>
        <div :class="[bgColor, 'pt-2 p-11 rounded-md']">
            <h1 class="font-bold text-3xl mb-4 relative">
                {{ title }}
                <button
                    v-if="isAuthenticated"
                    @click="openEdit('title')"
                    class="absolute top-0 right-0 text-white hover:text-yellow-300 active:font-bold rounded-full p-1"
                    aria-label="Edit title"
                    title="Edit title"
                >
                    <PencilSquareIcon class="h-6 w-6" />
                </button>
            </h1>
            
            <div class="relative">
                <div v-html="body" class="prose prose-preview">
                </div>
                <button
                    v-if="isAuthenticated"
                    @click="openEdit('body')"
                    class="absolute bottom-0 right-0 mt-2 text-white hover:text-yellow-300 active:font-bold rounded-full p-1"
                    aria-label="Edit body"
                    title="Edit body"
                >
                    <PencilSquareIcon class="h-6 w-6" />
                </button>
            </div>
        </div>
        <div class="flex justify-center mt-4">
            <button
                class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
            Learn more
            </button>
        </div>
        <EditorDialog
            v-model="showDialog"
            :edit-type="editType"
            :title-value="title"
            :body-value="body"
            @update:title="emit('update:title', $event)"
            @update:body="emit('update:body', $event)"
        />     
    </div>
</template>
