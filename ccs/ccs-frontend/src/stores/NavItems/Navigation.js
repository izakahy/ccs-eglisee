import { defineStore } from "pinia";
import { markRaw } from "vue";
import DynamicPage from "@/components/Pages/DynamicPage.vue";
import { api } from "../Auth";
import i18n from "@/language/i18n";
import { addDynamicRoutes } from "@/router";

export const useNavigationStore = defineStore('navigation', {
    state: () => {
        let routes = {};
        let initialized = false;
        let lastFetch = null;
        let isLoading = false;

        // Attempt to load cached data from sessionStorage
        try {
          const savedData = sessionStorage.getItem('navigationData');
          if (savedData) {
            const parsedData = JSON.parse(savedData);
            if (parsedData.routes && parsedData.lastFetch) {
              routes = parsedData.routes;
              // Reattach the component reference since it's not serializable
              Object.values(routes).forEach(section => {
                section.component = markRaw(DynamicPage);
              });
              initialized = true;
              lastFetch = parsedData.lastFetch;
            }
          }
        } catch (error) {
          console.error('Failed to restore navigation from sessionStorage:', error);
        }

        return {
          routes,
          initialized,
          lastFetch,
          isLoading
        };
    },
    
    actions: {
        syncCache() {
          sessionStorage.setItem('navigationData', JSON.stringify({
            routes: this.serializedRoutes,
            lastFetch: this.lastFetch
          }));
        },
        async getSection() {
          this.isLoading = true;
          const now = Date.now();
          const cacheTime = 5 * 60 * 1000; // 5 minutes

          if (this.initialized && this.lastFetch && (now - this.lastFetch < cacheTime)) {
            setTimeout(() => {
              this.isLoading = false;
            }, 300)
            return this.routes;
          }

          try {
            const response = await api.get('/api/sections');
            const sectionsData = response.data;

            this.routes = {};

            Object.entries(sectionsData).forEach(([sectionKey, section]) => {
              const sectionLabel = this.translateNavItem(`navigation.${section.label}`, section.label);
              
              this.routes[sectionKey] = {
                id: section.id,
                path: `/${sectionKey}`,
                label: section.label,
                translatedLabel: sectionLabel,
                component: markRaw(DynamicPage),
                items: section.items.map(item => {
                  const itemLabel = this.translateNavItem(`items.${item.label}`, item.label);
                  
                  return {
                    id: item.id,
                    label: item.label,
                    translatedLabel: itemLabel,
                    path: item.path
                  };
                })
              };
            });

            // Update state and cache
            this.lastFetch = Date.now();
            this.initialized = true;
            this.syncCache();

            return this.routes;
          } catch (error) {
            console.error('Error fetching sections:', error);
            throw error;
          } finally {
            this.isLoading = false
          }
        },

        // Helper method to translate navigation items
        translateNavItem(key, fallback) {
          return i18n.global.te(key) ? i18n.global.t(key) : fallback;
        },

        restoreFromSession() {
          try {
            this.isLoading = true;
            const savedData = sessionStorage.getItem('navigationData');
            if (savedData) {
              const parsedData = JSON.parse(savedData);
              
              if (parsedData.routes) {
                // Restore component references for each section
                Object.values(parsedData.routes).forEach(section => {
                  section.component = markRaw(DynamicPage);
                  
                  // Ensure translations are up to date after restore
                  section.translatedLabel = this.translateNavItem(`navigation.${section.label}`, section.label);
                  
                  // Update translations for items
                  if (section.items) {
                    section.items.forEach(item => {
                      item.translatedLabel = this.translateNavItem(`items.${item.label}`, item.label);
                    });
                  }
                });
                
                this.routes = parsedData.routes;
                this.lastFetch = parsedData.lastFetch;
                this.initialized = true;
                return true;
              }
            }
            return false;
          } catch (error) {
            console.error('Failed to restore navigation from session:', error);
            return false;
          } finally {
            this.isLoading = false;
          }
        },

        async addSection(sectionKey, config) {
          this.isLoading = true;
           if (this.routes[sectionKey]) {
             this.isLoading = false;
             throw new Error(`Section ${sectionKey} already exists`)
           }

           try {
              const response = await api.post('/api/sections', {
                key: sectionKey,
                label: config.label
              });

             // Translate the section label
             const translatedLabel = this.translateNavItem(`navigation.${config.label}`, config.label);
             
             // add a new section
             this.routes[sectionKey] = {
                 id: response.data.id,
                 path: `/${sectionKey}`,
                 label: config.label,
                 translatedLabel: translatedLabel,
                 component: markRaw(config.component || DynamicPage),
                 items: []
             }
             this.syncCache();
           } catch (error) {
              console.error('Error adding section:', error);
              throw error;
           } finally {
              this.isLoading = false;
           }
        },

        async addItem(sectionKey, item) {
          this.isLoading = true;
            if (!this.routes[sectionKey]) {
              this.isLoading = false;
              throw new Error(`Section ${sectionKey} does not exist`);
            }
            
            const { isValid, path: generatedPath } = this.validateItem(sectionKey, item.label);
            if (!isValid) throw new Error('Invalid item');

           try {
            console.log("Section ID being sent:", this.routes[sectionKey].id);
             const response = await api.post('/api/items', {
                nav_section_id: this.routes[sectionKey].id,
                label: item.label,
                path: generatedPath
             });

             const fullPath = `/${sectionKey}/${generatedPath}`;
             // Translate the item label
             const translatedLabel = this.translateNavItem(`items.${item.label}`, item.label);
             
             this.routes[sectionKey].items.push({
                 id: response.data.id,
                 label: item.label,
                 translatedLabel: translatedLabel,
                 path: fullPath
             });
             this.syncCache();
           } catch (error) {
            console.error('Error adding item:', error);
            throw error;
          } finally {
            this.isLoading = false;
          }
        },
         
        async updateSection(sectionkey, updatedSection) {
          this.isLoading = true;
          const section = this.routes[sectionkey]
          console.log("This is the update section key: " + sectionkey)
          if (!section) {
            this.isLoading = false;
            throw new Error(`Section ${sectionkey} does not exist`)
          }

          try {
            await api.put(`/api/sections/${section.id}`, {
              key: sectionkey,
              label: updatedSection.label,
            })
            
            // Translate the updated section label
            const translatedLabel = this.translateNavItem(`navigation.${updatedSection.label}`, updatedSection.label);
            
            const existingItems = section.items
            this.routes[sectionkey] = {
              ...section,
              label: updatedSection.label,
              translatedLabel: translatedLabel,
              items: updatedSection.items || existingItems,
            }
            this.syncCache();
          } catch (error) {
            console.error('Error updating section:', error);
            throw error;
          } finally {
            this.isLoading = false;
          }
        },

        async updateItem(sectionKey, index, updatedItem) {
          this.isLoading = true;
          const section = this.routes[sectionKey];

          if (!section) {
            this.isLoading = false;
            throw new Error(`Section ${sectionKey} does not exist`);
          }

          const item = section.items[index]
          if (!item) {
            this.isLoading = false;
            throw new Error('Item does not exist');
          }
            
          // Generate new relative path
          const { isValid, path: generatedPath } = this.validateItemUpdate(sectionKey, index, updatedItem.label);

          if (!isValid) throw new Error('Invalid update');

          try {
            await api.put(`/api/items/${item.id}`, {
              label: updatedItem.label,
              path: generatedPath
            });

            // Translate the updated item label
            const translatedLabel = this.translateNavItem(`items.${updatedItem.label}`, updatedItem.label);
            
            // update item in state
            const fullPath = `/${sectionKey}/${generatedPath}`;
            this.routes[sectionKey].items.splice(index, 1, {
              ...item,
              label: updatedItem.label,
              translatedLabel: translatedLabel,
              path: fullPath
            });
            this.syncCache();
          } catch (error) {
            console.error('Error updating item:', error);
            throw error;
          } finally {
            this.isLoading = false;
          }
        },

        async deleteItem(sectionKey, index) {
          this.isLoading = true;
          const section = this.routes[sectionKey];

          if (!section){
            this.isLoading = false;
            throw new Error('Section not found');
          } 
            
          const item = section.items[index];
          if (!item) {
            this.isLoading = false;
            throw new Error('Item not found');
          }

          try {
              await api.delete(`/api/items/${item.id}`);

              section.items.splice(index, 1);
              this.syncCache();
          } catch (error) {
              console.error('Error deleting item:', error);
              throw error;
          } finally {
            this.isLoading = false;
          }
        },

        async deleteSection(sectionKey) {
          this.isLoading = true;
          if (!this.routes[sectionKey]) {
            this.isLoading = false;
            throw new Error(`Section ${sectionKey} does not exist`);
          }
          
          try {
            await api.delete(`/api/sections/${this.routes[sectionKey].id}`);
            delete this.routes[sectionKey];
            this.syncCache();
          } catch (error) {
            console.error('Error deleting section:', error);
            throw error;
          } finally {
            this.isLoading = false;
          }
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
              item.path.endsWith(`/${generatedPath}`)
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
        },
        
        updateTranslations() {
          Object.values(this.routes).forEach(section => {
            section.translatedLabel = this.translateNavItem(`navigation.${section.label}`, section.label);
            
            section.items.forEach(item => {
              item.translatedLabel = this.translateNavItem(`items.${item.label}`, item.label);
            });
          });
          
          this.syncCache();
          addDynamicRoutes()
        }
    },
    getters: {
        serializedRoutes(state) {
          const serializableRoutes = {};
          Object.entries(state.routes).forEach(([key, section]) => {
            serializableRoutes[key] = {
              ...section,
              component: null 
            };
          });
          return serializableRoutes;
        },
        getRouteConfig: (state) => {
            const routes = []

            Object.entries(state.routes).forEach(([key, section]) => {
                routes.push({
                    path: section.path,
                    label: key,
                    component: markRaw(section.component),
                    props: true,
                    meta: { 
                      isDynamic: true,
                      title: section.label,
                      translatedTitle: section.translatedLabel || section.label
                    }
                });

                // add sub-routes for items
                section.items.forEach(item => {
                    routes.push({
                        path: item.path,
                        name: `${key}-${item.label.toLowerCase().replace(/\s+/g, '-')}`,
                        component: markRaw(section.component),
                        props: true,
                        meta: { 
                          isDynamic: true,
                          title: item.label,
                          translatedTitle: item.translatedLabel || item.label
                        }
                    });
                });
            });

            return routes;
        }
    }
});