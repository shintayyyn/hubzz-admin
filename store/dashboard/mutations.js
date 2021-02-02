export default {
  TOGGLE_LOADING (state, payload) {
    state.loading_dashboard = payload
  },

  SET_FILTERS (state, payload) {
    state.registered_at_date_start = payload.registered_at_date_start
    state.registered_at_date_end = payload.registered_at_date_end
    state.post_code = payload.post_code
    state.proximity = payload.proximity
  },

  SET_LOCUM_SIGN_UPS (state, payload) {
    state.locum_sign_ups = payload
  },

  CLEAR_LOCUM_SIGN_UPS (state) {
    state.locum_sign_ups = ''
  },

  SET_PRACTICE_SIGN_UPS (state, payload) {
    state.practice_sign_ups = payload
  },

  CLEAR_PRACTICE_SIGN_UPS (state) {
    state.practice_sign_ups = ''
  },

  SET_SUCCESSFUL_REFERRALS (state, payload) {
    state.successful_referrals = payload
  },

  CLEAR_SUCCESSFUL_REFERALS (state) {
    state.successful_referrals = ''
  },

  SET_BILLING_TOTALS (state, payload) {
    state.billing_totals = payload
  },

  CLEAR_BILLING_TOTALS (state) {
    state.billing_totals = ''
  },

  SET_LOCUMS_IN_PLATFORM (state, payload) {
    state.locums_in_platform = payload
  },

  CLEAR_LOCUMS_IN_PLATFORM (state) {
    state.locums_in_platform = ''
  },

  SET_PRACTICES_IN_PLATFORM (state, payload) {
    state.practices_in_platform = payload
  },

  CLEAR_PRACTICES_IN_PLATFORM (state) {
    state.practices_in_platform = ''
  },

  SET_JOBS_IN_PLATFORM (state, payload) {
    state.jobs_in_platform = payload
  },

  CLEAR_JOBS_IN_PLATFORM (state) {
    state.jobs_in_platform = ''
  },

  SET_JOB_DISPUTES (state, payload) {
    state.job_disputes = payload
  },

  CLEAR_JOB_DISPUTES (state) {
    state.job_disputes = ''
  }
}