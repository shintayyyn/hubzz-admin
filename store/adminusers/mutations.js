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
    

}