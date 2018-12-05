import Vue from "vue"
import VueRouter from "vue-router"
import IndexPage from "./views/index.vue"

Vue.use(VueRouter)

export default new VueRouter({
    mode: 'history',

    routes: [
        {
            path: '/',
            name: 'index',
            component: IndexPage
        }
    ]
})