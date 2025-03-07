<template>
    <div class="flex gap-1 p-2 border-b bg-white flex-wrap">
      <button @click="editor.chain().focus().toggleBold().run()" 
              :class="{ 'bg-gray-100 text-gray-900': editor?.isActive('bold') }" 
              class="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors" 
              title="Bold (Ctrl+B)">
        <i class="fa-solid fa-bold w-4 h-4"></i>
      </button>
      
      <button @click="editor.chain().focus().toggleItalic().run()" 
              :class="{ 'bg-gray-100 text-gray-900': editor?.isActive('italic') }" 
              class="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors" 
              title="Italic (Ctrl+I)">
        <i class="fa-solid fa-italic w-4 h-4"></i>
      </button>
      
      <select @change="e => onHeadingUpdate(e.target.value)" 
              :value="currentHeadingLevel" 
              class="p-2 hover:bg-gray-100 rounded-md text-gray-600 border-0 focus:ring-0 focus:outline-none" 
              title="Heading style">
        <option value="">Normal</option>
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
      </select>
      
      <button v-if="hasUnderline" 
              @click="editor.chain().focus().toggleUnderline().run()" 
              :class="{ 'bg-gray-100 text-gray-900': editor?.isActive('underline') }" 
              class="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors" 
              title="Underline (Ctrl+U)">
        <i class="fa-solid fa-underline w-4 h-4"></i>
      </button>
      
      <button @click="editor.chain().focus().toggleBulletList().run()" 
              :class="{ 'bg-gray-100 text-gray-900': editor?.isActive('bulletList') }" 
              class="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors" 
              title="Bullet List">
        <i class="fa-solid fa-list w-4 h-4"></i>
      </button>
      
      <button v-if="hasOrderedList" 
              @click="editor.chain().focus().toggleOrderedList().run()" 
              :class="{ 'bg-gray-100 text-gray-900': editor?.isActive('orderedList') }" 
              class="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors" 
              title="Numbered List">
        <i class="fa-solid fa-list-ol w-4 h-4"></i>
      </button>
      
      <template v-if="hasTextAlign">
        <button @click="editor.chain().focus().setTextAlign('left').run()" 
                :class="{ 'bg-gray-100 text-gray-900': editor?.isActive({ textAlign: 'left' }) }" 
                class="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors" 
                title="Align Left">
          <i class="fa-solid fa-align-left w-4 h-4"></i>
        </button>
        <button @click="editor.chain().focus().setTextAlign('center').run()" 
                :class="{ 'bg-gray-100 text-gray-900': editor?.isActive({ textAlign: 'center' }) }" 
                class="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors" 
                title="Align Center">
          <i class="fa-solid fa-align-center w-4 h-4"></i>
        </button>
        <button @click="editor.chain().focus().setTextAlign('right').run()" 
                :class="{ 'bg-gray-100 text-gray-900': editor?.isActive({ textAlign: 'right' }) }" 
                class="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors" 
                title="Align Right">
          <i class="fa-solid fa-align-right w-4 h-4"></i>
        </button>
      </template>
      
      <button v-if="hasHighlight" 
              @click="editor.chain().focus().toggleHighlight().run()" 
              :class="{ 'bg-gray-100 text-gray-900': editor?.isActive('highlight') }" 
              class="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors" 
              title="Highlight">
        <i class="fa-solid fa-highlighter w-4 h-4"></i>
      </button>
      
      <button v-if="hasImage" 
              @click="$emit('insert-image')" 
              class="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors" 
              title="Insert Image">
        <i class="fa-solid fa-image w-4 h-4"></i>
      </button>
    </div>
  </template>
  
  <script setup>
  import { computed } from 'vue';
  
  const props = defineProps({
    editor: Object,
    currentHeadingLevel: {
      type: [String, Number],
      default: ''
    },
    features: {
      type: Object,
      default: () => ({
        underline: false,
        orderedList: false, 
        textAlign: false,
        highlight: false,
        image: false
      })
    }
  });
  
  const emit = defineEmits(['heading-update', 'insert-image']);
  
  const hasUnderline = computed(() => props.features.underline);
  const hasOrderedList = computed(() => props.features.orderedList);
  const hasTextAlign = computed(() => props.features.textAlign);
  const hasHighlight = computed(() => props.features.highlight);
  const hasImage = computed(() => props.features.image);
  
  const onHeadingUpdate = (level) => {
    emit('heading-update', level);
  };
  </script>