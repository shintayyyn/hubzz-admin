export default{
    TOGGLE_LOADING(state, payload){
        state.loading_practices = payload
    },
    SET_PRACTICES(state, payload){
        state.allPractices = payload
    },
    SET_PRACTICE_COUNT(state, payload){
        state.itemCount = payload
    },
    SET_SPECIFIC_PRACTICE(state, payload){
        state.practice = payload
    },
    SET_PRACTICE_HUB(state, payload){
        state.practiceHub = payload
    },
    SET_PRACTICE_PARENT(state, payload){
        state.practiceParent = payload
    },
    SET_PRACTICE_SPOKES_COUNT(state, payload){
        state.practiceSpokesCount = payload
    },
    SET_PRACTICE_SPOKES(state, payload){
        state.practiceSpokes = payload
    }
}