export default{
    async fetchLocums({ commit },payload){
        if(payload.status === 'Compliant'){
            return commit('SET_LOCUM_COUNT')
        }
        return commit('SET_LOCUM_USERS')
    }
}