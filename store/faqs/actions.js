import * as faqApi from '@/api/faqs'
export default{
    async initializeFaqTransactionListener({state, commit}){
        this.$socket.on("createdFaq",faqModel => {
            commit('ADD_FAQ', faqModel)
        })

        this.$socket.on("updatedFaq", faqModel => {
            commit('UPDATE_FAQ', faqModel)
        })
        
        this.$socket.on("deletedFaq", existingFaq => {
            commit('DELETE_FAQ', existingFaq)
        })
    },
    async fetchLocumFaqs({ commit },payload){
        commit('TOGGLE_LOADING',true)        
        const locum_faqs = await faqApi.fetchLocumFaqs(this.$axios, payload)
        return commit('SET_LOCUM_FAQS', locum_faqs.data.faqs)
    },
    async fetchPracticeFaqs({ commit }, payload){
        commit('TOGGLE_LOADING',true)
        const practice_faqs = await faqApi.fetchPracticeFaqs(this.$axios, payload)
        commit('TOGGLE_LOADING',false)
        return commit('SET_PRACTICE_FAQS', practice_faqs.data.faqs)
    },


}
