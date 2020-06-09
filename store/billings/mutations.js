export default{
  TOGGLE_LOADING (state, payload){
    state.loading_invoices = payload
  },
  TOGGLE_LOADING_FOR_BILLABLE_PRACTICES (state, payload){
    state.loading_billable_practices = payload
  },
  // HUBZZ INVOICES
  SET_HUBZZ_INVOICES_COUNT (state, payload){
    state.hubzz_invoices_count = payload
  },
  SET_HUBZZ_INVOICES (state, payload){
    state.hubzz_invoices = payload
  },
  // PRACTICE INVOICES
  SET_PRACTICE_INVOICES_COUNT (state, payload){
    state.practice_invoices_count = payload
  },
  SET_PRACTICE_INVOICES (state, payload){
    state.practice_invoices = payload
  },
  // BILLABLE PRACTICES
  SET_BILLABLE_PRACTICES_COUNT (state, payload){
    state.billable_practices_count = payload
  },
  SET_BILLABLE_PRACTICES (state, payload){
    state.billable_practices = payload
  },
  CLEAR_BILLABLE_PRACTICES (state) {
    state.billable_practices = []
  },
  CLEAR_BILLABLE_PRACTICES_COUNT (state) {
    state.billable_practices_count = 0
  },
}