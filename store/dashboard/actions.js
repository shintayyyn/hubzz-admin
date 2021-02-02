export default {
  async initializeDashboardListener ({ commit, getters }, ) {
    this.$socket.on('Update Dashboard', async () => {
      const params = await getters.getFilters
      commit("TOGGLE_LOADING", true)
      Promise.all([
        this.$axios.$get(`/api/v1/admin/locum-registrations`, { params }),
        this.$axios.$get(`/api/v1/admin/practice-registrations`, { params }),
        this.$axios.$get(`/api/v1/admin/successful-referrals`, { params }),
        this.$axios.$get(`/api/v1/admin/billings-counts`, { params }),
        this.$axios.$get(`/api/v1/admin/locum-counts`, { params }),
        this.$axios.$get(`/api/v1/admin/practice-counts`, { params }),
        this.$axios.$get(`/api/v1/admin/job-counts`, { params }),
        this.$axios.$get(`/api/v1/admin/disputes-counts`, { params })
      ]).then(responses => {
        const [
          locumRegistrations, 
          practiceRegistrations, 
          successfulReferrals, 
          billingCounts, 
          locumCounts,
          practiceCounts, 
          jobCounts, 
          disputeCounts,
        ] = responses
        
        commit('SET_LOCUM_SIGN_UPS', locumRegistrations.data.locum_registrations)
        commit('SET_PRACTICE_SIGN_UPS', practiceRegistrations.data.practice_registrations)
        commit('SET_SUCCESSFUL_REFERRALS', successfulReferrals.data.successful_referrals)
        commit('SET_BILLING_TOTALS', billingCounts.data.all_billings)
        commit('SET_LOCUMS_IN_PLATFORM', locumCounts.data.all_locums)
        commit('SET_PRACTICES_IN_PLATFORM', practiceCounts.data.all_practices)
        commit('SET_JOBS_IN_PLATFORM', jobCounts.data.all_jobs)
        commit('SET_JOB_DISPUTES', disputeCounts.data.all_disputes)
        commit("TOGGLE_LOADING", false)
      }).catch(() => {
        commit("TOGGLE_LOADING", false)
      })
    })
  },

  async fetchLocumRegistrations ({ commit }, payload) {
    const params = payload
    commit('SET_FILTERS', payload)
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
    const response = await this.$axios.$get(`/api/v1/admin/hubzz-billings-counts`, { params })
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