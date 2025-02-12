import { defineStore } from "pinia";
import { api } from "./Auth";

const body = `Lorem ipsum dolor sit amet consectetur. Vitae vitae amet nunc
              orci sit pharetra adipiscing aenean. Non at aliquam cursus
              feugiat dapibus suspendisse leo risus tempor. Sem scelerisque
              urna sapien vel venenatis dolor elit ut id. Vulputate vel luctus
              iaculis pretium sem eget feugiat.`

export const useContentStore = defineStore('content', {
    
    state: () => ({
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
        },
        allContent: [],
        isLoading: false,
        errors: []
    }),

    actions: {
        async getContent() {
            this.isLoading = true;
            try {
                const res = await api.get('/api/contents');
                this.allContent = res.data;

                // Map the first three contents to cards
                res.data.forEach((content, index) => {
                    const cardId = `card${index + 1}`;
                    if (this.cards[cardId]) {
                        this.cards[cardId] = {
                            title: content.title,
                            body: content.body
                        };
                    }
                });

                this.errors = [];
            } catch (error) {
                this.errors = error.response?.data?.message || 'Failed to fetch contents';
            } finally {
                this.isLoading = false;
            }
        },
        async updateTitle(id, newTitle) {
            this.isLoading = true;
            try {
                // Find the content ID from allContent that corresponds to this card
                const cardIndex = parseInt(id.replace('card', '')) - 1;
                const content = this.allContent[cardIndex];
                
                if (!content) throw new Error('Content not found');
                
                    
                // Make API call to update the title
                await api.put(`/api/contents/${content.id}`, {
                    title: newTitle,
                    body: this.cards[id].body
                });
        
                // Update both the card and allContent
                this.cards[id].title = newTitle;
                this.allContent[cardIndex].title = newTitle;
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to update title');
            } finally {
                this.isLoading = false;
            }
        },
       async updateBody(id, newBody) {
            this.isLoading = true;
            try {
                // Find the content ID from allContent that corresponds to this card
                const cardIndex = parseInt(id.replace('card', '')) - 1;
                const content = this.allContent[cardIndex];
                
                if (!content) throw new Error('Content not found');
                

                // Make API call to update the body
                await api.put(`/api/contents/${content.id}`, {
                title: this.cards[id].title,
                body: newBody
                });

                // Update both the card and allContent
                this.cards[id].body = newBody;
                this.allContent[cardIndex].body = newBody;
            } catch (error) {
                throw new Error(error.response?.data?.message || 'Failed to update body');
            } finally {
                this.isLoading = false;
            }
        }
    }
});