import * as practiceApi from '@/api/practices'
export default{
    
    async fetchPractices({ commit },payload){
        const response = await practiceApi.fetchPractices(this.$axios, payload)  
        if(payload.countOnly){
            return commit('SET_PRACTICE_COUNT',response.data.count)
        }
        return commit('SET_PRACTICES',response.data.practices)
    }
}