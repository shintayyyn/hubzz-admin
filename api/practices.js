export function fetchPractices(axios,payload){
    console.log('Practice API is performed',payload)
    let params = {}
    payload.search ? params.search = payload.search : null
    payload.type ? params.type = payload.type : null
    payload.status ? params.status = payload.status : null
    payload.order_by ? params.order_by = payload.order_by : null
    payload.limit ? params.limit = payload.limit : null
    payload.offset ? params.offset = payload.offset : null
    return axios.$get(`/api/v1/admin/practices${payload.countOnly ? '/count':''}`,{params:params})
}
export function fetchSpecificPractice(axios, payload){
    console.log('Practice API for specific practice is being performed', payload)
    return axios.$get(`/api/v1/admin/practices/${payload.id}`)
}
export function fetchHub(axios,payload){
    console.log('Practice API for getting Hub is performed',payload)
    return axios.$get(`/api/v1/admin/practices/${payload.practice_id}/parent-surgery`)
}
export function fetchPracticeParent(axios,payload){
    console.log('Practice API for getting Parent Practice is performed', payload)
    return axios.$get(`/api/v1/admin/practices/${payload.practice_parent_id}`)
}

export function fetchSpokes(axios,payload){
    console.log('Practice API for getting spokes is perfomed', payload)
    let params = {}
    payload.order_by ? params.order_by = payload.order_by : null
    payload.limit ? params.limit = payload.limit : null
    payload.offset ? params.offset = payload.offset : null
    return axios.$get(`/api/v1/admin/practices/${payload.practice_id}/practice-surgeries${payload.countOnly ? '/count':''}`,{params})
}
// export function fetchSessions(axios,payload){

// }
export function fetchPracticeUsers(axios,payload){
    console.log('Practice API for getting practice users is being performed')
    let params = {}
    payload.practice_id ? params.practice_id = payload.practice_id : null
    payload.practice_role ? params.practice_role = payload.practice_role : null
    payload.status ? params.status = payload.status : null
    payload.order_by ? params.order_by = payload.order_by : null 
    payload.limit ? params.limit = payload.limit : null
    payload.offset ? params.offset  = payload.offset : null
    return axios.$get(`/api/v1/admin/practice-users${payload.countOnly ? '/count':''}`,{params:params})
}