export function fetchInquiries (axios, payload) {
	return axios.$get(`/api/v1/admin/supports${payload.countOnly ? "/count" :''}`,{ params: payload })
}
