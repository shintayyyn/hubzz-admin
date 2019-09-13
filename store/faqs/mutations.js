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
    ADD_FAQ(state, payload){
        if(payload.domain === 'Locum'){
            state.locumFaqs.push(payload[0])
        }
        if(payload.domain === 'Practice'){
            state.practiceFaqs.push(payload[0])
        }
    },
    UPDATE_FAQ(state, payload){
        if(payload.domain === 'Locum'){
            let index = state.locumFaqs.findIndex(locumFaq => locumFaq.id === payload.id)
            if(index >= 0){
                state.locumFaqs.splice(index, 1, payload)
                state.locumFaqs = state.locumFaqs.map((faq) => {
                    return {
                        ...faq,
                        'toggled': false
                    }
                })
            }
        }
        if(payload.domain === 'Practice'){
            let index = state.practiceFaqs.findIndex(practiceFaq => practiceFaq.id === payload.id)
            if(index >= 0){
                state.practiceFaqs.splice(index, 1, payload)
                state.practiceFaqs = state.practiceFaqs.map((faq) => {
                    return {
                        ...faq,
                        'toggled': false
                    }
                })
            }
        }
        
    },
    DELETE_FAQ(state, payload){
        if(payload.domain === 'Locum'){
            let index = state.locumFaqs.findIndex( locumFaq => locumFaq.id === payload.id)
            state.locumFaqs.splice(index, 1)
        }
        if(payload.domain === 'Practice'){
            let index = state.locumFaqs.findIndex( practiceFaq => practiceFaq.id === payload.id)
            state.practiceFaqs.splice(index, 1)
        }
    },
    TOGGLE_LOCUM_FAQ(state, payload){
        const index = state.locumFaqs.findIndex((locumFaq)=>{
            return locumFaq.id === payload.id
        })
        if(index>-1){
            state.locumFaqs[index].toggled = !state.locumFaqs[index].toggled
        }
    },
    TOGGLE_PRACTICE_FAQ(state, payload){
        const index = state.practiceFaqs.findIndex((practiceFaq)=>{
            return practiceFaq.id === payload.id
        })
        if(index>-1){
            state.practiceFaqs[index].toggled = !state.practiceFaqs[index].toggled
        }
    },
}