export default{
    TOGGLE_LOADING(state, payload){
        state.loading_jobs = payload
    },
    // PRACTICE
    SET_PRACTICE_AVAILABLE_SESSIONS(state, payload){
        state.practice_available_sessions = payload
    },
    SET_PRACTICE_AVAILABLE_SESSIONS_COUNT(state, payload){
        state.practice_available_sessions_count = payload
    },
    UPDATE_PRACTICE_AVAILABLE_SESSIONS(state, payload){
        console.log('add practice session worKs',payload)
    },
    //=======================================
    SET_PRACTICE_APPLIED_SESSIONS(state, payload){
        state.practice_applied_sessions = payload
    },
    SET_PRACTICE_APPLIED_SESSIONS_COUNT(state, payload){
        state.practice_applied_sessions_count = payload
    },
    //=======================================
    SET_PRACTICE_CURRENT_SESSIONS(state, payload){
        state.practice_current_sessions = payload
    },
    SET_PRACTICE_CURRENT_SESSIONS_COUNT(state, payload){
        state.practice_current_sessions_count = payload
    },
    UPDATE_PRACTICE_ALLOCATED_SESSIONS(state, payload){
        console.log('appoint locum works', payload)
    },
    //=======================================
    SET_PRACTICE_COMPLETED_SESSIONS(state, payload){
        state.practice_completed_sessions = payload
    },
    SET_PRACTICE_COMPLETED_SESSIONS_COUNT(state, payload){
        state.practice_completed_sessions_count = payload
    },
    //=======================================
    SET_PRACTICE_UNFILLED_SESSIONS(state, payload){
        state.practice_unfilled_sessions = payload
    },
    SET_PRACTICE_UNFILLED_SESSIONS_COUNT(state, payload){
        state.practice_unfilled_sessions_count = payload
    },
    //=======================================
    SET_PRACTICE_CANCELLED_SESSIONS(state, payload){
        state.practice_cancelled_sessions = payload
    },
    SET_PRACTICE_CANCELLED_SESSIONS_COUNT(state, payload){
        state.practice_cancelled_sessions_count = payload
    },
    //=======================================
    SET_PRACTICE_DECLINED_SESSIONS(state, payload){
        state.practice_declined_sessions = payload
    },
    SET_PRACTICE_DECLINED_SESSIONS_COUNT(state, payload){
        state.practice_declined_sessions_count = payload
    },

    // LOCUM
    SET_LOCUM_CURRENT_JOBS(state, payload){
        state.locum_current_jobs = payload
    },
    SET_LOCUM_CURRENT_JOBS_COUNT(state, payload){
        state.locum_current_jobs_count = payload
    },
    //=======================================
    SET_LOCUM_AVAILABLE_JOBS(state, payload){
        state.locum_available_jobs = payload
    },
    SET_LOCUM_AVAILABLE_JOBS_COUNT(state, payload){
        state.locum_available_jobs_count = payload
    },
    //=======================================
    SET_LOCUM_MATCHED_JOBS(state, payload){
        state.locum_matched_jobs = payload
    },
    SET_LOCUM_MATCHED_JOBS_COUNT(state, payload){
        state.locum_matched_jobs_count = payload
    },
    //=======================================
    SET_LOCUM_APPLIED_JOBS(state, payload){
        state.locum_applied_jobs = payload
    },
    SET_LOCUM_APPLIED_JOBS_COUNT(state, payload){
        state.locum_applied_jobs_count = payload
    },
    UPDATE_LOCUM_APPLIED_JOBS(state, payload){
        console.log('job applied works',payload)
    },
    //=======================================
    SET_LOCUM_CANCELLED_JOBS(state, payload){
        state.locum_cancelled_jobs = payload
    },
    SET_LOCUM_CANCELLED_JOBS_COUNT(state, payload){
        state.locum_cancelled_jobs_count = payload
    },
    //=======================================
    SET_LOCUM_UNSUCCESSFUL_JOBS(state, payload){
        state.locum_unsuccessful_jobs = payload
    },
    SET_LOCUM_UNSUCCESSFUL_JOBS_COUNT(state, payload){
        state.locum_unsuccessful_jobs_count = payload
    },
    UPDATE_LOCUM_UNSUCCESSFUL_JOBS(state, payload){
        console.log('job to unsuccessful works', payload)  
    },
    //=======================================
    SET_LOCUM_DECLINED_JOBS(state, payload){
        state.locum_declined_jobs = payload
    },
    SET_LOCUM_DECLINED_JOBS_COUNT(state, payload){
        state.locum_declined_jobs_count = payload
    },
    UPDATE_LOCUM_DECLINED_JOBS(state,payload){
        console.log('job to declined works', payload)
    },
    //=======================================
    SET_LOCUM_COMPLETED_JOBS(state, payload){
        state.locum_completed_jobs = payload
    },
    SET_LOCUM_COMPLETED_JOBS_COUNT(state, payload){
        state.locum_completed_jobs_count = payload
    },
    
}   