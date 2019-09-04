export default{
    TOGGLE_LOADING(state, payload){
        state.loading_faqs = payload
    },

    SET_LOCUM_FAQS(state, payload){
        state.locumFaqs = payload
    },
    SET_PRACTICE_FAQS(state, payload){
        state.practiceFaqs = payload
    },
    TOGGLE_LOCUM_FAQ(state, payload){
        console.log('payload',payload)
        console.log('state',state.locumFaqs)
        const index = state.locumFaqs.findIndex((locumFaq)=>{
            return locumFaq.id === payload.id
        })
        if(index>-1){
            state.locumFaqs[index].toggled = !state.locumFaqs[index].toggled
        }
    },
    TOGGLE_PRACTICE_FAQ_ON(state, payload){
        console.log('payload',payload)
        console.log('state',state.practiceFaqs)
        const index = state.practiceFaqs.findIndex((practiceFaq)=>{
            return practiceFaq.id === payload.id
        })
        if(index>-1){
            state.practiceFaqs[index].toggled = !state.practiceFaqs[index].toggled
        }
    },
    TOGGLE_PRACTICE_FAQ_OFF(state, payload){
        console.log(payload)
        payload.toggle = false
        state.itemPracticeFaq = payload
        
    }
}