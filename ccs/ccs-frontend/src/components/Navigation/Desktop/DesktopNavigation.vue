<template>
  <ul :class="['hidden lg:flex space-x-2', locale === 'en' ? 'text-2xl' : 'text-[1.3rem]',  $attrs.class]">
    <template v-for="(section, key) in navStore.routes" :key="key">
      <DropdownMenuItem
        class="hover:text-[#e7dfdf] transition-all ease-in-out"
        v-if="dropdownStates[key] !== undefined"
        :label="$te(`navigation.${section.label}`) ? $t(`navigation.${section.label}`) : section.label"
        :href="section.path"
        :is-open="dropdownStates[key]"
        :items="translateItems(section.items)"
        :section-key="key"
        @update:is-open="(value) => HandleDropdownToggle(key, value)"
      >
        <!-- Admin Controls (outside regular items) -->
        <div
          v-if="isAuthenticated"
          class="px-6 pt-1 pb-6 space-y-4 border-t bg-gradient-to-r from-gray-900 to-stone-900 border-gray-400 mt-4 w-full max-w-2xl mx-auto rounded-xl shadow-md"
        >
          <div class="mb-4">
            <p class="text-sm text-gray-300 font-semibold text-center">{{ $t('addEditSection')}}</p>
          </div>
          <div class="flex items-center justify-between gap-2 mb-4 border-b border-gray-400 pb-4">
            <div class="flex-1">
              <input
                v-if="editingSectionKey === key"
                :disabled="loadingStates.updateSection"
                v-model="editingSectionLabel"
                :placeholder="$t('inputPlaceholders.sectionLabel')"
                class="px-2 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
              <span v-else class="text-white text-xl">{{ translateText(`navigation.${section.label}`, section.label) }}</span>
            </div>
            <div class="flex gap-2">
              <button
                v-if="editingSectionKey === key"
                @click="handleUpdateSection(key)"
                class="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                title="Save Section"
                :disabled="loadingStates.updateSection"
              >
                <template v-if="loadingStates.updateSection">
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </template>
                <PencilSquareIcon v-else class="w-5 h-5" />
              </button>
              <button
                v-if="editingSectionKey === key"
                @click="cancelSectionEdit"
                class="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                title="Cancel"
                :disabled="loadingStates.updateSection"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
              <button
                v-else
                @click="startSectionEdit(key, section.label)"
                class="p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                title="Edit Section"
              >
                <PencilIcon class="w-5 h-5" />
              </button>
              <button
                @click="handleDeleteSection(key)"
                class="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                title="Delete Section"
                :disabled="loadingStates.deleteSection === key"
              >
                <template v-if="loadingStates.deleteSection === key">
                  <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </template>
                <TrashIcon v-else class="w-5 h-5" />
              </button>
            </div>
          </div>
          <div class="">
            <p class="text-sm text-gray-300 font-semibold text-center">{{ $t('addEditForm') }}</p>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newItem.label"
              :placeholder="$t('inputPlaceholders.itemLabel')"
              class="px-2 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition duration-200 ease-in-out"
              :disabled="editingIndex !== -1 && loadingStates.updateItem !== null"
            >
            <button
              title="Add or Update"
              @click="editingIndex === -1 ? handleAdd(key) : handleUpdate(key)"
              class="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              :disabled="loadingStates.addItem || loadingStates.updateItem === editingIndex"
            >
              <template v-if="editingIndex === -1 && loadingStates.addItem">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </template>
              <template v-else-if="editingIndex !== -1 && loadingStates.updateItem === editingIndex">
                <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </template>
              <PencilSquareIcon v-else class="w-5 h-5" />
            </button>
          </div>
          <!-- Items List -->
          <div v-for="(item, index) in section.items" :key="index" class="flex items-center gap-2">
            <span class="flex-1 text-sm text-white">{{ translateText(`items.${item.label}`, item.label) }}</span>
            <RouterLink :to="item.path">{{ translateText(`items.${item.label}`, item.label) }}</RouterLink>
            <button
              title="Update"
              @click="editingIndex = index; newItem = { label: item.label }"
              class="text-gray-900 p-1 bg-blue-400 hover:bg-blue-500 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              :disabled="loadingStates.deleteItem === index"
            >
              <PencilIcon class="w-4 h-4" />
            </button>
            <button
              title="Delete"
              @click.stop.prevent="handleDelete(key, index)"
              class="text-white p-1 bg-red-500 hover:bg-red-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              :disabled="loadingStates.deleteItem === index"
            >
              <template v-if="loadingStates.deleteItem === index">
                <svg class="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </template>
              <TrashIcon v-else class="w-4 h-4" />
            </button>
          </div>
        </div>
      </DropdownMenuItem>
    </template>
    <!-- <DropdownMenuItem
      label="SOCIALS"
      href="#"
      :items="socialItems"
      :is-open="dropdownStates.social"
      section-key="social"
      @update:is-open="(value) => HandleDropdownToggle('social', value)"
    /> -->

    <div class="relative text-sm">
    <button 
      @click="toggleLanguage" 
      class="flex items-center space-x-2 px-3 text-white bg-transparent hover:bg-blue-600 rounded-lg transition-all duration-200 ease-in-out"
      :title="locale === 'en' ? 'Switch to French' : 'Switch to English'"
    >
      <i class="fa-solid fa-language text-xl"></i>
      <span>{{ locale === 'en' ? 'EN' : 'FR' }}</span>
      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  </div>
    <!-- Add Section Form -->
    <div v-if="isAuthenticated" class="items-center">
      <div v-if="isAddingSectionMode" class="flex gap-2 items-center">
        <input
          v-model="newSection.label"
          placeholder="Section Label (e.g. 'SERVICES')"
          class="px-2 py-2 bg-gray-50 border border-gray-300 rounded-lg text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
        <button
          @click="handleAddSection"
          class="p-2 text-white bg-green-500 hover:bg-green-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          :disabled="loadingStates.addSection"
        >
          <template v-if="loadingStates.addSection">
            <svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </template>
          <PencilSquareIcon v-else class="w-5 h-5" />
        </button>
        <button
          @click="isAddingSectionMode = false"
          class="p-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          :disabled="loadingStates.addSection"
        >
          <XMarkIcon class="w-5 h-5" />
        </button>
      </div>
      <button
        v-else
        @click="isAddingSectionMode = true"
        class="p-2 text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        title="Add Section"
      >
        <PlusIcon class="w-5 h-5" />
      </button>
    </div>
  </ul>
