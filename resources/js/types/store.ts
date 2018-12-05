export interface RootState {
    todos: Todo[]
}

export interface Todo {
    done: boolean
    name: string
}