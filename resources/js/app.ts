import "./bootstrap"
import Vue from "vue"
import router from './router'
import store from './store/index'
import ExampleComponent from "./components/ExampleComponent.vue"

Vue.component('example', ExampleComponent)

new Vue({
    el: '#app',
    router,
    store
})