<script setup>
    import { ref, computed } from 'vue';
    import { PencilSquareIcon } from '@heroicons/vue/24/outline';
    import { useAuthStore } from '@/stores/Auth';

    const authStore = useAuthStore();
    const emit = defineEmits(['update:title', 'update:body']);

    const isAuthenticated = computed(() => authStore.checkAuth());
    const showDialog = ref(false);
    const editType = ref('');
    const editedText = ref('');

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
        editedText.value = props[type];
        showDialog.value = true; 
    }

    const saveEdit = () => {
        if (editType.value === 'title') {
            emit('update:title', editedText.value);
        } else {
            emit('update:body', editedText.value);
        };
        showDialog.value = false;
    }
    const cancelEdit = () => {
        showDialog.value = false;
    }
</script>

<template>
    <div>
        <div :class="[bgColor, 'pt-2 p-11 rounded-md']">
            <h1 class="font-bold text-3xl mb-4">{{ title }}
                <button
                    v-if="isAuthenticated"
                    @click="openEdit('title')"
                    class="text-white hover:text-yellow-300 active:font-bold rounded-full p-1"
                    
                    aria-label="Edit title"
                    title="Edit title"
                >
                    <PencilSquareIcon class="h-6 w-6" />
                </button>
            </h1>
            <p>
                {{ body }}
                <button
                    v-if="isAuthenticated"
                    @click="openEdit('body')"
                    class="text-white hover:text-yellow-300 active:font-bold rounded-full p-1"
                    
                    aria-label="Edit body"
                    title="Edit body"
                >
                    <PencilSquareIcon class="h-6 w-6" />
                </button>
            </p>
        </div>
        <div class="flex justify-center mt-4">
            <button
                class="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
            Learn more
            </button>
        </div>
       
        
        <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
               <div class="bg-white rounded-lg p-6 w-full max-w-md">
                   <h3 class="text-lg font-medium mb-4">Edit {{ editType }}</h3>
                   
                   <input
                       v-if="editType === 'title'"
                       v-model="editedText"
                       type="text"
                       class="w-full p-2 border rounded mb-4"
                   />
                   <textarea
                       v-else
                       v-model="editedText"
                       class="w-full p-2 border rounded mb-4 h-32"
                   ></textarea>
    
                   <div class="flex justify-end gap-2">
                       <button
                           @click="cancelEdit"
                           class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                       >
                           Cancel
                       </button>
                       <button
                           @click="saveEdit"
                           class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                       >
                           Save
                       </button>
                   </div>
               </div>
           </div>
    </div>
</template>
