  <template>
      <div v-if="modelValue" class="fixed z-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <h3 class="text-lg font-medium mb-4">Edit {{ editType }}</h3>
                  
                <div class="flex-1 overflow-y-auto">
                  <div v-if="editType === 'title'" class="relative">
                    <input
                      v-model="localTitle"
                      type="text"
                      class="w-full p-2 border rounded mb-4"
                      maxlength="50"
                      :disabled="isLoading"
                    />
                    <div 
                      class="absolute right-2 top-2 text-sm flex items-center gap-2"
                      :class="{
                        'text-gray-500': localTitle.length < 40,
                        'text-yellow-600': localTitle.length >= 40 && localTitle.length < 50,
                        'text-red-600': localTitle.length === 50
                      }"
                    >
                      <i 
                        v-if="localTitle.length === 50"
                        class="fa-solid fa-triangle-exclamation"
                        title="Character limit reached"
                      ></i>
                      {{ localTitle.length }}/50
                    </div>
                  </div>
                      
                  <div v-else>
                      <div v-if="editor" class="border rounded-t-lg">
                        <EditorToolbar
                          :editor="editor"
                          :current-heading-level="currentHeadingLevel"
                          :features="{
                            underline: true,
                            orderedList: true,
                            textAlign: true,
                            highlight: true,
                            image: false
                          }" 
                          @heading-update="tipTap.toggleHeading"
                        />

                        <editor-content 
                          :editor="editor" 
                          class="editor-content prose max-w-none p-4 min-h-[50vh] max-h-[60vh] overflow-y-auto"
                        />
                      </div>
                    </div>
                </div>

                <div 
                  class="flex gap-2 mt-4 pt-4 border-t"
                  :class="{
                    'justify-between' : editType !== 'title',
                    'justify-end' : editType === 'title'
                  }"
                >
                  <div 
                    v-if="editType !== 'title'"
                    class="text-sm flex items-center gap-2"
                    :class="{
                      'text-gray-500': !isNearLimit,
                      'text-yellow-600': isNearLimit && !isAtLimit,
                      'text-red-600': isAtLimit
                    }"
                    :title="characterLimitTitle"
                  >
                    <i 
                      v-if="isAtLimit"
                      class="fa-solid fa-triangle-exclamation"
                    ></i>
                    <i 
                      v-else-if="isNearLimit"
                      class="fa-solid fa-exclamation"
                    ></i>
                    <span>Characters: {{ editor?.storage.characterCount.characters() }}/1000</span>
                  </div>
                  
                  <div class="flex gap-2">
                    <button
                      @click="cancelEdit"
                      class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      @click="saveEdit"
                      class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      :disabled="isLoading || editor?.storage.characterCount.characters() > 2000"
                    >
                    <span v-if="isLoading" class="inline-block animate-spin">⌛</span>
                        Save
                    </button>
                  </div>
                </div>
              </div>
      </div>
  </template>

 <script setup>
import { ref, watch, nextTick, onBeforeUnmount, computed, onMounted } from 'vue';
import { EditorContent } from '@tiptap/vue-3';
import { useTipTap } from '@/composables/useTipTap';
import EditorToolbar from './EditorToolbar.vue';

const props = defineProps({
  modelValue: Boolean,
  editType: String,
  titleValue: String,
  bodyValue: String,
  isLoading: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'update:title', 'update:body']);
const localTitle = ref(props.titleValue);
const CHAR_LIMIT = 1000;
const WARNING_THRESHOLD = 0.8;

const tipTap = useTipTap({
  content: props.bodyValue,
  withCharCount: true,
  charLimit: CHAR_LIMIT,
  editable: false,
  withImage: false,
  onUpdate: () => {}
});

const editor = ref(null);

onMounted(() => {
  editor.value = tipTap.initEditor();
});

const currentHeadingLevel = computed(() => {
  return editor.value?.getAttributes('heading').level || '';
});

const isNearLimit = computed(() => {
  const charCount = editor.value?.storage.characterCount.characters() || 0;
  return charCount >= CHAR_LIMIT * WARNING_THRESHOLD;
});

const isAtLimit = computed(() => {
  const charCount = editor.value?.storage.characterCount.characters() || 0;
  return charCount >= CHAR_LIMIT;
});

const characterLimitTitle = computed(() => {
  if (isAtLimit.value) {
    return 'Character limit reached';
  }
  if (isNearLimit.value) {
    return 'Approaching character limit';
  }
  return '';
});

watch(() => props.modelValue, (show) => {
  if (show) {
    nextTick(() => {
      if (props.editType === 'body' && editor.value) {
        tipTap.setContent(props.bodyValue);
        editor?.value.setEditable(true);
        setTimeout(() => {
          tipTap.focusEditor();
        }, 100);
      }
    });
  } else if (editor.value) {
    editor.value.setEditable(false);
  }
});

watch(() => props.modelValue, (show) => {
  if (show) {
    window.addEventListener('keydown', handleKeydown);
    document.body.classList.add('overflow-hidden');
    if (props.editType === 'title') {
      document.querySelector('input')?.focus();
    } else {
      tipTap.focusEditor();
    }
  } else {
    window.removeEventListener('keydown', handleKeydown);
    document.body.classList.remove('overflow-hidden');
  }
});

watch(() => props.titleValue, (newValue) => {
  localTitle.value = newValue;
});

watch(() => props.bodyValue, (newContent) => {
  if (props.editType === 'body' && editor.value?.isEditable && newContent !== editor.value.getHTML()) {
    tipTap.setContent(newContent);
  }
});

const handleKeydown = (e) => {
  if (!props.modelValue) return;
  const focusable = [
    ...document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
  ].filter(el => el.offsetParent !== null);
  if (e.key === 'Tab') {
    if (focusable.length === 0) {
      e.preventDefault();
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  }
  if (e.key === 'Escape') {
    cancelEdit();
  }
};

const cancelEdit = () => {
  emit('update:modelValue', false);
  if (props.editType === 'body' && editor.value) {
    tipTap.setContent(props.bodyValue);
  }
};

const saveEdit = () => {
  if (props.isLoading) return;
  try {
    if (props.editType === 'title') {
      emit('update:title', localTitle.value);
    } else if (editor.value && !isAtLimit.value) {
      const html = editor.value.getHTML();
      const isEmpty = html === '<p></p>' ||
                      html === '<ul></ul>' ||
                      html === '<ol></ol>' ||
                      /^<([a-z]+)[^>]*>\s*<\/\1>$/.test(html);
      emit('update:body', isEmpty ? '' : html);
    }
    emit('update:modelValue', false);
  } catch (error) {
    console.error('Save error:', error);
  }
};

onBeforeUnmount(() => {
  if (editor.value) {
    editor.value.destroy();
  }
});
</script>

<style scoped>
  .text-sm {
    transition: color 0.2s ease-in-out;
  }
</style>