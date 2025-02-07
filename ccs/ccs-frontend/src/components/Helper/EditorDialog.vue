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
                        <div class="flex gap-1 p-2 border-b flex-wrap">
                                  
                                  <!-- Text Formatting -->
                                  <button 
                                      @click="editor.chain().focus().toggleBold().run()"
                                      :class="{ 'bg-gray-100': editor?.isActive('bold') }"
                                      class="p-2 hover:bg-gray-100 rounded"
                                      title="Bold (Ctrl+B)"
                                  >
                                      <i class="fa-solid fa-bold w-4 h-4"></i>
                                  </button>
                                  <button 
                                      @click="editor.chain().focus().toggleItalic().run()"
                                      :class="{ 'bg-gray-100': editor?.isActive('italic') }"
                                      class="p-2 hover:bg-gray-100 rounded"
                                      title="Italic (Ctrl+I)"
                                  >
                                      <i class="fa-solid fa-italic w-4 h-4"></i>
                                  </button>
                                  <button 
                                      @click="editor.chain().focus().toggleUnderline().run()"
                                      :class="{ 'bg-gray-100': editor?.isActive('underline') }"
                                      class="p-2 hover:bg-gray-100 rounded"
                                      title="Underline (Ctrl+U)"
                                  >
                                      <i class="fa-solid fa-underline w-4 h-4"></i>
                                  </button>

                                  <!-- Headings Dropdown -->
                                  <select 
                                      @change="e => updateHeading(e.target.value)"
                                      :value="currentHeadingLevel"
                                      class="p-2 hover:bg-gray-100 rounded"
                                      title="Heading style"
                                      >
                                      <option value="">Normal</option>
                                      <option value="1">Heading 1</option>
                                      <option value="2">Heading 2</option>
                                      <option value="3">Heading 3</option>
                                  </select>

                                  <!-- Lists -->
                                  <button 
                                      @click="editor.chain().focus().toggleBulletList().run()"
                                      :class="{ 'bg-gray-100': editor?.isActive('bulletList') }"
                                      class="p-2 hover:bg-gray-100 rounded"
                                      title="Bullet List"
                                  >
                                      <i class="fa-solid fa-list w-4 h-4"></i>
                                  </button>
                                  <button 
                                      @click="editor.chain().focus().toggleOrderedList().run()"
                                      :class="{ 'bg-gray-100': editor?.isActive('orderedList') }"
                                      class="p-2 hover:bg-gray-100 rounded"
                                      title="Numbered List"
                                  >
                                      <i class="fa-solid fa-list-ol w-4 h-4"></i>
                                  </button>
                                  <!-- Text Alignment -->
                                  <button 
                                      @click="editor.chain().focus().setTextAlign('left').run()"
                                      :class="{ 'bg-gray-100': editor?.isActive({ textAlign: 'left' }) }"
                                      class="p-2 hover:bg-gray-100 rounded"
                                      title="Align Left"
                                  >
                                      <i class="fa-solid fa-align-left w-4 h-4"></i>
                                  </button>
                                  <button 
                                      @click="editor.chain().focus().setTextAlign('center').run()"
                                      :class="{ 'bg-gray-100': editor?.isActive({ textAlign: 'center' }) }"
                                      class="p-2 hover:bg-gray-100 rounded"
                                      title="Align Center"
                                  >
                                      <i class="fa-solid fa-align-center w-4 h-4"></i>
                                  </button>
                                  <button 
                                      @click="editor.chain().focus().setTextAlign('right').run()"
                                      :class="{ 'bg-gray-100': editor?.isActive({ textAlign: 'right' }) }"
                                      class="p-2 hover:bg-gray-100 rounded"
                                      title="Align Right"
                                  >
                                      <i class="fa-solid fa-align-right w-4 h-4"></i>
                                  </button>

                                  <!-- Highlight -->
                                  <button 
                                      @click="editor.chain().focus().toggleHighlight().run()"
                                      :class="{ 'bg-gray-100': editor?.isActive('highlight') }"
                                      class="p-2 hover:bg-gray-100 rounded"
                                      title="Highlight"
                                  >
                                      <i class="fa-solid fa-highlighter w-4 h-4"></i>
                                  </button>
                              </div>

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
                      :disabled="editor?.storage.characterCount.characters() > 2000"
                    >
                        Save
                    </button>
                  </div>
                </div>
              </div>
      </div>
  </template>

 <script setup>
  import { ref, watch, nextTick, onBeforeUnmount, computed } from 'vue'
  import { useEditor, EditorContent } from '@tiptap/vue-3'
  import CharacterCount from '@tiptap/extension-character-count'
  import { extensions, editorProps } from '@/tiptap/config'

  const props = defineProps({
    modelValue: Boolean,
    editType: String,
    titleValue: String,
    bodyValue: String
  })

  const emit = defineEmits(['update:modelValue', 'update:title', 'update:body'])
  const localTitle = ref(props.titleValue)
  const CHAR_LIMIT = 1000
  const WARNING_THRESHOLD = 0.8

  const editor = useEditor({
    extensions: [
      ...extensions,
      CharacterCount.configure({
        limit: 1000
      })
    ],
    content: props.bodyValue,
    editable: false,
    editorProps
  })

  const currentHeadingLevel = computed(() => {
    return editor.value?.getAttributes('heading').level || ''
  })

  const updateHeading = (level) => {
    const lvl = parseInt(level)
    if (editor.value) {
      if (lvl) {
        editor.value.chain().focus().toggleHeading({ level: lvl }).run()
      } else {
        editor.value.chain().focus().setParagraph().run()
      }
    }
  }

  const handleKeydown = (e) => {
    if (!props.modelValue) return
    
    const focusable = [
      ...document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ].filter(el => el.offsetParent !== null) // Only visible elements
    
    if (e.key === 'Tab') {
      if (focusable.length === 0) {
        e.preventDefault()
        return
      }
      
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      
      if (e.shiftKey && document.activeElement === first) {
        last.focus()
        e.preventDefault()
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus()
        e.preventDefault()
      }
    }
    
    if (e.key === 'Escape') {
      cancelEdit()
    }
  }

  watch(() => props.modelValue, (show) => {
    if (show) {
      window.addEventListener('keydown', handleKeydown)
    } else {
      window.removeEventListener('keydown', handleKeydown)
    }
  })

  watch(() => props.modelValue, (show) => {
    if (show) {
      document.body.classList.add('overflow-hidden')
      // Focus first interactive element
      if (props.editType === 'title') {
        document.querySelector('input')?.focus()
      } else {
        editor.value?.commands.focus()
      }
    } else {
      document.body.classList.remove('overflow-hidden')
    }
  })


  watch(() => props.modelValue, (show) => {
    if (show) {
      nextTick(() => {
        if (props.editType === 'body' && editor.value) {
          editor.value.commands.setContent(props.bodyValue)
          editor.value.setEditable(true)
          setTimeout(() => {
            editor.value.commands.focus()
            editor.value.commands.scrollIntoView()
          }, 100)
        }
      })
    } else if (editor.value) {
      editor.value.setEditable(false)
    }
  })

  watch(() => props.bodyValue, (newContent) => {
    if (props.editType === 'body' && editor.value?.isEditable && newContent !== editor.value.getHTML()) {
      editor.value.commands.setContent(newContent)
    }
  })

  const cancelEdit = () => {
    emit('update:modelValue', false)
    if (props.editType === 'body' && editor.value) {
      editor.value.commands.setContent(props.bodyValue)
    }
  }

  const saveEdit = () => {
    try {
      if (props.editType === 'title') {
        emit('update:title', localTitle.value)
      } else if (editor.value && !isAtLimit.value) {
        const html = editor.value.getHTML()

        const isEmpty = html === '<p></p>' || 
                     html === '<ul></ul>' || 
                     html === '<ol></ol>' || 
                     /^<([a-z]+)[^>]*>\s*<\/\1>$/.test(html)

        emit('update:body', isEmpty ? '' : html)
      }
      emit('update:modelValue', false)
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  const isNearLimit = computed(() => {
    const charCount = editor.value?.storage.characterCount.characters() || 0
    return charCount >= CHAR_LIMIT * WARNING_THRESHOLD
  })

  const isAtLimit = computed(() => {
    const charCount = editor.value?.storage.characterCount.characters() || 0
    return charCount >= CHAR_LIMIT
  })

  const characterLimitTitle = computed(() => {
    if (isAtLimit.value) {
      return 'Character limit reached'
    }
    if (isNearLimit.value) {
      return 'Approaching character limit'
    }
    return ''
  })

  onBeforeUnmount(() => {
    if (editor.value) {
      editor.value.destroy()
    }
  })
  </script>

<style scoped>
  .text-sm {
    transition: color 0.2s ease-in-out;
  }
</style>