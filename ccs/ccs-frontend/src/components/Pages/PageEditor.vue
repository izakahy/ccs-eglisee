<template>
    <div class="page-editor">
      <div v-if="isAuthenticated" class="admin-controls mb-4 flex items-center gap-2">
        <button 
          @click="contentStore.toggleEditMode()" 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {{ contentStore.isEditing ? "Exit Edit Mode" : "Edit Page" }}
        </button>
        <button 
          v-if="contentStore.isEditing"
          @click="saveContent" 
          class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Save Changes
        </button>
        <button 
          v-if="contentStore.isEditing"
          @click="confirmDelete"
          class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete Content
        </button>
      </div>
  
      <div v-if="contentStore.isEditing" class="editor-container">
        <div class="mb-4">
          <label class="block mb-2 font-bold" for="layout">Select Layout</label>
          <select v-model="editableLayout" class="w-full p-2 border rounded">
            <option v-for="layout in layouts" :value="layout.id">{{ layout.name }}</option>
          </select>
        </div>
  
        <div v-for="area in currentContentAreas" :key="area" class="mb-6">
          <h3 class="text-sm font-bold capitalize mb-2">Edit {{ area }}</h3>
          
          <div v-if="editors[area]" class="flex gap-1 p-2 border rounded-t-lg bg-gray-50 flex-wrap">
            <button 
              @click="editors[area].chain().focus().toggleBold().run()"
              :class="{ 'bg-gray-100': editors[area]?.isActive('bold') }"
              class="p-2 hover:bg-gray-100 rounded"
              title="Bold (Ctrl+B)"
            >
              <i class="fa-solid fa-bold w-4 h-4"></i>
            </button>
            <button 
              @click="editors[area].chain().focus().toggleItalic().run()"
              :class="{ 'bg-gray-100': editors[area]?.isActive('italic') }"
              class="p-2 hover:bg-gray-100 rounded"
              title="Italic (Ctrl+I)"
            >
              <i class="fa-solid fa-italic w-4 h-4"></i>
            </button>
            <select 
              @change="e => updateHeading(area, e.target.value)"
              :value="currentHeadingLevel(area)"
              class="p-2 hover:bg-gray-100 rounded"
              title="Heading style"
            >
              <option value="">Normal</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
            </select>
            <button 
              @click="editors[area].chain().focus().toggleBulletList().run()"
              :class="{ 'bg-gray-100': editors[area]?.isActive('bulletList') }"
              class="p-2 hover:bg-gray-100 rounded"
              title="Bullet List"
            >
              <i class="fa-solid fa-list w-4 h-4"></i>
            </button>
          </div>
         
          <div 
            class="border rounded-b-lg bg-white h-[200px] cursor-text"
            @click="focusEditor(area)"
          >
            <EditorContent
              :editor="editors[area]"
              class="editor-content"
            />
          </div>
        </div>
  
        <div class="preview-section mb-4">
          <h3 class="text-lg font-bold mb-2">Preview:</h3>
          <div class="p-4 border rounded bg-gray-50">
            <component :is="layoutComponents[editableLayout]" :contents="editableContents" />
          </div>
        </div>
      </div>
  
      <div v-else class="content-display">
        <div v-if="pageData.layout">
          <component :is="layoutComponents[pageData.layout]" :contents="pageData.contents" />
        </div>
        <slot v-else></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from "vue";
  import { useRoute } from "vue-router";
  import { useContentStore } from "@/stores/Content";
  import { useAuthStore } from "@/stores/Auth";
  import { Editor, EditorContent } from "@tiptap/vue-3";
  import StarterKit from "@tiptap/starter-kit";
  import layouts from "@/stores/layout";
  import SingleColumnLayout from "./Layouts/SingleColumnLayout.vue";
  import TwoColumnLayout from "./Layouts/TwoColumnLayout.vue";
  
  const layoutComponents = {
    single: SingleColumnLayout,
    twoColumn: TwoColumnLayout,
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
  
  const currentContentAreas = computed(() => {
    const layout = layouts.find((l) => l.id === editableLayout.value);
    return layout ? layout.areas : [];
  });
  
  // Initialize editors and focus them
  const initEditors = () => {
    currentContentAreas.value.forEach((area) => {
      if (!editors.value[area]) {
        editors.value[area] = new Editor({
          content: editableContents.value[area] || "",
          extensions: [StarterKit],
          onUpdate: ({ editor }) => {
            editableContents.value[area] = editor.getHTML();
          },
        });
        nextTick(() => {
          editors.value[area].commands.focus();
        });
      }
    });
  };
  
  const destroyEditors = () => {
    Object.values(editors.value).forEach((editor) => editor.destroy());
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
    const areas = layouts.find((l) => l.id === newLayout)?.areas || [];
    const newContents = {};
    areas.forEach((area) => {
      newContents[area] = editableContents.value[area] || "";
    });
    editableContents.value = newContents;
    initEditors();
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