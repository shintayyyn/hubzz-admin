export function fetchPractices (axios, payload){
  let params = {}
  payload.search ? params.search = payload.search : null
  payload.type ? params.type = payload.type : null
  payload.status ? params.status = payload.status : null
  payload.order_by ? params.order_by = payload.order_by : null
  payload.verified ? params.verified = payload.verified : null
  payload.hub_type ? params.hub_type = payload.hub_type : null
  payload.billable_spoke ? params.billable_spoke = payload.billable_spoke : null
  payload.practice_invoiceable_date_start ? params.practice_invoiceable_date_start = payload.practice_invoiceable_date_start : null
  payload.practice_invoiceable_date_end ? params.practice_invoiceable_date_end = payload.practice_invoiceable_date_end : null
  payload.practice_invoiceable ? params.practice_invoiceable = payload.practice_invoiceable : null
  payload.limit ? params.limit = payload.limit : null
  payload.offset ? params.offset = payload.offset : null
  return axios.$get(`/api/v1/admin/practices${payload.countOnly ? '/count':''}`,{ params:params })
}
export function fetchSpecificPractice (axios, payload){
  return axios.$get(`/api/v1/admin/practices/${payload.id}`)
}
export function fetchHub (axios,payload){
  return axios.$get(`/api/v1/admin/practices/${payload.practice_id}/parent-surgery`)
}
export function fetchPracticeParent (axios,payload){
  return axios.$get(`/api/v1/admin/practices/${payload.practice_parent_id}`)
}
export function fetchHubInvitations (axios, payload) {
  let params = {}
  payload.order_by ? params.order_by = payload.order_by : null
  payload.limit ? params.limit = payload.limit : null
  payload.offset ? params.offset = payload.offset : null
  return axios.$get(`/api/v1/admin/practices/${payload.practice_id}/parent-surgery/invitations${payload.countOnly ? '-count' : ''}`, {params:params})
}
export function fetchSpokes (axios,payload){
  let params = {}
  payload.order_by ? params.order_by = payload.order_by : null
  payload.limit ? params.limit = payload.limit : null
  payload.offset ? params.offset = payload.offset : null
  return axios.$get(`/api/v1/admin/practices/${payload.practice_id}/practice-surgeries${payload.countOnly ? '/count':''}`,{params})
}
