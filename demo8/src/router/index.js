import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import GoodsList from './../views/GoodsList.vue'
import Cart from './../views/Cart.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: GoodsList
    },
    {
      path:'/cart',
      name:'Cart',
      component:Cart
    }
  ]
})
