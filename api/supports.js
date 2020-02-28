export function fetchInquiries (axios, payload) {
  let params = {}
  // payload.acknowledged ? params.acknowledged = payload.acknowledged : null
	// payload.limit ? params.limit = payload.limit : null
	// payload.offset ? params.offset = payload.offset : null
  // payload.order_by ? params.order_by = payload.order_by : null
	return axios.$get(`/api/v1/admin/supports${payload.countOnly ? "/count" :''}`,{ params: payload })
}
