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
              <div v-if="area === 'bgIMG'" class="p-6 space-y-6 bg-white rounded-xl shadow-sm">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Background Image URL</label>
                  <div class="relative">
                    <input 
                      type="text"
                      v-model="editableContents.bgIMG.src"
                      placeholder="https://example.com/image.jpg"
                      class="w-full p-3 pl-4 pr-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                    />
                    <button 
                      v-if="editableContents.bgIMG" 
                      @click="editableContents.bgIMG = ''"
                      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </button>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">Image Caption</label>
                  <input 
                    type="text"
                    v-model="editableContents.bgIMG.caption"
                    placeholder="Enter caption (e.g., 'Sunset over mountains')"
                    class="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
                  />
                </div>
                
                <div class="space-y-2">
                  <label class="block text-sm font-medium text-gray-700">Upload an Image</label>
                  <div 
                    class="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-primary/70 transition-colors duration-200 cursor-pointer"
                    @click="triggerFileInput(area)"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mx-auto mb-2 text-gray-400"><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7"/><line x1="16" x2="22" y1="5" y2="5"/><line x1="19" x2="19" y1="2" y2="8"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
                    <p class="text-sm text-gray-500">Drag and drop an image here or click to browse</p>
                    <p class="text-xs text-gray-400 mt-1">Supports JPG, PNG, GIF (Max 5MB)</p>
                    <input 
                      :ref="el => fileInputs[area] = el"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      @change="handleBgImageUpload"
                    />
                  </div>
                </div>
              </div>

              <div v-else>
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
                  @change="handleBgImageUpload($event)"
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
const bgFileInput = ref(null);
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
    if (area !== 'bgIMG' && !editors.value[area]) {
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
  if (area === 'bgIMG') {
    editableContents.value.bgIMG.src = ''; 
    editableContents.value.bgIMG.caption = ''; 
  }
  if (fileInputs.value[area]) {
    fileInputs.value[area].click();
  }
};

const triggerBgFileInput = () => {
  editableContents.value.bgIMG = '';
  if (bgFileInput.value) {
    bgFileInput.value.click();
  } else {
    console.error("Background file input not found");
  }
};

const handleBgImageUpload = (event) => {
  const file = event.target.files[0];
  if (!file || !file.type.includes('image')) {
    alert('Please select a valid image file');
    return;
  }
  if (typeof editableContents.value.bgIMG !== 'object' || editableContents.value.bgIMG === null) {
    editableContents.value.bgIMG = { src: '', caption: '' };
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    editableContents.value.bgIMG.src = e.target.result; 

    if (!editableContents.value.bgIMG.caption) {
      editableContents.value.bgIMG.caption = `Image: ${file.name}`;
    }

    event.target.value = ''; 
  };
  reader.readAsDataURL(file);
};

const handleEditorImageUpload = (area, event) => {
  const file = event.target.files[0];
  if (!file || !file.type.includes('image')) {
    alert('Please select a valid image file');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    if (editors.value[area]) {
      editors.value[area].chain().focus().setImage({ src: e.target.result }).run();
    }
    event.target.value = '';
  };
  reader.readAsDataURL(file);
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
  const contents = { ...pageData.value.contents };
  
  contents.bgIMG = contents.bgIMG
    ? (typeof contents.bgIMG === 'string' ? { src: contents.bgIMG, caption: '' } : contents.bgIMG)
    : { src: '', caption: '' };

  editableContents.value = contents;
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
  if (editableContents.value.bgIMG.caption.startsWith('Image')) {
    if(!confirm('Do you want to save this caption name?')) {
      return;
    }
  }
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