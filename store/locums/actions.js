import * as locumApi from '@/api/locums'
export default{
    async initializeLocumTransactionListener({state, commit}){
        this.$socket.on("updateGmcOrNmcNumberStatus",user => {
            commit('UPDATE_LOCUM_USER', user)
        })
        this.$socket.on("updateMplOrNplNumberStatus",user => {
            commit('UPDATE_LOCUM_USER', user)
        })
        this.$socket.on("updateLocumStatus",user => {
            commit('UPDATE_LOCUM_USER', user)
        })
        this.$socket.on("updateLocumComplianceDocument",async locumDetailComplianceDocument => {
            commit('UPDATE_LOCUM_DOCUMENT', locumDetailComplianceDocument)
            let params = {
                limit:8,
                order_by:'created_at:desc'
            }
            const response = await locumApi.fetchLocums(this.$axios, params)  
            if(params.countOnly){
                return commit('SET_LOCUM_COUNT',response.data.count)
            }
            return commit('SET_LOCUM_USERS',response.data.users)
            })
    },
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