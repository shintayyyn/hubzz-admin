export default {
  async initializeDashboardListener ({ commit }) {
    this.$socket.on('Update Dashboard', async () => {
      let response = await this.$axios.$get(`/api/v1/admin/locum-registrations`)
      commit('SET_LOCUM_SIGN_UPS', response.data.locum_registrations)
      response = await this.$axios.$get(`/api/v1/admin/practice-registrations`)
      commit('SET_PRACTICE_SIGN_UPS', response.data.practice_registrations)
      response = await this.$axios.$get(`/api/v1/admin/successful-referrals`)
      commit('SET_SUCCESSFUL_REFERRALS', response.data.successful_referrals)
      response = await this.$axios.$get(`/api/v1/admin/billings-counts`)
      commit('SET_BILLING_TOTALS', response.data.all_billings)
      response = await this.$axios.$get(`/api/v1/admin/locum-counts`)
      commit('SET_LOCUMS_IN_PLATFORM', response.data.all_locums)
      response = await this.$axios.$get(`/api/v1/admin/job-counts`)
      commit('SET_JOBS_IN_PLATFORM', response.data.all_jobs)
      response = await this.$axios.$get(`/api/v1/admin/disputes-counts`)
      commit('SET_JOB_DISPUTES', response.data.all_disputes)
    })
  },

  async fetchLocumRegistrations ({ commit }, payload) {
    const params = payload
    const response = await this.$axios.$get(`/api/v1/admin/locum-registrations`, { params })
    return commit('SET_LOCUM_SIGN_UPS', response.data.locum_registrations)
  },

  async fetchPracticeRegistrations ({ commit }, payload) {
    const params = payload
    const response = await this.$axios.$get(`/api/v1/admin/practice-registrations`, { params })
    return commit('SET_PRACTICE_SIGN_UPS', response.data.practice_registrations)
  },

  async fetchSuccessfulReferrals ({ commit }, payload) {
    const params = payload
    const response = await this.$axios.$get(`/api/v1/admin/successful-referrals`, { params })
    return commit('SET_SUCCESSFUL_REFERRALS', response.data.successful_referrals)
  },

  async fetchBillingTotals ({ commit }, payload) {
    const params = payload
    const response = await this.$axios.$get(`/api/v1/admin/billings-counts`, { params })
    return commit('SET_BILLING_TOTALS', response.data.all_billings)
  },

  async fetchLocumsInPlatform ({ commit }, payload) {
    const params = payload
    const response = await this.$axios.$get(`/api/v1/admin/locum-counts`, { params })
    return commit('SET_LOCUMS_IN_PLATFORM', response.data.all_locums)
  },

  async fetchPracticesInPlatform ({ commit }, payload) {
    const params = payload
    const response = await this.$axios.$get(`/api/v1/admin/practice-counts`, { params })
    return commit('SET_PRACTICES_IN_PLATFORM', response.data.all_practices)
  },

  async fetchJobsInPlatform ({ commit }, payload) {
    const params = payload
    const response = await this.$axios.$get(`/api/v1/admin/job-counts`, { params })
    return commit('SET_JOBS_IN_PLATFORM', response.data.all_jobs)
  },

  async fetchDisputes ({ commit }, payload) {
    const params = payload
    const response = await this.$axios.$get(`/api/v1/admin/disputes-counts`, { params })
    return commit('SET_JOB_DISPUTES', response.data.all_disputes)
  }
} 