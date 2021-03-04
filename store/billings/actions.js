import * as billingApi from '@/api/billings'
export default{
  async fetchHubzzInvoices ({ commit }, payload){
    commit('TOGGLE_LOADING', true)
    const response = await billingApi.fetchHubzzInvoices(this.$axios, payload)
    console.log('response invoices', response)
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
    let practices = []

    const response = await billingApi.fetchBillablePractices(this.$axios, payload)

    if(!payload.countOnly) {
      response.data.practices.forEach(item => {
        const practice_invoiceable_job_parts = [
          ...item.practice_invoiceable_approved_filtered_job_parts,
        ]

        practices.push({
          ...item,
          practice_invoiceable_job_parts,
        })
      })

      if (payload.show_disputed === true) {
        practices.forEach(item => {
          item.practice_invoiceable_job_parts = [
            ...item.practice_invoiceable_disputed_filtered_job_parts,
            ...item.practice_invoiceable_job_parts,
          ]
        })
      }

      if (payload.show_cancelled === true) {
        practices.forEach(item => {
          item.practice_invoiceable_job_parts = [
            ...item.practice_invoiceable_cancelled_filtered_job_parts,
            ...item.practice_invoiceable_job_parts,
          ]
        })
      }

      if (payload.show_completed === true) {
        practices.forEach(item => {
          item.practice_invoiceable_job_parts = [
            ...item.practice_invoiceable_completed_filtered_job_parts,
            ...item.practice_invoiceable_job_parts,
          ]
        })
      }

      if (payload.show_invoiced === true) {
        practices.forEach(item => {
          item.practice_invoiceable_job_parts = [
            ...item.practice_invoiceable_invoiced_filtered_job_parts,
            ...item.practice_invoiceable_job_parts,
          ]
        })
      }
    } 

    if (payload.countOnly) {
      return commit('SET_BILLABLE_PRACTICES_COUNT', response.data.count)
    }
    
    return commit('SET_BILLABLE_PRACTICES', practices)
  },
}
