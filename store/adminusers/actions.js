import * as adminApi from '@/api/adminusers'
export default{
    
    async fetchAdminUsersCount({ commit }, payload) {
      const response = await adminApi.fetchAdminUsersCount(this.$axios, payload)
      return commit('SET_ADMIN_COUNT', response.data.count)
    },
    async fetchAdminUsers({ commit }, payload){
      const response = await adminApi.fetchAdminUsers(this.$axios, payload)
      return commit('SET_ADMIN_USERS', response.data.users)
    },
    async fetchAdminRoles({ commit }, payload) {
      const response = await adminApi.fetchAdminRoles(this.$axios, payload)
      return commit('SET_ADMIN_ROLES', response.data.roles)
    },
    async initializeAdminTransactionListener({state,commit}){
      this.$socket.on("createdAdminAccount",user => {
        commit('ADD_ADMIN_USER', user)
      })
      
      this.$socket.on("updatedAdminAccount",user => {
        commit('UPDATE_ADMIN_USER', user)
      });

      this.$socket.on("toDeleteAdminAccount",user => {
        commit('DELETE_ADMIN_USER', user)
      })
    }
}