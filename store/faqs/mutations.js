export default{
    TOGGLE_LOADING(state, payload){
        state.loading_faqs = payload
    },

    SET_LOCUM_FAQS(state, payload){
        let locum_faqs = payload.map((faq) => {
            return {
                ...faq,
                'toggled': false
            }
        })
        state.locumFaqs = locum_faqs
    },
    SET_PRACTICE_FAQS(state, payload){
        let practice_faqs = payload.map((faq) => {
            return {
                ...faq,
                'toggled': false
            }
        })
        state.practiceFaqs = practice_faqs
    },
    TOGGLE_LOCUM_FAQ(state, payload){
        const index = state.locumFaqs.findIndex((locumFaq)=>{
            return locumFaq.id === payload.id
        })
        if(index>-1){
            state.locumFaqs[index].toggled = !state.locumFaqs[index].toggled
        }
    },
    TOGGLE_PRACTICE_FAQ_ON(state, payload){
        const index = state.practiceFaqs.findIndex((practiceFaq)=>{
            return practiceFaq.id === payload.id
        })
        if(index>-1){
            state.practiceFaqs[index].toggled = !state.practiceFaqs[index].toggled
        }
    },
    TOGGLE_PRACTICE_FAQ_OFF(state, payload){
        payload.toggle = false
        state.itemPracticeFaq = payload
        
    }
}