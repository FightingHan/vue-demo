import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import TreeTable from "vue-table-with-tree-grid"


Vue.prototype.$http = axios;
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/';

//请求拦截器，每次请求前会调用该函数进行请求的拦截
//相当于一个预处理的过程，预处理我们的请求
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config;

})
Vue.component('tree-table', TreeTable)
Vue.config.productionTip = false

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')