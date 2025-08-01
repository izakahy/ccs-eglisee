import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from '@/views/Post/PostView.vue'
import CreateView from '@/views/Post/CreateView.vue'
import ShowView from '@/views/Post/ShowView.vue'
import UpdateView from '@/views/Post/UpdateView.vue'
import AuthView from '@/views/AuthView.vue'
import Callback from '@/components/Callback.vue'
import NotFoundView from '@/views/NotFoundView.vue'
import { useNavigationStore } from '@/stores/NavItems/Navigation'
import i18n from '@/language/i18n'
import { watch } from 'vue'

export function updateDocumentTitle(route) {
  const baseTitle = 'Communauté De La Compassion, Shediac';
  const navStore = useNavigationStore();
  
  let pageTitle = '';

  if (route.meta.isDynamic) {
    const sectionKey = Object.keys(navStore.routes).find(key => 
      route.path.startsWith(`/${key}`)
    );
    
    if (sectionKey) {
      const section = navStore.routes[sectionKey];
      const item = section?.items?.find(item => item.path === route.path);
      
      pageTitle = item?.translatedLabel || section?.translatedLabel || '';
    }
  } else {
    const titleKey = route.meta.title ? `navigation.${route.meta.title}` : '';
    pageTitle = titleKey && i18n.global.te(titleKey) 
      ? i18n.global.t(titleKey)
      : route.meta.title || '';
  }

  document.title = `${pageTitle} ${pageTitle ? '|' : ''} ${baseTitle}`;
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: AuthView,
      meta: { title: 'Login' }
    },
    {
      path: '/auth/callback',
      name: 'callback',
      component: Callback,
      meta: { title: 'Callback' }
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostView,
      meta: { title: 'Posts' }
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView,
      meta: { title: 'Create' }
    },
    {
      path: '/show/:id',
      name: 'show',
      component: ShowView,
      meta: { title: 'Show' }
    },
    {
      path: '/post/update/:id',
      name: 'update',
      component: UpdateView,
      meta: { title: 'Update' }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView,
      meta: { title: 'Not Found' }
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const navStore = useNavigationStore();
  await navStore.getSection();
  
  // Update the document title
  updateDocumentTitle(to);
  
  next();
});

router.onError((error, to) => {
  console.error('Navigation error:', error);
  if (error.name && error.name.includes('NavigationFailure')) {
    router.push({ name: 'notFound' });
  }
});

let isInitialized = false;

export async function initializeRouter() {
  const navigationStore = useNavigationStore();
  
  router.beforeEach(async (to, from, next) => {
    try {
      if (!isInitialized) {
        await navigationStore.getSection();
        addDynamicRoutes();
        isInitialized = true;
        next(to.fullPath);
      } else {
        next();
      }
    } catch (error) {
      console.error('Navigation guard error:', error);
      if (to.name !== 'notFound') {
        next({ name: 'notFound' });
      } else {
        next();
      }
    }
  });
}

export function addDynamicRoutes() {
  const navigationStore = useNavigationStore();
  
  router.getRoutes().forEach(route => {
    if (route.meta?.isDynamic && route.name) {
      router.removeRoute(route.name);
    }
  });
  
  const dynamicRoutes = navigationStore.getRouteConfig.map((route) => ({
    ...route,
    meta: {
      ...route.meta,
      isDynamic: true
    }
  }));
    
  dynamicRoutes.forEach(route => {
    router.addRoute(route);
  });
}

router.onError((error) => {
  console.error('Navigation Error:', error);
  router.push({ name: 'notFound' });
});

export default router