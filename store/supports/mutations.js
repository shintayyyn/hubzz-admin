export default{
  TOGGLE_LOADING(state, payload){
    state.loading_support_emails = payload
  },
  SET_EMAILS_COUNT(state, payload){
    state.itemCount = payload
  },
  SET_EMAILS(state, payload){
    state.emails = payload
  },
  UPDATE_EMAILS(state, payload){
    let index = state.emails.findIndex(email => email.id === payload.id)
    if(index >= 0){
      state.emails.splice(index, 1, payload)
      const updatedEmail = state.emails.find(email => email.id === payload.id)

      if(state.email.id === updatedEmail.id){
        state.email = updatedEmail
      }
    } 
  }
}