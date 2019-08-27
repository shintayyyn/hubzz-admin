export default{
    TOGGLE_LOADING(state, payload){
        state.loading_practices = payload
    },
    SET_PRACTICES(state, payload){
        state.allPractices = payload
    },
    SET_PRACTICE_COUNT(state, payload){
        state.itemCount = payload
    }

}