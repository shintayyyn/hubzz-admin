export function fetchLocums(axios, payload) {
	let params = {};
	payload.search ? (params.search = payload.search) : null;
	payload.compliance_status
		? (params.compliance_status = payload.compliance_status)
		: null;
	payload.order_by ? (params.order_by = payload.order_by) : null;
	payload.limit ? (params.limit = payload.limit) : null;
	payload.offset ? (params.offset = payload.offset) : null;
	return axios.$get(
		`/api/v1/admin/locum-users${payload.countOnly ? "/count" : ""}`,
		{ params: params }
	);
}
export function fetchSpecificLocum(axios, payload) {
	return axios.$get(`/api/v1/admin/locum-users/${payload.id}`);
}
