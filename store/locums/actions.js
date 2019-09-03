import * as locumApi from '@/api/locums'
export default{
    
    async fetchLocums({ commit },payload){
        commit('TOGGLE_LOADING',true)
        const response = await locumApi.fetchLocums(this.$axios, payload)  
        commit('TOGGLE_LOADING',false)
        if(payload.countOnly){
            return commit('SET_LOCUM_COUNT',response.data.count)
        }
        return commit('SET_LOCUM_USERS',response.data.users)
    }
}