</template>

<script setup>
import { ref, computed, reactive, watch, markRaw, onMounted } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import DropdownMenuItem from './DropdownMenuItem.vue';
import { useAuthStore } from '@/stores/Auth';
import { PencilSquareIcon, PencilIcon, TrashIcon, PlusIcon, XMarkIcon } from '@heroicons/vue/24/outline';
import { useNavigationStore } from '@/stores/NavItems/Navigation';
import { addDynamicRoutes } from '@/router';
import DynamicPage from '@/components/Pages/DynamicPage.vue';
import { useI18n } from 'vue-i18n';
import { useLanguage } from '@/composables/useLanguage';

const navStore = useNavigationStore();
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();
const { currentLocale, toggleLanguage, translateText } = useLanguage()


const newItem = ref({ label: '' });
const editingIndex = ref(-1);
const isAddingSectionMode = ref(false);
const editingSectionKey = ref(null);
const editingSectionLabel = ref('');
const dropdownStates = reactive({});
const newSection = reactive({ label: '' });

// Loading states
const loadingStates = reactive({
  addSection: false,
  deleteSection: null, 
  updateSection: false,
  addItem: false,
  updateItem: null, 
  deleteItem: null, 
  initialLoad: !navStore.initialized
});

// Loading message state
const loadingMessage = ref('Loading...');

// const toggleLanguage = () => {
//   // Switch between English and French using the i18n composable
//   locale.value = locale.value === 'en' ? 'fr' : 'en';
//   // Store user preference
//   localStorage.setItem('userLanguage', locale.value);
// };


// Computed property for global loading state
const isGlobalLoading = computed(() => {
  return !navStore.initialized && loadingStates.initialLoad;
});

const socialItems = ref([
  { label: 'YouTube', path: 'https://www.youtube.com/@CommunauteCompassionShediac', external: true },
  { label: 'Facebook', path: 'https://www.facebook.com/@CommunauteCompassionShediac', external: true },
]);

const routeKeys = computed(() => Object.keys(navStore.routes));
const isAuthenticated = computed(() => authStore.checkAuth());

const HandleDropdownToggle = (key, value) => {
  dropdownStates[key] = value;
  if (value) {
    newItem.value = { label: '' };
    editingIndex.value = -1;
  }
};

const showAlert = (msg, sectionKey) => {
  const wasOpen = dropdownStates[sectionKey];
  alert(msg);
  dropdownStates[sectionKey] = wasOpen;
};

const handleAdd = async (sectionKey) => {
  const validation = navStore.validateItem(sectionKey, newItem.value.label);
  if (!newItem.value.label.trim()) {
    showAlert("Please enter a label.");
    return;
  }
  if (!validation.isValid) {
    showAlert('Label already exists. Please choose a unique label.');
    return;
  }
  
  loadingStates.addItem = true;
  loadingMessage.value = "Adding new item...";
  
  try {
    await navStore.addItem(sectionKey, {
      label: newItem.value.label,
      path: newItem.value.label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
    });
    
    addDynamicRoutes();
    newItem.value = { label: '' };
  } catch (error) {
    showAlert(error.message);
  } finally {
    loadingStates.addItem = false;
  }
};

