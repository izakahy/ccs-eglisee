import { defineStore } from "pinia";
import { api } from "./Auth";
import { ref } from "vue";

const body = `Lorem ipsum dolor sit amet consectetur. Vitae vitae amet nunc
              orci sit pharetra adipiscing aenean. Non at aliquam cursus
              feugiat dapibus suspendisse leo risus tempor. Sem scelerisque
              urna sapien vel venenatis dolor elit ut id. Vulputate vel luctus
              iaculis pretium sem eget feugiat.`

export const useContentStore = defineStore('content', {
    
    state: () => ({
        cards: {
            card1: { title: 'Title', body },
            card2: { title: 'Title', body },
            card3: { title: 'Title', body }
        },
        allContent: [],
        pageCount: {},
        errors: [],
        isEditing: false,
        isLoading: false,
        isAuthenticated: false,
        pageContent: {}
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
                
                const response = await api.put(`/api/contents/${content.id}`, {
                    title: newTitle,
                    body: this.cards[id].body
                  });
        
                // Update both the card and allContent
                if (response.data) {
                    this.cards[id].title = newTitle;
                    this.allContent[cardIndex].title = newTitle;
                }

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
                
                await api.get('/sanctum/csrf-cookie');  
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
        },
        async loadPageContent() {
            this.isLoading = true;
            try {
              const storedContent = localStorage.getItem('pageContent');
              if (storedContent) {
                this.pageContent = JSON.parse(storedContent);
              }
            } catch (error) {
              console.error("Failed to load content: ", error);
            } finally {
              this.isLoading = false;
            }
        },
        async saveContent(path, content) {
            this.isLoading = true;
            try {
              this.pageContent[path] = content;
              localStorage.setItem('pageContent', JSON.stringify(this.pageContent));
              return true;
            } catch (error) {
              console.error('Failed to save content:', error);
              return false;
            } finally {
              this.isLoading = false;
            }
        },
        async deleteContent(path) {
            this.isLoading = true;
            try {
            if (this.pageContent[path]) {
                delete this.pageContent[path];
                localStorage.setItem('pageContent', JSON.stringify(this.pageContent));
            }
            return true;
            } catch (error) {
            console.error('Failed to delete content:', error);
            return false;
            } finally {
            this.isLoading = false;
            }
        },
        async toggleEditMode() {
           this.isEditing = !this.isEditing;
        }
    },

    getters: {
        getPageContent: (state) => (path) => {
            return state.pageContent[path] || '';
        }
    }
});