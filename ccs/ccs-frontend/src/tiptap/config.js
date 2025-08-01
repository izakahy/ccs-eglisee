import { StarterKit } from '@tiptap/starter-kit'
import Typography from '@tiptap/extension-typography'
import TextAlign from '@tiptap/extension-text-align'
import Highlight from '@tiptap/extension-highlight'
import Underline from '@tiptap/extension-underline'

export const extensions = [
  StarterKit.configure({
    heading: {
      levels: [1, 2, 3],
      HTMLAttributes: { class: 'heading-node' }
    },
    bulletList: {
      HTMLAttributes: { class: 'list-disc' }
    },
    orderedList: {
      HTMLAttributes: { class: 'list-decimal' }
    },
    paragraph: {
      HTMLAttributes: { class: 'paragraph-node' }
    }
  }),
  Typography,
  TextAlign.configure({
    types: ['heading', 'paragraph', 'listItem'], 
    defaultAlignment: 'left'
  }),
  Underline,
  Highlight.configure({
    multicolor: true,
    HTMLAttributes: { class: 'highlight-node' }
  })
]

export const editorProps = {
  attributes: {
    class: 'prose focus:outline-none whitespace-pre-wrap'
  }
}