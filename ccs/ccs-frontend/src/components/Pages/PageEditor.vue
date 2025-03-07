<template>
  <div class="page-editor" :class="{ 'bg-gray-50' : isAuthenticated }">
    <div :class="{ 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6' : isAuthenticated }">
      
      <!-- Admin Header -->
      <div v-if="isAuthenticated" class="bg-white rounded-xl shadow-sm p-5 mb-6">
        <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <!-- Layout Selector -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-1.5">Page Layout</label>
            <button 
              @click="showLayoutDialog = true"
              class="flex items-center justify-between w-full md:w-64 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <span class="font-medium">{{ currentLayoutName }}</span>
              <i class="fa-solid fa-caret-down text-gray-400"></i>
            </button>
            <LayoutSelector 
              v-model="showLayoutDialog" 
              :current-layout="editableLayout" 
              @update:layout="editableLayout = $event" 
            />
          </div>
          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-3">
            <button 
              @click="contentStore.toggleEditMode()"
              class="inline-flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
              :class="contentStore.isEditing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'"
            >
              <i v-if="!contentStore.isEditing" class="fa-solid fa-pen-to-square mr-2"></i>
              <i v-else class="fa-solid fa-xmark mr-2"></i>
              {{ contentStore.isEditing ? "Exit Edit Mode" : "Edit Page" }}
            </button>
            <button 
              v-if="contentStore.isEditing"
              @click="saveContent"
              class="inline-flex items-center px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              <i class="fa-solid fa-floppy-disk mr-2"></i>
              Save Changes
            </button>
            <button 
              v-if="contentStore.isEditing"
              @click="confirmDelete"
              class="inline-flex items-center px-4 py-2.5 bg-white border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <i class="fa-solid fa-trash-can mr-2"></i>
              Delete Content
            </button>
            <button 
              v-if="contentStore.isEditing"
              @click="showPreviewDialog = true"
              class="inline-flex items-center px-4 py-2.5 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              <i class="fa-solid fa-eye mr-2"></i>
              Preview
            </button>
          </div>
        </div>
      </div>

      <!-- Editor -->
      <div v-if="isAuthenticated && contentStore.isEditing" class="editor-container space-y-6">
        <!-- Dynamic Editor Layout -->
        <div class="max-w-6xl mx-auto" :class="editorContainerClass">
          <div v-for="area in currentContentAreas" :key="area" :class="editorClass(area)" class="mb-6">
            <div class="bg-white rounded-xl shadow-sm overflow-hidden">
              <div class="px-4 py-3 bg-gray-50 border-b">
                <h3 class="text-sm font-medium text-gray-700 capitalize">Edit {{ area }}</h3>
              </div>
              <!-- Toolbar -->
              <EditorToolbar
                :editor="editors[area]"
                :current-heading-level="currentHeadingLevel(area)"
                :features="{
                  underline: true,
                  orderedList: true,
                  textAlign: true,
                  highlight: true,
                  image: true
                }"
                @heading-update="level => updateHeading(area, level)"
                @insert-image="triggerFileInput(area)" 
              />
              <input 
                type="file"
                :ref="el => fileInputs[area] = el"
                accept="image/*"
                class="hidden"
                @change="handleFileUpload($event, area)"
              />
              <!-- Editor Content -->
              <div 
                class="border-0 bg-white h-[500px] cursor-text p-3 overflow-y-auto"
                @click="focusEditor(area)"
              >
                <EditorContent :editor="editors[area]" class="editor-content" />
              </div>
            </div>
          </div>
        </div>

        <!-- Preview Dialog -->
        <PreviewDialog 
          v-model="showPreviewDialog" 
          :layout="editableLayout" 
          :contents="editableContents" 
        />
      </div>

      <!-- Display -->
      <div v-if="!contentStore.isEditing" class="content-display" :class="{ 'bg-white rounded-xl shadow-sm p-6' : isAuthenticated }">
        <div v-if="pageData.layout">
          <component :is="layoutComponents[pageData.layout]" :contents="pageData.contents" />
        </div>
        <slot v-else></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from "vue";
import { EditorContent } from "@tiptap/vue-3";
import EditorToolbar from "../Helper/EditorToolbar.vue";
import { useRoute } from "vue-router";
import { useContentStore } from "@/stores/Content";
import { useAuthStore } from "@/stores/Auth";
import layouts from "@/stores/layout";
import SingleColumnLayout from "./Layouts/SingleColumnLayout.vue";
import TwoColumnLayout from "./Layouts/TwoColumnLayout.vue";
import LayoutSelector from "./Layouts/LayoutSelector.vue";
import PreviewDialog from "./Layouts/PreviewDialog.vue";
import DefaultLayout from "./Layouts/DefaultLayout.vue";
import { useTipTap } from "@/composables/useTipTap";

const layoutComponents = {
  single: SingleColumnLayout,
  twoColumn: TwoColumnLayout,
  default: DefaultLayout
};

const route = useRoute();
const contentStore = useContentStore();
const authStore = useAuthStore();

const isAuthenticated = computed(() => authStore.checkAuth());
const currentPath = computed(() => route.path);

const pageData = computed(() => contentStore.getPageContent(currentPath.value) || {
  layout: "single",
  contents: { content1: "" },
});