const handleUpdate = async (sectionKey) => {
  if (!newItem.value.label.trim()) {
    showAlert("Please enter a label.");
    return;
  }
  
  loadingStates.updateItem = editingIndex.value;
  loadingMessage.value = "Updating item...";
  
  try {
    const validation = navStore.validateItemUpdate(
      sectionKey,
      editingIndex.value,
      newItem.value.label
    );
    
    if (!validation.isValid) {
      showAlert('Label or path already exists in this section');
      loadingStates.updateItem = null;
      return;
    }
    
    await navStore.updateItem(sectionKey, editingIndex.value, {
      label: newItem.value.label,
      path: newItem.value.label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-')
    });
    
    addDynamicRoutes();
    editingIndex.value = -1;
    newItem.value = { label: '' };
  } catch (error) {
    showAlert(error.message);
  } finally {
    loadingStates.updateItem = null;
  }
};

const startSectionEdit = (key, currentLabel) => {
  editingSectionKey.value = key;
  editingSectionLabel.value = currentLabel;
};

const cancelSectionEdit = () => {
  editingSectionKey.value = null;
  editingSectionLabel.value = '';
};

const handleUpdateSection = async (sectionKey) => {
  if (!editingSectionLabel.value.trim()) {
    showAlert('Please enter a section label', sectionKey);
    return;
  }
  
  loadingStates.updateSection = true;
  loadingMessage.value = "Updating section...";
  
  try {
    await navStore.updateSection(sectionKey, {
      label: editingSectionLabel.value.toUpperCase(),
      path: `/${sectionKey}`,
      component: DynamicPage
    });
    
    editingSectionKey.value = null;
    editingSectionLabel.value = '';
    // Update routes
    addDynamicRoutes();
  } catch (error) {
    showAlert(error.message, sectionKey);
  } finally {
    loadingStates.updateSection = false;
  }
};

const handleDeleteSection = async (sectionKey) => {
  const confirmed = confirm("Are you sure you want to delete this section? This will delete all items within it.");
  if (confirmed) {
    loadingStates.deleteSection = sectionKey;
    loadingMessage.value = "Deleting section...";
    
    try {
      if (route.path.startsWith(`/${sectionKey}`)) {
        await router.push({ name: 'notFound' });
      }
      
      await navStore.deleteSection(sectionKey);
      addDynamicRoutes();
    } catch (error) {
      showAlert(error.message, sectionKey);
    } finally {
      loadingStates.deleteSection = null;
    }
  }
};

const handleDelete = async (sectionKey, index) => {
  const wasOpen = dropdownStates[sectionKey];
  const confirmed = confirm("Are you sure you want to delete this?");
  dropdownStates[sectionKey] = wasOpen;
  
  if (confirmed) {
    loadingStates.deleteItem = index;
    loadingMessage.value = "Deleting item...";
    
    try {
      const itemPath = navStore.routes[sectionKey]?.items[index]?.path;
      if (itemPath && route.path === itemPath) {
        await router.push({ name: 'notFound' });
      }
      
      await navStore.deleteItem(sectionKey, index);
      addDynamicRoutes();
      dropdownStates[sectionKey] = true;
    } catch (error) {
      console.error("Error deleting section", error);
      showAlert(error.message, sectionKey);
    } finally {
      loadingStates.deleteItem = null;
    }
  }
};

const handleAddSection = async () => {
  if (!newSection.label.trim()) {
    alert('Please enter a section label');
    return;
  }
  
  // Generate the section key from the label
  const sectionKey = newSection.label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-');
  
  loadingStates.addSection = true;
  loadingMessage.value = "Adding new section...";
  
  try {
    await navStore.addSection(sectionKey, {
      label: newSection.label.toUpperCase(),
      component: markRaw(DynamicPage)
    });
    
    // Reset form
    newSection.label = '';
    isAddingSectionMode.value = false;
    
    // Update routes
    addDynamicRoutes();
  } catch (error) {
    console.error(error.message);
    alert(error.message);
  } finally {
    loadingStates.addSection = false;
  }
};


const translateItems = (items) => {
  if (!items) return [];
  
  return items.map(item => ({
    ...item,
    label: t(`items.${item.label}`, item.label) 
  }));
};

defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  aboutItems: {
    type: Array,
    required: true
  }
});

defineEmits(['update:modelValue']);

onMounted(async () => {
  const savedLanguage = localStorage.getItem('userLanguage');
  if (savedLanguage) {
    locale.value = savedLanguage;
  }
  
  loadingStates.initialLoad = true;
  loadingMessage.value = "Loading navigation...";
  
  try {
    console.log("loading navigations");
    await navStore.getSection();
    console.log("navigations loaded");
  } catch (error) {
    console.error('Error loading navigation state:', error);
  } finally {
    loadingStates.initialLoad = false;
  }
});

watch(routeKeys, (newKeys) => {
  newKeys.forEach(key => {
    if (!(key in dropdownStates)) {
      dropdownStates[key] = false;
    }
  });
  // Remove old keys
  Object.keys(dropdownStates).forEach(key => {
    if (!newKeys.includes(key)) {
      delete dropdownStates[key];
    }
  });
}, { immediate: true });
</script>