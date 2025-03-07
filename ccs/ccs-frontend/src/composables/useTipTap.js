import { ref, onBeforeUnmount, nextTick } from "vue";
import { Editor } from "@tiptap/vue-3";
import Image from "@tiptap/extension-image";
import CharacterCount from "@tiptap/extension-character-count";
import { extensions, editorProps } from "@/tiptap/config";

export function useTipTap(options = {}) {
    const {
        content = "",
        onUpdate = null,
        withImage = false,
        withCharCount = false,
        charLimit = 1000,
        editable = true,
    } = options;

    const editorExtensions = [...extensions];

    if (withImage) {
        editorExtensions.push(
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: {
                    class: 'uploaded-image',
                }
            })
        );
    }

    if (withCharCount) {
        editorExtensions.push(
            CharacterCount.configure({
                limit: charLimit,
            })
        );
    }

    let editorInstance = null;

    const initEditor = () => {
        if (editorInstance) {
            editorInstance.destroy();
        }

        const editorConfig = {
            content,
            extensions: editorExtensions,
            editorProps,
            editable
        };

        // Only add onUpdate if provided
        if (typeof onUpdate === 'function') {
            editorConfig.onUpdate = ({ editor }) => onUpdate(editor);
        }

        editorInstance = new Editor(editorConfig);

        return editorInstance;
    };

    const destroyEditor = () => {
        if (editorInstance) {
            editorInstance.destroy();
            editorInstance = null;
        }
    };

    // Common editor commands
    const focusEditor = () => {
        if (editorInstance) {
            nextTick(() => {
                editorInstance.commands.focus();
            });
        }
    };

    const setContent = (newContent) => {
        if (editorInstance && newContent !== editorInstance.getHTML()) {
            editorInstance.commands.setContent(newContent);
        }
    };

    const toggleHeading = (level) => {
        if (!editorInstance) return;

        const lvl = parseInt(level);
        if (lvl) {
            editorInstance.chain().focus().toggleHeading({ level: lvl }).run();
        } else {
            editorInstance.chain().focus().setParagraph().run();
        }
    };

    const getCurrentHeadingLevel = () => {
        return editorInstance?.getAttributes("heading").level || "";
    };

    // Clean up
    // onBeforeUnmount(() => {
    //     destroyEditor();
    // });

    return {
        editorInstance,
        initEditor,
        focusEditor,
        setContent,
        toggleHeading,
        getCurrentHeadingLevel,
    };
}