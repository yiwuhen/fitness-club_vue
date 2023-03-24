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
        path: '/article/ArticleListView.vue',
        name: 'articleList',

        component: () => import(/* webpackChunkName: "about" */ '../views/article/ArticleListView.vue')
      },
      {
        path: '/article/ArticleUpdateView.vue',
        name: 'articleUpdate',

        component: () => import(/* webpackChunkName: "about" */ '../views/article/ArticleUpdateView.vue')
      },
      {
        path: '/article/ArticleAddNewView.vue',
        name: 'articleAddNewView',

        component: () => import(/* webpackChunkName: "about" */ '../views/article/ArticleAddNewView.vue')
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
