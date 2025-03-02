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


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // defines a route
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: AuthView,
    },
    {
      path: '/auth/callback',
      name: 'callback',
      component: Callback,
    },
    {
      path: '/posts',
      name: 'posts',
      component: PostView,
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView,
    },
    {
      path: '/show/:id',
      name: 'show',
      component: ShowView,
    },
    {
      path: '/post/update/:id',
      name: 'update',
      component: UpdateView,
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFoundView
    },
  ],
})
// router.beforeEach((to, from) => {
//   document.title = to.meta?.title ?? router.routes.name
// })
router.beforeEach(async (to, from, next) => {
  const navStore = useNavigationStore();
  await navStore.getSection(); // Uses cache if valid, fetches if needed
  next();
});

router.onError((error, to) => {
  console.error('Navigation error:', error);
  if (error.name.includes('NavigationFailure')) {
    router.push({ name: 'notFound' });
  }
});

let isInitialized = false

export async function initializeRouter() {
  console.log('Setting up router');
  const navigationStore = useNavigationStore();

  router.beforeEach(async (to, from, next) => {
    try {
      if (!isInitialized) {
        // Fetch navigation data and add dynamic routes
        await navigationStore.getSection();
        addDynamicRoutes();
        isInitialized = true;
        // Re-trigger navigation to the current path to match dynamic routes
        next(to.fullPath);
      } else {
        // If already initialized, proceed normally
        next();
      }
    } catch (error) {
      console.error('Navigation guard error:', error);
      // Redirect to notFound only if not already there
      if (to.name !== 'notFound') {
        next({ name: 'notFound' });
      } else {
        next(); // Avoid infinite loops
      }
    }
  });

  console.log('Router setup complete');
}


export function addDynamicRoutes() {
  const navigationStore = useNavigationStore();
 
  // Remove existing dynamic routes
  router.getRoutes().forEach(route => {
    if (route.meta?.isDynamic && route.name) {
      router.removeRoute(route.name); // Remove by route name
    }
  });

  // Add dynamic routes to the router
  const dynamicRoutes = navigationStore.getRouteConfig;
  dynamicRoutes.forEach(route => {
    router.addRoute(route);
  });
}


router.onError((error) => {
  console.error('Navigation Error:', error);

  if (!to || to.name !== 'notFound') {
    router.push({ name: 'notFound' });
  }
});

export default router
