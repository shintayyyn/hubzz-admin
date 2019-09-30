export function fetchPracticeSessions(axios, payload){
    let params = {}
    payload.viewing_practice_id ? params.viewing_practice_id = payload.viewing_practice_id : null
    payload.status ? params.status = payload.status : null
    payload.order_by ? params.order_by = payload.order_by : null
    payload.limit ? params.limit = payload.limit : null
    payload.offset ? params.offset = payload.offset : null
    return axios.$get(`/api/v1/admin/jobs${payload.countOnly ? '/count': ''}`, {params: params})
}

export function fetchLocumJobs(axios, payload){
    let params = {}
    payload.viewing_locum_user_id ? params.viewing_locum_user_id = payload.viewing_locum_user_id : null
    payload.locum_status ? params.locum_status = payload.locum_status : null
    payload.order_by ? params.order_by = payload.order_by : null
    payload.limit ? params.limit = payload.limit : null
    payload.offset ? params.offser = payload.offset : null
    return axios.$get(`/api/v1/admin/jobs${payload.countOnly ? '/count':''}`,{params: params})
}

export function fetchSpecificJob(axios, payload){
    let params ={}
    params.detailed = false
    
    if(payload.locumUserId){
        params.viewing_locum_user_id = payload.locumUserId
    }
    return axios.$get(`/api/v1/admin/jobs/${payload.jobId}`,{ params })
}
