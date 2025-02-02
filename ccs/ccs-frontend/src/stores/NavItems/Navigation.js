import { defineStore } from "pinia";
import { markRaw } from "vue";
import DynamicPage from "@/components/Navigation/Pages/DynamicPage.vue";

export const useNavigationStore = defineStore('navigation', {
    state: () => ({
        routes: {
            about: {
                path: '/about',
                label: 'ABOUT',
                component: DynamicPage,
                items: [
                    { label: 'Our Story', path: '/about/story' },
                    { label: 'Mission', path: '/about/mission' },
                    { label: 'Team', path: '/about/team' }
                ],
            },
            connect: {
                path: '/connect',
                label: 'CONNECT',
                component: DynamicPage,
                items: [
                    {label: 'House Fellowship', path: '/connect/house-fellowship'}
                ]
            }
        }
    }),
    
    actions: {
        addSection(sectionKey, config) {
            if (this.routes[sectionKey]) {
                throw new Error(`Section ${sectionKey} already exists`)
            }

            // add a new section
            this.routes[sectionKey] = {
                path: `/${sectionKey}`,
                label: config.label,
                component: config.component || DynamicPage,
                items: []
            }
        },

        addItem(sectionKey, item) {
            if (!this.routes[sectionKey]) {
              throw new Error(`Section ${sectionKey} does not exist`);
            }
            
            const formattedPath = `/${sectionKey}/${item.path.replace(/^\//, '')}`;
            this.routes[sectionKey].items.push({
              ...item,
              path: formattedPath
          });
        },
         
        updateSection(sectionkey, updatedSection) {
          if (!this.routes[sectionkey]) {
            throw new Error(`Section ${sectionkey} does not exist`)
          }

          const existingItems = this.routes[sectionkey].items
          this.routes[sectionkey] = {
            ...updatedSection,
            items: updatedSection.items || existingItems,
            path: `/${sectionkey}`
          }
        },

        updateItem(sectionKey, index, updatedItem) {
          if (!this.routes[sectionKey]) {
            throw new Error(`Section ${sectionKey} does not exist`);
          }
            
          const formattedPath = `/${sectionKey}/${updatedItem.path.replace(/^\//, '')}`;
          this.routes[sectionKey].items.splice(index, 1, {
            ...updatedItem,
            path: formattedPath
          });
        },

        deleteItem(sectionKey, index) {
          if (!this.routes[sectionKey]) {
            throw new Error(`Section ${sectionKey} does not exist`);
          }
          this.routes[sectionKey].items.splice(index, 1);
        },

        deleteSection(sectionKey) {
          if (!this.routes[sectionKey]) {
            throw new Error(`Section ${sectionKey} does not exist`);
          }
             
          delete this.routes[sectionKey];
        },
        validateSection(sectionkey, config) {
        },
        validateItem(sectionKey, label) {
            const section = this.routes[sectionKey];
            if (!section) throw new Error('Invalid section');
            
            const generatedPath = label.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
            const fullPath = `/${sectionKey}/${generatedPath}`;
            
            const exists = section.items.some(item => 
              item.label.toLowerCase() === label.toLowerCase() || 
              item.path === fullPath
            );
            
            return { isValid: !exists, path: generatedPath };
        },
        validateItemUpdate(sectionKey, currentIndex, newLabel) {
            const section = this.routes[sectionKey];
            if (!section) throw new Error('Invalid section');
            
            const generatedPath = newLabel.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
            const fullPath = `/${sectionKey}/${generatedPath}`;
            
            const exists = section.items.some((item, index) => 
              index !== currentIndex && (
                item.label.toLowerCase() === newLabel.toLowerCase() || 
                item.path === fullPath
              )
            );
            
            return { isValid: !exists, path: generatedPath };
        }
    },

    getters: {
        getRouteConfig: (state) => {
            const routes = []

            Object.entries(state.routes).forEach(([key, section]) => {
                // add main section
                routes.push({
                    path: section.path,
                    label: key,
                    component: markRaw(section.component),
                    props: true,
                    meta: { isDynamic: true }
                });

                // add sub-routes for items
                section.items.forEach(item => {
                    routes.push({
                        path: item.path,
                        name: `${key}-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
                        component: markRaw(section.component),
                        props: true,
                        meta: { isDynamic: true }
                    });
                });
            });

            return routes;
        }
    }
});