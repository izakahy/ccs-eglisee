import { defineStore } from "pinia";
import { api } from "./Auth";

const body = `Lorem ipsum dolor sit amet consectetur. Vitae vitae amet nunc orci sit pharetra adipiscing aenean. Non at aliquam cursus feugiat dapibus suspendisse leo risus tempor. Sem scelerisque urna sapien vel venenatis dolor elit ut id. Vulputate vel luctus iaculis pretium sem eget feugiat.`

export const useContentStore = defineStore('content', {
  state: () => ({
    cards: {
      card1: { title: 'Title', body, isLoading: false },
      card2: { title: 'Title', body, isLoading: false },
      card3: { title: 'Title', body, isLoading: false }
    },
    allContent: [],
    pageCount: {},
    errors: [],
    isEditing: false,
    isLoading: false,
    isAuthenticated: false,
    pageContent: {},
    lastFetch: null
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
              ...this.cards[cardId],
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
      // Set loading state for only this card
      this.cards[id] = {
        ...this.cards[id],
        isLoading: true
      };
      
      try {
        // Find the content ID from allContent that corresponds to this card
        const cardIndex = parseInt(id.replace('card', '')) - 1;
        const content = this.allContent[cardIndex];
        
        // Update the local card immediately for better UI feedback
        this.cards[id].title = newTitle;

        if (!content) {
          // Content doesn't exist yet, create it
          const newContent = {
            title: newTitle,
            body: this.cards[id].body || ''
          };
          
          const response = await api.post('/api/contents', newContent);
          
          // Add the new content to allContent with the ID from the response
          this.allContent[cardIndex] = response.data;
        } else {
          const response = await api.put(`/api/contents/${content.id}`, {
            title: newTitle,
            body: this.cards[id].body
          });
          
          // Update the content in allContent
          this.allContent[cardIndex].title = newTitle;
        }
        
        return true;
      } catch (error) {
        this.errors = error.response?.data?.message || 'Failed to update title';
        throw new Error(this.errors);
      } finally {
        // Reset loading state for this card only
        this.cards[id] = {
          ...this.cards[id],
          isLoading: false
        };
      }
    },

    async updateBody(id, newBody) {
      // Set loading state for only this card
      this.cards[id] = {
        ...this.cards[id],
        isLoading: true
      };
      
      try {
        // Find the content ID from allContent that corresponds to this card
        const cardIndex = parseInt(id.replace('card', '')) - 1;
        const content = this.allContent[cardIndex];
        
        // Update the local card immediately for better UI feedback
        this.cards[id].body = newBody;
        
        if (!content) {
          // Content doesn't exist yet, create it
          const newContent = {
            title: this.cards[id].title || '',
            body: newBody
          };
          
          const response = await api.post('/api/contents', newContent);
          
          // Add the new content to allContent with the ID from the response
          this.allContent[cardIndex] = response.data;
        } else {
          // Content exists, update it
          await api.put(`/api/contents/${content.id}`, {
            title: this.cards[id].title,
            body: newBody
          });
          
          // Update the content in allContent
          this.allContent[cardIndex].body = newBody;
        }
        
        return true;
      } catch (error) {
        this.errors = error.response?.data?.message || 'Failed to update body';
        throw new Error(this.errors);
      } finally {
        // Reset loading state for this card only
        this.cards[id] = {
          ...this.cards[id],
          isLoading: false
        };
      }
    },

    async loadPageContent() {
      this.isLoading = true;
      const cacheKey = 'pageContent';
      const cacheTime = 5 * 60 * 1000; // 5min
      const now = Date.now();

      try {
        // Check localStorage cache first
        const cachedData = localStorage.getItem(cacheKey);
        const cachedTimestamp = localStorage.getItem(`${cacheKey}_timestamp`);

        if (cachedData && cachedTimestamp && (now - parseInt(cachedTimestamp) < cacheTime)) {
          // Use cached data if it’s fresh
          this.pageContent = JSON.parse(cachedData);
          this.lastFetch = parseInt(cachedTimestamp);
        } else {
          // Fetch from API if cache is stale or missing
          const response = await api.get('/api/page-contents');
          const pageData = {};
          response.data.forEach(item => {
            pageData[item.path] = item.content;
          });
          this.pageContent = pageData;
          this.lastFetch = now;

          // Update cache
          localStorage.setItem(cacheKey, JSON.stringify(this.pageContent));
          localStorage.setItem(`${cacheKey}_timestamp`, now.toString());
        }
      } catch (error) {
        console.error('Failed to load page content:', error);
        this.errors = error.response?.data?.message || 'Failed to load page content';
        // Fallback to cached data if available, even if stale
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
          this.pageContent = JSON.parse(cachedData);
        }
      } finally {
        this.isLoading = false;
      }
    },

    async saveContent(path, content) {
      debugger
      this.isLoading = true;
      try {
        // Update backend
        const response = await api.put(`/api/page-contents${path}`, { content });
        // Store the content in the format expected by the frontend
        this.pageContent[path] = content; 

        // Update cache
        const cacheKey = 'pageContent';
        localStorage.setItem(cacheKey, JSON.stringify(this.pageContent));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());

        this.errors = [];
        return true;
      } catch (error) {
        console.error('Failed to save content:', error);
        this.errors = error.response?.data?.message || 'Failed to save content';
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async deleteContent(path) {
      this.isLoading = true;
      try {
        await api.delete(`/api/page-contents${path}`);
        if (this.pageContent[path]) {
          delete this.pageContent[path];
        }

        // Update cache
        const cacheKey = 'pageContent';
        localStorage.setItem(cacheKey, JSON.stringify(this.pageContent));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());

        this.errors = [];
        return true;
      } catch (error) {
        console.error('Failed to delete content:', error);
        this.errors = error.response?.data?.message || 'Failed to delete content';
        return false;
      } finally {
        this.isLoading = false;
      }
    },

    async toggleEditMode() {
      this.isEditing = !this.isEditing;
    },

    // Optional: Fetch specific page content if not in cache
    async fetchPageContent(path) {
      try {
        const response = await api.get(`/api/page-contents${path}`);
        const content = response.data.content || '';
        this.pageContent[path] = content;
        // Update cache
        const cacheKey = 'pageContent';
        localStorage.setItem(cacheKey, JSON.stringify(this.pageContent));
        localStorage.setItem(`${cacheKey}_timestamp`, Date.now().toString());
        return content;
      } catch (error) {
        console.error(`Failed to fetch content for ${path}:`, error);
        this.errors = error.response?.data?.message || `Failed to fetch content for ${path}`;
        return '';
      }
    },

    async toggleEditMode() {
      this.isEditing = !this.isEditing;
    }
  },

  getters: {
    getPageContent: (state) => (path) => {
      return state.pageContent[path] || '';
    },
    
    // Add a getter to check if a specific card is loading
    isCardLoading: (state) => (id) => {
      return state.cards[id]?.isLoading || false;
    }
  }
});