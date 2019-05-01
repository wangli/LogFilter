import Vue from 'vue'
import App from './App.vue'
import Vuex from 'vuex'
import Coms from './coms'
import Store from './store'

Vue.use(Vuex)

Coms.install(Vue)

Vue.config.productionTip = false

new Vue({
  store: new Vuex.Store(Store),
  render: h => h(App),
}).$mount('#app')
