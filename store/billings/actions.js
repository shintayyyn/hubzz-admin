import * as billingApi from '@/api/billings'
export default{
  async fetchHubzzInvoices ({ commit }, payload){
    commit('TOGGLE_LOADING', true)
    const response = await billingApi.fetchHubzzInvoices(this.$axios, payload)
    commit('TOGGLE_LOADING', false)
    if(payload.countOnly){
      return commit ('SET_HUBZZ_INVOICES_COUNT', response.data.count)
    }
    return commit ('SET_HUBZZ_INVOICES', response.data.practice_invoices)
  },

  async fetchPracticeInvoices ({ commit }, payload){
    commit('TOGGLE_LOADING', true)
    const response = await billingApi.fetchPracticeInvoices(this.$axios, payload)
    commit('TOGGLE_LOADING', false)
    if(payload.countOnly){
      return commit ('SET_PRACTICE_INVOICES_COUNT', response.data.count)
    }
    return commit('SET_PRACTICE_INVOICES', response.data.locum_invoices)
  },

  async fetchBillablePractices ({ commit }, payload) {
    commit('TOGGLE_LOADING_FOR_BILLABLE_PRACTICES', true)
    const response = await billingApi.fetchBillablePractices(this.$axios, payload)
    commit('TOGGLE_LOADING_FOR_BILLABLE_PRACTICES', false)
    if (payload.countOnly) {
      return commit('SET_BILLABLE_PRACTICES_COUNT', response.data.count)
    }
    return commit('SET_BILLABLE_PRACTICES', response.data.practices)
  },
}