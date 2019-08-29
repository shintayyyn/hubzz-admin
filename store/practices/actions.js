import * as practiceApi from '@/api/practices'
import { fetchHub, fetchPracticeParent } from '../../api/practices';
export default{
    
    async fetchPractices({ commit },payload){
        const response = await practiceApi.fetchPractices(this.$axios, payload)  
        if(payload.countOnly){
            return commit('SET_PRACTICE_COUNT',response.data.count)
        }
        return commit('SET_PRACTICES',response.data.practices)
    },
    async fetchHub({ commit }, payload){
        const response = await practiceApi.fetchHub(this.$axios, payload)
        return commit('SET_PRACTICE_HUB', response.data.practice)
    },
    async fetchPracticeParent({ commit },payload){
        const response = await practiceApi.fetchPracticeParent(this.$axios, payload)
        return commit('SET_PRACTICE_PARENT',response.data.practice)
    }
    // async fetchSpokes({ commit }, payload){
    //     const response = await practiceApi.fetchSpokes(this.$axios, payload)
    //     return commit ('')
    // }
}