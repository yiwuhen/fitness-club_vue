import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: '后台管理页面',
    component: HomeView,
    children:[
      {
        path: '/article/ArticleListView.vue',
        name: '文章列表',

        component: () => import(/* webpackChunkName: "about" */ '../views/article/ArticleListView.vue')
      },
      {
        path: '/article/ArticleUpdateView.vue',
        name: '文章修改',

        component: () => import(/* webpackChunkName: "about" */ '../views/article/ArticleUpdateView.vue')
      },
      {
        path: '/article/ArticleAddNewView.vue',
        name: '文章发布',

        component: () => import(/* webpackChunkName: "about" */ '../views/article/ArticleAddNewView.vue')
      },
      {
        path: '/category/CategoryListView.vue',
        name: '类别列表',

        component: () => import(/* webpackChunkName: "about" */ '../views/category/CategoryListView.vue')
      },
      {
        path: '/category/CategoryAddNewView.vue',
        name: '类别列表',

        component: () => import(/* webpackChunkName: "about" */ '../views/category/CategoryAddNewView')
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
