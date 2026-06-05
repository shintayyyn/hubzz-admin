export function fetchLocumFaqs(axios) {
  return axios.$get('/api/v1/admin/faqs', { params: { domain: 'Locum' } })
}

export function fetchPracticeFaqs(axios) {
  return axios.$get('/api/v1/admin/faqs', { params: { domain: 'Practice' } })
}
