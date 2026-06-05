export function fetchInquiries(axios, payload = {}) {
  const { countOnly, ...params } = payload

  return axios.$get(`/api/v1/admin/supports${countOnly ? '/count' : ''}`, {
    params
  })
}
