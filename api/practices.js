export function fetchPractices(axios,payload){
    console.log('Practice API is performed',payload)
    let params = {}
    payload.type ? params.type = payload.type : null
    payload.status ? params.status = payload.status : null
    payload.order_by ? params.order_by = payload.order_by : null
    payload.limit ? params.limit = payload.limit : null
    payload.offset ? params.offset = payload.offset : null
    return axios.$get(`/api/v1/admin/practices${payload.countOnly ? '/count':''}`,{params:params})
}
