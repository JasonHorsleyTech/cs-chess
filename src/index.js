import Vue from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'

import _ from 'lodash';

Vue.use(BootstrapVue);

new Vue({
  el: '#app',
  render: h => h(App)
})
