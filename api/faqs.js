export function fetchLocumFaqs(axios, payload){
    return axios.$get(`/api/v1/admin/faqs?domain=Locum`)
}
export function fetchPracticeFaqs(axios, payload){
    return axios.$get(`/api/v1/admin/faqs?domain=Practice`)
}