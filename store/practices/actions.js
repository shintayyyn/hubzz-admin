import * as practiceApi from '@/api/practices'
import { fetchHub, fetchPracticeParent, fetchPracticeUsers } from '../../api/practices';
export default{
    
    async fetchPractices({ commit },payload){
        commit('TOGGLE_LOADING',true)
        const response = await practiceApi.fetchPractices(this.$axios, payload)
        commit('TOGGLE_LOADING',false)  
        if(payload.countOnly){
            return commit('SET_PRACTICE_COUNT',response.data.count)
        }
        return commit('SET_PRACTICES',response.data.practices)
    },

    async fetchHub({ commit }, payload){
        commit('TOGGLE_LOADING',true)
        const response = await practiceApi.fetchHub(this.$axios, payload)
        commit('TOGGLE_LOADING',false)
        return commit('SET_PRACTICE_HUB', response.data.practice)
    },
    async fetchPracticeParent({ commit },payload){
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