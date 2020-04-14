import Vue from 'vue'
import App from './App.vue'
import router from "@/js/router"
import 'element-ui/lib/theme-chalk/index.css';
import ElementUI from 'element-ui';
import "@/css/common.css"

Vue.use(ElementUI);
Vue.config.devtools = true;
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
