<template>
    <div v-if="isAuthenticated" class="bg-white rounded-xl shadow-sm p-5 mb-6">
      <div class="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <!-- Layout Selector -->
        <div class="flex flex-col">
          <label class="text-sm font-medium text-gray-700 mb-1.5">Page Layout</label>
          <button 
            @click="showLayoutDialogLocal = true"
            class="flex items-center justify-between w-full md:w-64 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <span class="font-medium">{{ currentLayoutName }}</span>
            <i class="fa-solid fa-caret-down text-gray-400"></i>
          </button>
          <LayoutSelector 
            v-model="showLayoutDialogLocal" 
            :current-layout="editableLayout" 
            @update:layout="updateLayout" 
          />
        </div>
        <!-- Action Buttons -->
        <div class="flex flex-wrap items-center gap-3">
          <button 
            @click="toggleEditMode"
            class="inline-flex items-center px-4 py-2.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            :class="isEditing ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500' : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500'"
          >
            <i v-if="!isEditing" class="fa-solid fa-pen-to-square mr-2"></i>
            <i v-else class="fa-solid fa-xmark mr-2"></i>
            {{ isEditing ? "Exit Edit Mode" : "Edit Page" }}
          </button>
          <button 
            v-if="isEditing"
            @click="$emit('save')"
            class="inline-flex items-center px-4 py-2.5 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            <i class="fa-solid fa-floppy-disk mr-2"></i>
            Save Changes
          </button>
          <button 
            v-if="isEditing"
            @click="$emit('delete')"
            class="inline-flex items-center px-4 py-2.5 bg-white border border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            <i class="fa-solid fa-trash-can mr-2"></i>
            Delete Content
          </button>
          <button 
            v-if="isEditing"
            @click="showPreviewDialogLocal = true"
            class="inline-flex items-center px-4 py-2.5 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            <i class="fa-solid fa-eye mr-2"></i>
            Preview
          </button>
        </div>
      </div>
    </div>
    
    <!-- Preview Dialog -->
    <PreviewDialog 
      v-model="showPreviewDialogLocal" 
      :layout="editableLayout" 
      :contents="contents" 
    />
  </template>
  
  <script setup>
  import { ref, computed, watch } from 'vue';
  import LayoutSelector from "./Layouts/LayoutSelector.vue";
  import PreviewDialog from "./Layouts/PreviewDialog.vue";
  import layouts from "@/stores/layout";
  
  const props = defineProps({
    isAuthenticated: {
      type: Boolean,
      required: true
    },
    isEditing: {
      type: Boolean,
      required: true
    },
    editableLayout: {
      type: String,
      required: true
    },
    contents: {
      type: Object,
      required: true
    },
    showLayoutDialog: {
      type: Boolean,
      default: false
    },
    showPreviewDialog: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits([
    'update:editableLayout', 
    'update:showLayoutDialog',
    'update:showPreviewDialog',
    'toggle-edit-mode',
    'save',
    'delete'
  ]);
  
  // Local state that syncs with parent
  const showLayoutDialogLocal = ref(props.showLayoutDialog);
  const showPreviewDialogLocal = ref(props.showPreviewDialog);
  
  // Watch for local changes and emit to parent
  watch(showLayoutDialogLocal, (newVal) => {
    emit('update:showLayoutDialog', newVal);
  });
  
  watch(showPreviewDialogLocal, (newVal) => {
    emit('update:showPreviewDialog', newVal);
  });
  
  // Watch for parent changes
  watch(() => props.showLayoutDialog, (newVal) => {
    showLayoutDialogLocal.value = newVal;
  });
  
  watch(() => props.showPreviewDialog, (newVal) => {
    showPreviewDialogLocal.value = newVal;
  });
  
  // Compute current layout name for display
  const currentLayoutName = computed(() => {
    const layout = layouts.find(l => l.id === props.editableLayout);
    return layout ? layout.name : "Select Layout";
  });
  
  // Methods
  const updateLayout = (newLayout) => {
    emit('update:editableLayout', newLayout);
  };
  
  const toggleEditMode = () => {
    emit('toggle-edit-mode');
  };
  </script>