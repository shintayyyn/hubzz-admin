export function fetchAdminUsersCount(axios, payload){
    let params = {}
    payload.search ? params.search = payload.search : null
    return axios.$get(`/api/v1/admin/admin-users/count`)
}
export function fetchAdminUsers(axios, payload){
    let params = {}
    payload.search ? params.search = payload.search : null
    payload.limit ? params.limit = payload.limit : null
    payload.offset ? params.offset = payload.offset : null
   
    return axios.$get(`/api/v1/admin/admin-users`)
}
