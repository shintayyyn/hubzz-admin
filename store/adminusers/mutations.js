export default{
    TOGGLE_LOADING(state, payload){
        state.loading_admin_users = payload
    },
    SET_ADMIN_COUNT(state, payload){
        state.itemCount = payload
    },
    SET_ADMIN_USERS(state, payload){
        state.adminUsers = payload
    },
    ADD_ADMIN_USER(state, payload){
        state.adminUsers.push(payload)
        state.itemCount = state.itemCount + 1
    },
    UPDATE_ADMIN_USER(state, payload){
        let index = state.adminUsers.findIndex(adminUser => adminUser.id === payload.id)
        if(index >= 0){
            state.adminUsers.splice(index, 1, payload)
        }
    },
    DELETE_ADMIN_USER(state, payload){
        let index = state.adminUsers.findIndex(
            id => id === payload.id
        )
        state.adminUsers.splice(index, 1)
        state.itemCount = state.itemCount - 1
    },
}