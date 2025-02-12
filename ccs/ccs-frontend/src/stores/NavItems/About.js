import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

export const useAboutStore = defineStore('about', {
  state: () => ({
    items: [
      { label: 'Our Story', path: '/about/story' },
      { label: 'Mission', path: '/about/mission' },
      { label: 'Team', path: '/about/team' },
    ]
  }),
  actions: {
    addItem(item) {
      const formattedPath = item.path.startsWith('/about/') ? item.path : `/about/${item.path.replace(/^\//, '')}`;
      
      this.items.push({
        ...item,
        path: formattedPath  
      });
    },
    updateItem(index, updatedItem) {
      const formattedPath = updatedItem.path.startsWith('/about/') 
        ? updatedItem.path 
        : `/about/${updatedItem.path.replace(/^\//, '')}`
      
      this.items.splice(index, 1, {
        ...updatedItem,
        path: formattedPath
      })
    },
    deleteItem(index) {
      this.items.splice(index, 1);
    }
  }
});