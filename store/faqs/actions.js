import * as faqApi from '@/api/faqs'
export default{

    async fetchLocumFaqs({ commit },payload){
        commit('TOGGLE_LOADING',true)
        let faqs = []
        let locum_faqs = []
        faqs = await faqApi.fetchLocumFaqs(this.$axios, payload)

        // Promise.all([
        //     faqs = await faqApi.fetchLocumFaqs(this.$axios, payload)
        // ]).then(()=>{
        //     locum_faqs = faqs.filter(faq => faq.domain == 'Locum')
        // })
        console.log('locum faqs in action', faqs)
        commit('TOGGLE_LOADING',true)
        return commit('SET_LOCUM_FAQS',  faqs.data.faqs)
    },
    async fetchPracticeFaqs({ commit }, payload){
        commit('TOGGLE_LOADING',true)
        const practice_faqs = await faqApi.fetchPracticeFaqs(this.$axios, payload)
        commit('TOGGLE_LOADING',true)
        return commit('SET_PRACTICE_FAQS', practice_faqs)
    },


}