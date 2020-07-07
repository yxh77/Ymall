// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

import VueLazyload from 'vue-lazyload' //vue图片懒加载插件
import infiniteScroll from  'vue-infinite-scroll' //无限滚动插件
import {currency} from './util/currency' //用于转化货币格式

import './icons/index'

/* 资源文件 */
import './assets/css/base.css'
import './assets/css/checkout.css'
import './assets/css/login.css'
import './assets/css/product.css'
import './assets/css/animation.css'
import './assets/css/font.css'
import './assets/css/yxh.css'

Vue.use(infiniteScroll);
Vue.use(VueLazyload, {
    loading: 'static/loading-svg/loading-bars.svg',
    // try: 3 // default 1
});

Vue.config.productionTip = false;

/*const store = new Vuex.Store({
    
});*/

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});
