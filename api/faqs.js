export function fetchLocumFaqs(axios, payload){
    console.log('API fetch locum faqs is being performed',payload)
    return axios.$get(`/api/v1/admin/faqs?domain=Locum`)
}
export function fetchPracticeFaqs(axios, payload){
    console.log('API fetch practice faqs is being performed',payload)
    return axios.$get(`/api/v1/admin/faqs?domain=Practice`)
}