const editableLayout = ref(pageData.value.layout);
const editableContents = ref({ ...pageData.value.contents });
const editors = ref({});
const showLayoutDialog = ref(false);
const showPreviewDialog = ref(false);
const fileInputs = ref({});
const isUploading = ref(false);

// Compute current layout name for display
const currentLayoutName = computed(() => {
  const layout = layouts.find(l => l.id === editableLayout.value);
  return layout ? layout.name : "Select Layout";
});

const currentContentAreas = computed(() => {
  const layout = layouts.find((l) => l.id === editableLayout.value);
  return layout ? layout.areas : [];
});

// Dynamic class for editor container based on layout
const editorContainerClass = computed(() => {
  return editableLayout.value === 'twoColumn'
    ? 'grid grid-cols-1 md:grid-cols-3 gap-8'
    : 'max-w-4xl mx-auto';
});

// Dynamic class for each editor based on layout
const editorClass = (area) => {
  if (editableLayout.value === 'twoColumn') {
    return area === 'content1' ? 'md:col-span-2' : 'md:col-span-1';
  }
  return '';
};

// Initialize editors and focus them
const initEditors = () => {
  currentContentAreas.value.forEach((area) => {
    if (!editors.value[area]) {
      const { initEditor } = useTipTap({
        content: editableContents.value[area] || "",
        withImage: true,
        onUpdate: (editor) => {
          editableContents.value[area] = editor.getHTML();
        }
      })
      editors.value[area] = initEditor();
    }
  });
};

const triggerFileInput = (area) => {
  if (fileInputs.value[area]) {
    fileInputs.value[area].click();
  }
};

const handleFileUpload = async (event, area) => {
  const file = event.target.files[0];
  if (!file || !file.type.includes('image')) {
    alert('Please select a valid image file');
    return;
  }
  
  // Set uploading state
  isUploading.value = true;
  
  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (editors.value[area]) {
        editors.value[area].chain().focus().setImage({ src: e.target.result }).run();
      }
      // Reset file input
      if (fileInputs.value[area]) {
        fileInputs.value[area].value = '';
      }
      isUploading.value = false;
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.error('Error uploading image:', error);
    alert('Failed to upload image');
    isUploading.value = false;
  }
};

const destroyEditors = () => {
  Object.values(editors.value).forEach((editor) => editor?.destroy());
  editors.value = {};
};

// Focus editor when clicking the wrapper
const focusEditor = (area) => {
  if (editors.value[area]) {
    editors.value[area].commands.focus();
  }
};

// Heading level helper
const currentHeadingLevel = (area) => {
  return editors.value[area]?.getAttributes('heading').level || '';
};

const updateHeading = (area, level) => {
  const lvl = parseInt(level);
  if (editors.value[area]) {
    if (lvl) {
      editors.value[area].chain().focus().toggleHeading({ level: lvl }).run();
    } else {
      editors.value[area].chain().focus().setParagraph().run();
    }
  }
};

// Handle layout change
watch(editableLayout, (newLayout) => {
  destroyEditors();
  nextTick(() => {
    const areas = layouts.find((l) => l.id === newLayout)?.areas || [];
    const newContents = {};
    areas.forEach((area) => {
      newContents[area] = editableContents.value[area] || "";
    });
    editableContents.value = newContents;
    initEditors();
  })  
});

// Sync state when entering edit mode
watch(() => contentStore.isEditing, (isEditing) => {
  if (isEditing) {
    initEditable();
    initEditors();
  } else {
    destroyEditors();
  }
});

const initEditable = () => {
  editableLayout.value = pageData.value.layout || "single";
  editableContents.value = { ...pageData.value.contents };
};

onMounted(async () => {
  await contentStore.loadPageContent();
  if (contentStore.isEditing) {
    initEditable();
    initEditors();
  }
});

onBeforeUnmount(() => {
  destroyEditors();
});

// Save handler
const saveContent = async () => {
  const success = await contentStore.saveContent(currentPath.value, {
    layout: editableLayout.value,
    contents: editableContents.value,
  });
  alert(success ? "Content was successfully saved!" : "Content not saved");
};

// Delete handler
const confirmDelete = async () => {
  if (confirm("Are you sure you want to delete this content? This cannot be undone!")) {
    const success = await contentStore.deleteContent(currentPath.value);
    if (success) {
      editableLayout.value = "single";
      editableContents.value = { content1: "" };
      destroyEditors();
      alert("Content deleted successfully");
      contentStore.toggleEditMode();
    } else {
      alert("Failed to delete content");
    }
  }
};
</script>

<style>
.editor-content img {
  max-width: 100%;
  height: auto;
  margin: 1em 0;
}

/* Optional loading indicator */
.image-uploading {
  opacity: 0.7;
}

.editor-content {
  height: 100%;
  min-height: 180px;
  outline: none;
  padding: 0.5rem;
}
.editor-content h1 {
  font-size: 1.8em;
  font-weight: bold;
  margin-bottom: 0.5em;
}
.editor-content h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 0.5em;
}
.editor-content h3 {
  font-size: 1.25em;
  font-weight: bold;
  margin-bottom: 0.5em;
}
.editor-content ul {
  list-style-type: disc;
  padding-left: 1.5em;
  margin: 0.5em 0;
}
</style>