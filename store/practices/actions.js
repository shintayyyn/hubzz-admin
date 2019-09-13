import * as practiceApi from '@/api/practices'
export default{
    async initializePracticeTransactionListener({state, commit}){
        this.$socket.on("createdPractice",  payload => {
            commit('ADD_PRACTICE', payload.payload.practice)
            commit('ADD_PRACTICE_USER', payload.payload.user)
        }),
        this.$socket.on("updatedPractice", practice => {
            commit('UPDATE_PRACTICE', practice)
        }),
        this.$socket.on("updatedPracticeRates", practice=> {
            commit('UPDATE_PRACTICE', practice)
        }),
        this.$socket.on("deletePractice", practice => {
            commit('DELETE_PRACTICE', practice)
        })

        this.$socket.on("createdPracticeDocument", practiceDocument => {
            commit('ADD_PRACTICE_DOCUMENT', practiceDocument)
        }),
        this.$socket.on("updatedPracticeDocument", practiceDocument => {
            commit('UPDATE_PRACTICE_DOCUMENT', practiceDocument)
        }),
        this.$socket.on("deletedPracticeDocument", practiceDocument => {
            commit('DELETE_PRACTICE_DOCUMENT', practiceDocument)
        })

        this.$socket.on("updatePracticeType", practice => {
            commit('UPDATE_PRACTICE', practice)
        })

        this.$socket.on("createdPracticeUser", user => {
            commit('ADD_PRACTICE_USER', user)
        })
        this.$socket.on("updatedPracticeUser", user => {
            commit('UPDATE_PRACTICE_USER', user)
        })
        this.$socket.on("deletedPracticeUser",user => {
            commit('DELETE_PRACTICE_USER', user)
        })

    },
    async fetchPractices({ commit }, payload){
        commit('TOGGLE_LOADING',true)
        const response = await practiceApi.fetchPractices(this.$axios, payload)
        commit('TOGGLE_LOADING',false)  
        if(payload.countOnly){
            return commit('SET_PRACTICE_COUNT',response.data.count)
        }
        return commit('SET_PRACTICES',response.data.practices)
    },

    async fetchSpecificPractice({ commit }, payload){
        commit('TOGGLE_LOADING',true)
        const response = await practiceApi.fetchSpecificPractice(this.$axios, payload)
        commit('TOGGLE_LOADING', false)
        return commit('SET_SPECIFIC_PRACTICE', response.data.practice)
    },
    
    async fetchHub({ commit }, payload){
        commit('TOGGLE_LOADING',true)
        const response = await practiceApi.fetchHub(this.$axios, payload)
        commit('TOGGLE_LOADING',false)
        return commit('SET_PRACTICE_HUB', response.data.practice)
    },

    async fetchPracticeParent({ commit }, payload){
        commit('TOGGLE_LOADING',true)
        const response = await practiceApi.fetchPracticeParent(this.$axios, payload)
        commit('TOGGLE_LOADING',false)
        return commit('SET_PRACTICE_PARENT',response.data.practice)
    },

    async fetchSpokes({ commit }, payload){
        commit('TOGGLE_LOADING',true)
        const response = await practiceApi.fetchSpokes(this.$axios, payload)
        commit('TOGGLE_LOADING',false)
        console.log(payload.countOnly ? payload.countOnly : 'not found')
        if(payload.countOnly){
            return commit('SET_PRACTICE_SPOKES_COUNT', response.data.count)
        }
        return commit ('SET_PRACTICE_SPOKES',response.data.practice_surgeries)
    },

    async updateSpokesPageCount({ commit }, payload){
        return commit('UPDATE_PRACTICE_SPOKES_PAGE_COUNT',payload) 
    },

    async fetchPracticeUsers({ commit }, payload){
        commit('TOGGLE_LOADING',true)
        const response = await practiceApi.fetchPracticeUsers(this.$axios, payload)
        commit('TOGGLE_LOADING',false)
        if(payload.countOnly){
            return commit('SET_PRACTICE_USERS_COUNT', response.data.count)
        }
        return commit('SET_PRACTICE_USERS', response.data.users)
    }
}