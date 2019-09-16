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
    ADD_PRACTICE(state, payload){
        state.allPractices.unshift(payload)
        state.itemCount = state.itemCount +1
    },
    UPDATE_PRACTICE(state, payload){
        let index = state.allPractices.findIndex(practice => practice.id === payload.id)
        console.log()
        if(index >= 0){
            state.allPractices.splice(index, 1, payload)
            const updatedPractice = state.allPractices.find(practice => practice.id === payload.id)
            console.log('updated practice', updatedPractice)
            state.practice = updatedPractice
        }
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
        state.practiceSpokesPageCount = pageCount
    },
    
    //------------------PRACTICE USERS-----------------------
    SET_PRACTICE_USERS_COUNT(state, payload){
        state.practiceUsersCount = payload
    },
    SET_PRACTICE_USERS(state, payload){
        state.practiceUsers = payload
    },
    ADD_PRACTICE_USER(state, payload){
        state.practiceUsers.push(payload.user)
        state.practiceUsersCount = state.practiceUsersCount + 1
    },
    SET_PRACTICE_USERS_PAGE_COUNT(state, payload){
        state.practiceUsersPageCount = payload 
    },
    UPDATE_PRACTICE_USER(state, payload){
        let index = state.practiceUsers.findIndex(practiceUser => practiceUser.id === payload.user.id)
        if(index >= 0){
            state.practiceUsers.splice(index, 1, payload.user)
        }
    },
    UPDATE_PRACTICE_USERS_PAGE_COUNT(state, payload){
        let pageCount = Math.ceil((payload.userCount+1) / payload.perPage)
        state.practiceUsersPageCount = pageCount
    },

}