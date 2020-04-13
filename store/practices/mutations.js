export default{
    TOGGLE_LOADING (state, payload){
        state.loading_practices = payload
    },
    ADD_PRACTICE_NOTIFICATION (state, payload) {
        console.log('practice notification payload', payload)
        let index = state.practiceNotifications.findIndex(practiceNotif => practiceNotif.practice.id === payload.practice.id)
        if (index < 0) {
            state.practiceNotifications.unshift(payload)
        } else if (index >= 0) {
            state.practiceNotifications.splice(index, 1, payload)
        }
    },
    REMOVE_PRACTICE_NOTIFICATION (state, payload) {
        state.practiceNotifications = state.practiceNotifications.filter(practiceNotif => practiceNotif.id !==payload)
    },
    CLEAR_PRACTICE_NOTIFICATIONS (state) {
        state.practiceNotifications = []
    }, 
    //------------PRACTICES--------------------------
    SET_PRACTICES (state, payload){
        state.allPractices = payload
    },
    SET_PRACTICE_COUNT (state, payload){
        state.itemCount = payload
    },
    SET_SPECIFIC_PRACTICE (state, payload){
        state.practice = payload
    },
    ADD_PRACTICE (state, payload){
        state.allPractices.unshift(payload)
        state.itemCount = state.itemCount +1
        if(state.itemCount > 10){
            state.allPractices.pop()
        }
    },
    UPDATE_PRACTICE (state, payload,){
      let index = state.allPractices.findIndex(practice => practice.id === payload.id)
      if(index >= 0){
        state.allPractices.splice(index, 1, payload)
        const updatedPractice = state.allPractices.find(practice => practice.id === payload.id)            
        if(state.practice.id === updatedPractice.id){
          state.practice = updatedPractice
        }
      }
    },
    //--------------PRACTICE HUBZZ-----------------------
    SET_PRACTICE_HUB (state, payload){
      state.practiceHub = payload
    },
    SET_PRACTICE_PARENT (state, payload){
      state.practiceParent = payload
    },
    SET_HUBZZ_INVITATIONS_COUNT (state, payload){
      state.hubInvitationsCount = payload
    },
    SET_HUBZZ_INVITATIONS (state, payload){
      state.hubInvitations = payload
    },
    //------------------PRACTICE SPOKES---------------------
    SET_PRACTICE_SPOKES_COUNT (state, payload){
        state.practiceSpokesCount = payload
    },
    SET_PRACTICE_SPOKES (state, payload){
        state.practiceSpokes = payload
    },
    SET_PRACTICE_SPOKES_PAGE_COUNT (state, payload){
        state.practiceSpokesPageCount = payload
    },
    UPDATE_PRACTICE_SPOKES_PAGE_COUNT (state, payload){
        let pageCount = Math.ceil((payload.spokesCount+1) / payload.perPage)
        state.practiceSpokesPageCount = pageCount
    },
    
    //------------------PRACTICE USERS-----------------------
    SET_PRACTICE_USERS_COUNT (state, payload){
        state.practiceUsersCount = payload
    },
    SET_PRACTICE_USERS (state, payload){
        state.practiceUsers = payload
    },
    ADD_PRACTICE_USER (state, payload){
      let index = state.practiceUsers.findIndex(practiceUser => 
        practiceUser.practice_detail.practice.id === payload.user.practice_detail.practice.id)
      if(index >= 0){
          state.practiceUsers.unshift(payload.user)
          state.practiceUsersCount = state.practiceUsersCount + 1
          if(state.practiceUsersCount > 5){
              state.practiceUsers.pop()
          }
      }
    },
    SET_PRACTICE_USERS_PAGE_COUNT (state, payload){
        state.practiceUsersPageCount = payload 
    },
    UPDATE_PRACTICE_USER (state, payload){
        let index = state.practiceUsers.findIndex(practiceUser => practiceUser.id === payload.user.id)
        if(index >= 0){
            state.practiceUsers.splice(index, 1, payload.user)
        }
    },
    UPDATE_PRACTICE_USERS_PAGE_COUNT (state, payload){
        let pageCount = Math.ceil((payload.userCount+1) / payload.perPage)
        state.practiceUsersPageCount = pageCount
    },

    //---------------PRACTICE DOCUMENTS-------------------
    SET_PRACTICE_DOCUMENTS (state, payload){
        state.specificPracticeDocumentTypes = payload
    }
}   
