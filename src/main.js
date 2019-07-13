import Vue from 'vue'
import App from './App.vue'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import BootstrapVue from 'bootstrap-vue'

import _ from 'lodash';


import { library } from '@fortawesome/fontawesome-svg-core'
import { faChessRook, faChessQueen, faChessPawn, faChessKnight, faChessKing, faChessBishop, faSquareFull, faCircle} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

library.add(faChessRook, faChessQueen, faChessPawn, faChessKnight, faChessKing, faChessBishop, faSquareFull, faCircle)

Vue.component('font-awesome-icon', FontAwesomeIcon)

Vue.config.productionTip = false

Vue.use(BootstrapVue);

new Vue({
  el: '#app',
  components: { App },
  template: "<App/>"
})
