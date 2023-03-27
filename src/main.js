import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import qs from 'qs'

Vue.prototype.axios = axios;
Vue.config.productionTip = false;
Vue.use(ElementUI);

Vue.prototype.qs = qs;



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
