export default {
    state: {
        page: 1,
        total: 1,
        size: 200
    },
    getters: {
        lg: state => {
            return Math.ceil(state.total / state.size)
        },
        page: state => {
            return state.page
        },
        total: state => {
            return state.total
        },
        size: state => {
            return state.size
        }
    },
    mutations: {
        render(state, data) {
            Object.assign(state, data)
        },
        next(state) {
            if (state.page < state.total / state.size) {
                state.page++
            }
        },
        goto(state, val) {
            state.page = val
        },
        prev(state) {
            if (state.page > 1) {
                state.page--
            }
        }
    }
}

