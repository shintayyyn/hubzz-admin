export default{
  TOGGLE_LOADING(state, payload){
    state.loading_invoices = payload
  },
  // HUBZZ INVOICES
  SET_HUBZZ_INVOICES_COUNT(state, payload){
    state.hubzz_invoices_count = payload
  },
  SET_HUBZZ_INVOICES(state, payload){
    state.hubzz_invoices = payload
  },
  // PRACTICE INVOICES
  SET_PRACTICE_INVOICES_COUNT(state, payload){
    state.practice_invoices_count = payload
  },
  SET_PRACTICE_INVOICES(state, payload){
    state.practice_invoices = payload
  },
}