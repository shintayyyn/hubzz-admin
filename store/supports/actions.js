import * as supportApi from '@/api/supports'
export default{
  async fetchSupports({ commit }, payload){
    commit('TOGGLE_LOADING', true)
    const response = await supportApi.fetchInquiries(this.$axios, payload)
    commit('TOGGLE_LOADING', false)
    if(payload.countOnly) {
      return commit('SET_EMAILS_COUNT', response.data.count)
    }
    return commit('SET_EMAILS', response.data.emails)
  }
}