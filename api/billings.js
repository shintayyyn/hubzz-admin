export function fetchHubzzInvoices(axios, payload) {
  // this is called practice invoices  in API
  let params = {}
  payload.id ? params.id = payload.id : null
  payload.practice_id ? params.practice_id = payload.practice_id : null
  payload.paid ? params.paid = payload.paid : null
  payload.order_by ? params.order_by = payload.order_by : null
  payload.limit ? params.limit = payload.limit : null
  payload.offset ? params.offset = payload.offset : null
  payload.viewing_practice_id ? params.viewing_practice_id = payload.viewing_practice_id : null
  payload.detailed ? params.detailed = payload.detailed : null
  payload.with_relations ? params.with_relations = payload.with_relations : null
  return axios.$get(`/api/v1/admin/practice-invoices${payload.countOnly ? `/count`:''}`, { params:params })
}

export function fetchPracticeInvoices(axios, payload) {
  // this is called locum invoices in API
  let params = {}
  payload.practice_id ? params.practice_id = payload.practice_id : null
  payload.id ? params.id = payload.id : null
  payload.surgery_id ? params.surgery_id = payload.surgery_id : null
  payload.status ? params.status = payload.status : null
  payload.issued ? params.issued = payload.issued : null
  payload.paid ? params.paid = payload.paid : null
  payload.order_by ? params.order_by = payload.order_by : null
  payload.limit ? params.limit = payload.limit : null
  payload.offset ? params.offset = payload.offset : null
  payload.detailed ? params.detailed = payload.detailed : null
  payload.with_relations ? params.with_relations = payload.with_relations : null
  return axios.$get(`/api/v1/admin/practices/${payload.practice_id}/locum-invoices${payload.countOnly ? `/count`:''}`,{ params:params })
}