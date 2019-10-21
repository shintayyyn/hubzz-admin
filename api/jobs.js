export function fetchPracticeSessions(axios, payload){
    let params = {}
    payload.jobId ? params.id = payload.jobId : null
    payload.viewing_practice_id ? params.viewing_practice_id = payload.viewing_practice_id : null
    payload.status ? params.status = payload.status : null
    payload.order_by ? params.order_by = payload.order_by : null
    payload.surgery_id ? params.surgery_id = payload.surgery_id : null
    payload.limit ? params.limit = payload.limit : null
    payload.offset ? params.offset = payload.offset : null
    payload.viewing_locum_user_id ? params.viewing_locum_user_id = payload.viewing_locum_user_id : null
    payload.viewing_practice_id ? params.viewing_practice_id = payload.viewing_practice_id : null
    return axios.$get(`/api/v1/admin/jobs${payload.countOnly ? '/count': ''}`, {params: params})
}

export function fetchLocumJobs(axios, payload){
    let params = {}
    payload.jobId ? params.id = payload.jobId : null
    payload.viewing_locum_user_id ? params.viewing_locum_user_id = payload.viewing_locum_user_id : null
    payload.locum_status ? params.locum_status = payload.locum_status : null
    payload.order_by ? params.order_by = payload.order_by : null
    payload.limit ? params.limit = payload.limit : null
    payload.offset ? params.offset = payload.offset : null
    payload.viewing_locum_user_id ? params.viewing_locum_user_id = payload.viewing_locum_user_id : null
    payload.viewing_practice_id ? params.viewing_practice_id = payload.viewing_practice_id : null
    return axios.$get(`/api/v1/admin/jobs${payload.countOnly ? '/count':''}`,{params: params})
}

export function fetchJobParts(axios, payload){
  let params = {}
  payload.jobPartId ? params.id = payload.jobPartId : null
  payload.status ? params.status = payload.status : null
  payload.locum_status ? params.locum_status = payload.locum_status : null
  payload.order_by ? params.order_by = payload.order_by : null
  payload.limit ? params.limit = payload.limit : null
  payload.offset ? params.offset = payload.offset : null
  payload.viewing_locum_user_id ? params.viewing_locum_user_id = payload.viewing_locum_user_id : null
  payload.viewing_practice_id ? params.viewing_practice_id = payload.viewing_practice_id : null
  return axios.$get(`/api/v1/admin/job-parts${payload.countOnly ? '/count' : ''}`,{params:params})
}

export function fetchSpecificJob(axios, payload){
    let params = {}
    params.detailed = false
    
    if(payload.locumUserId){
      params.viewing_locum_user_id = payload.locumUserId
    }
    if(payload.practiceId){
      params.viewing_practice_id = payload.practiceId
    }
    return axios.$get(`/api/v1/admin/jobs/${payload.jobId}`,{ params })
}

export function fetchSpecificJobPart(axios, payload){
  let params = {}
  params.detailed = false 

  if(payload.locumUserId){
    params.viewing_locum_user_id = payload.locumUserId
  }
  if(payload.practiceId){
    params.viewing_practice_id = payload.practiceId
  }
  return axios.$get(`/api/v1/admin/job-parts/${payload.jobPartId}`, { params })

}
