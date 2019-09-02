export default{
    TOGGLE_LOADING(state, payload){
        state.loading_practices = payload
    },
    //------------PRACTICES--------------------------
    SET_PRACTICES(state, payload){
        state.allPractices = payload
    },
    SET_PRACTICE_COUNT(state, payload){
        state.itemCount = payload
    },
    SET_SPECIFIC_PRACTICE(state, payload){
        state.practice = payload
    },
    //--------------PRACTICE HUBZZZZ-----------------------
    SET_PRACTICE_HUB(state, payload){
        state.practiceHub = payload
    },
    SET_PRACTICE_PARENT(state, payload){
        state.practiceParent = payload
    },
    //------------------PRACTICE SPOKES---------------------
    SET_PRACTICE_SPOKES_COUNT(state, payload){
        state.practiceSpokesCount = payload
    },
    SET_PRACTICE_SPOKES(state, payload){
        state.practiceSpokes = payload
    },
    SET_PRACTICE_SPOKES_PAGE_COUNT(state, payload){
        state.practiceSpokesPageCount = payload
    },
    UPDATE_PRACTICE_SPOKES_PAGE_COUNT(state, payload){
        let pageCount = Math.ceil((payload.spokesCount+1) / payload.perPage)
        console.log('the page count is',pageCount)
        state.practiceSpokesPageCount = pageCount
    },
    
    //------------------PRACTICE USERS-----------------------
    SET_PRACTICE_USERS_COUNT(state, payload){
        state.practiceUsersCount = payload
    },
    SET_PRACTICE_USERS(state, payload){
        state.practiceUsers = payload
    },
    SET_PRACTICE_USERS_PAGE_COUNT(state, payload){
        state.practiceUsersPageCount = payload 
    },
    UPDATE_PRACTICE_USERS_PAGE_COUNT(state, payload){
        let pageCount = Math.ceil((payload.userCount+1) / payload.perPage)
        console.log('the page count is',pageCount)
        state.practiceUsersPageCount = pageCount
    },
}