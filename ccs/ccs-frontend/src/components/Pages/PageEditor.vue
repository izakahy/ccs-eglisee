<template>
    <div  class="page-editor">
      <div v-if="isAuthenticated" class="admin-controls mb-4 flex items-center gap-2">
        <button 
          @click="contentStore.toggleEditMode()" 
          class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          {{ contentStore.isEditing ? 'Exit Edit Mode' : 'Edit Page' }}
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
  
      <!-- Editor or Viewer based on state -->
      <div v-if="contentStore.isEditing" class="editor-container">
        <textarea 
          v-model="editableContent" 
          class="w-full h-64 p-4 border rounded mb-4"
          placeholder="Enter HTML content for this page"
        ></textarea>
        
        <div class="preview-section mb-4">
          <h3 class="text-lg font-bold mb-2">Preview:</h3>
          <div class="p-4 border rounded bg-gray-50">
            <div v-html="editableContent"></div>
          </div>
        </div>
      </div>
      
      <div v-else class="content-display">
        <div v-if="savedContent" v-html="savedContent"></div>
        <slot v-else></slot>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useRoute } from 'vue-router';
  import { useContentStore } from '@/stores/Content';
  import { useAuthStore } from '@/stores/Auth';
  
  const route = useRoute();
  const contentStore = useContentStore();
  const authStore = useAuthStore();
  
  const editableContent = ref('');
  
  // Authentication check
  const isAuthenticated = computed(() => authStore.checkAuth());
  
  // Current path handling
  const currentPath = computed(() => route.path);
  
  // Get saved content using getter
  const savedContent = computed(() => {
    return contentStore.getPageContent(currentPath.value);
  });
  
  // Initial load
  onMounted(async () => {
    await contentStore.loadPageContent();
    editableContent.value = savedContent.value || 'No saved Content';
  });
  
  // Save handler
  const saveContent = async () => {
    const success = await contentStore.saveContent(
      currentPath.value, 
      editableContent.value
    );
  
    if (success) {
      alert("Content was successfully saved!");
      return; // Prevent double alert
    }
    
    alert("Content not saved");
  };

const confirmDelete = async () => {
  if (confirm('Are you sure you want to delete this content? This cannot be undone!')) {
    const success = await contentStore.deleteContent(currentPath.value);
    
    if (success) {
      editableContent.value = 'No saved Content';
      alert('Content deleted successfully');
      contentStore.toggleEditMode();
    } else {
      alert('Failed to delete content');
    }
  }
};
  </script>