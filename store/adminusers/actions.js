import * as adminApi from '@/api/adminusers'
export default{
    //async fetch admin users count here
    async fetchAdminUsersCount({ commit }, payload){
        const response = await adminApi.fetchAdminUsersCount(this.$axios, payload)
        return commit('SET_ADMIN_COUNT', response.data.count)
    },
    async fetchAdminUsers({ commit }, payload){
        const response = await adminApi.fetchAdminUsers(this.$axios, payload)
        return commit('SET_ADMIN_USERS', response.data.users)
    }

}