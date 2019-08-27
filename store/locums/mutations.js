export default{
    TOGGLE_LOADING(state, payload){
        state.loading_locums = payload
    },
    SET_LOCUM_USERS(state,payload){
        state.locumUsers = payload
    },
    SET_LOCUM_COUNT(state,payload){
        state.itemCount = payload
    },
    SET_MANDATORY_DOCS(state,payload){
        state.mandatoryComplianceDocuments = payload
    },
    // SET_OPTIONAL_DOCS(state,payload){
    //     state.optionalComplianceDocuments = payload
    // },
    SET_APPROVED_DOC(state,payload){
        let index = state.mandatoryComplianceDocuments.findIndex(docs=>docs.id==payload.id)
        if(index>0){
            state.mandatoryComplianceDocuments.splice(index,1,payload)
        }
    }
    
}