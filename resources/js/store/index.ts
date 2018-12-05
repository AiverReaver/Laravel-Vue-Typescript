import Vue from "vue"
import Vuex, { StoreOptions } from "vuex"
import { RootState, Todo } from "../types/store";
import axios from "axios"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        todos: []
    },
    
    actions: {
        async fetchTodos({ commit }) {
            return commit('setTodos', await axios.get('/api/todos'))
        }
    },

    mutations: {
        setTodos(state: RootState, todos: Todo[]) {
            state.todos = todos
        }
    }
} as StoreOptions<RootState>)