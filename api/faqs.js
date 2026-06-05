export function fetchLocumFaqs(axios){
    return axios.$get(`/api/v1/admin/faqs?domain=Locum`)
}
export function fetchPracticeFaqs(axios){
    return axios.$get(`/api/v1/admin/faqs?domain=Practice`)
}
