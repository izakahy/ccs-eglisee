import { defineStore } from "pinia";

const body = `Lorem ipsum dolor sit amet consectetur. Vitae vitae amet nunc
              orci sit pharetra adipiscing aenean. Non at aliquam cursus
              feugiat dapibus suspendisse leo risus tempor. Sem scelerisque
              urna sapien vel venenatis dolor elit ut id. Vulputate vel luctus
              iaculis pretium sem eget feugiat.`

export const useContentStore = defineStore('content', {
    
    state: () => ({
        body,
        cards: {
            card1: {
                title: 'Title',
                body,
            },
            card2: {
                title: 'Title',
                body,
            },
            card3: {
                title: 'Title',
                body,
            }
        }
    }),

    actions: {
        updateTitle(id, newTitle) {
            try {
               if (this.cards[id]) {
                    this.cards[id].title = newTitle
               }
            } catch (error) {
                throw new Error(error.message)
            }
        },
        updateBody(id, newBody) {
            try {
                if (this.cards[id]) {
                    this.cards[id].body = newBody
                }
            } catch (error) {
                throw new Error(error.message)
            }
        }
    }
});