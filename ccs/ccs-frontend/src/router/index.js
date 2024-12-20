import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import PostView from '@/views/Post/PostView.vue'
import CreateView from '@/views/Post/CreateView.vue'
import ShowView from '@/views/Post/ShowView.vue'
import UpdateView from '@/views/Post/UpdateView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/', // defines a route
      name: 'home',
      component: HomeView,
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
    }
  ],
})

export default router
