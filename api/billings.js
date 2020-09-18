export function fetchHubzzInvoices (axios, payload) {
  // this is called practice invoices  in API
  console.log('payload', payload)
  let params = {}
  payload.exportable ? params.exportable = payload.exportable : null
  payload.id ? params.id = payload.id : null
  payload.practice_id ? params.practice_id = payload.practice_id : null
  payload.search ? params.search = payload.search : null
  payload.invoice_number ? params.invoice_number = payload.invoice_number : null
  payload.paid ? params.paid = (payload.paid === "false" ? false : true): null
  payload.exported ? params.exported = (payload.exported === "false" ? false : true): null
  payload.order_by ? params.order_by = payload.order_by : null
  payload.limit ? params.limit = payload.limit : null
  payload.offset ? params.offset = payload.offset : null
  payload.viewing_practice_id ? params.viewing_practice_id = payload.viewing_practice_id : null
  payload.detailed ? params.detailed = payload.detailed : null
  payload.with_relations ? params.with_relations = payload.with_relations : null
  return axios.$get(`/api/v1/admin/practice-invoices${payload.countOnly ? `/count`:''}`, { params:params })
}

export function fetchPracticeInvoices (axios, payload) {
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

export function fetchBillablePractices (axios, payload){
  let params = {}
  payload.has_sage_ref ? params.has_sage_ref = payload.has_sage_ref : null
  payload.search ? params.search = payload.search : null
  payload.type ? params.type = payload.type : null
  payload.status ? params.status = payload.status : null
  payload.order_by ? params.order_by = payload.order_by : null
  payload.verified ? params.verified = payload.verified : null
  payload.hub_type ? params.hub_type = payload.hub_type : null
  if (payload.billable_spoke === true){
    params.billable_spoke = true
  } else if (payload.billable_spoke === false) {
    params.billable_spoke = false
  } else if (payload.billable_spoke === null) {
    params.billable_spoke = null
  }
  payload.practice_invoiceable_date_start ? params.practice_invoiceable_date_start = payload.practice_invoiceable_date_start : null
  payload.practice_invoiceable_date_end ? params.practice_invoiceable_date_end = payload.practice_invoiceable_date_end : null
  payload.practice_invoiceable ? params.practice_invoiceable = payload.practice_invoiceable : null
  payload.practice_invoiceable_status ? params.practice_invoiceable_status = payload.practice_invoiceable_status : null
  payload.limit ? params.limit = payload.limit : null
  payload.offset ? params.offset = payload.offset : null
  return axios.$get(`/api/v1/admin/practices${payload.countOnly ? '/count':''}`,{ params:params })
}