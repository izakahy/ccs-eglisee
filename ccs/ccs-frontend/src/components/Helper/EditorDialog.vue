  <template>
      <div v-if="modelValue" class="fixed z-10 inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <h3 class="text-lg font-medium mb-4">Edit {{ editType }}</h3>
                  
                <div class="flex-1 overflow-y-auto">
                      <div v-if="editType === 'title'">
                          <input
                              v-model="localTitle"
                              type="text"
                              class="w-full p-2 border rounded mb-4"
                              maxlength="50"
                          />
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

                <div class="flex justify-end gap-2 mt-4 pt-4 border-t">
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
  </template>

  <script setup>
  import { ref, watch, nextTick, onBeforeUnmount, computed } from 'vue'
  import { useEditor, EditorContent } from '@tiptap/vue-3'
  import StarterKit from '@tiptap/starter-kit'
  import Typography from '@tiptap/extension-typography'
  import TextAlign from '@tiptap/extension-text-align'
  import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'

  const props = defineProps({
    modelValue: Boolean,
    editType: String,
    titleValue: String,
    bodyValue: String
  })

  const emit = defineEmits(['update:modelValue', 'update:title', 'update:body'])
  const localTitle = ref(props.titleValue)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Typography,
      Underline,
      TextAlign.configure({ 
        types: ['heading', 'paragraph'],
        defaultAlignment: 'left'
      }),
      Highlight.configure({ multicolor: true })
    ],
    content: props.bodyValue,
    editable: false
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
      } else if (editor.value) {
        const html = editor.value.getHTML()
        emit('update:body', html === '<p></p>' ? '' : html)
      }
      emit('update:modelValue', false)
    } catch (error) {
      console.error('Save error:', error)
    }
  }

  onBeforeUnmount(() => {
    if (editor.value) {
      editor.value.destroy()
    }
  })
  </script>

<style scoped>
  .white-space-preserve {
    white-space: pre-wrap;
  }

</style>