import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    children:[
      {
        path: '/article/ArticleAddNewView.vue',
        name: '',

        component: () => import(/* webpackChunkName: "about" */ '../views/article/ArticleAddNewView.vue')
      },
      {
        path: '/user/UserListView.vue',
        name: '',

        component: () => import(/* webpackChunkName: "about" */ '../views/user/UserListView.vue')
      },
    ]
  },
  {
    path: '/about',
    name: 'about',

    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/xxx',
    name: 'about',

    component: () => import(/* webpackChunkName: "about" */ '../views/xxx.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
