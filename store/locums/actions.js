import * as locumApi from '@/api/locums'
export default{
    
    async fetchLocums({ commit },payload){
        const response = await locumApi.fetchLocums(this.$axios, payload)  
            console.log('action is called')
            if(payload.countOnly){
                return commit('SET_LOCUM_COUNT',response.data.count)
            }
            return commit('SET_LOCUM_USERS',response.data.users)
    }
}