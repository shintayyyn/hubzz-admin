export function fetchAdminUsersCount(axios, payload){
    let params = {}
    payload.search ? params.search = payload.search : null
    console.log('API fetch admin users count is being performed', {params : params})
    return axios.$get(`/api/v1/admin/admin-users/count`)
}
export function fetchAdminUsers(axios, payload){
    let params = {}
    payload.search ? params.search = payload.search : null
    payload.limit ? params.limit = payload.limit : null
    payload.offset ? params.offset = payload.offset : null
    console.log('API fetch admin users is being performed', payload)
    return axios.$get(`/api/v1/admin/admin-users`)
}
