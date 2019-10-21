export default{
    TOGGLE_LOADING(state, payload){
        state.loading_jobs = payload
    },
    SET_SESSIONS_PRACTICE_ID_VIEWER(state, payload){
        state.viewing_sessions_practice_id = payload
    },
    SET_JOBS_LOCUM_USER_ID_VIEWER(state, payload){
        state.viewing_jobs_locum_user_id = payload
    },

    // =================== PRACTICE ================
    SET_PRACTICE_AVAILABLE_SESSIONS(state, payload){
        state.practice_available_sessions = payload
    },
    SET_PRACTICE_AVAILABLE_SESSIONS_COUNT(state, payload){
        state.practice_available_sessions_count = payload
    },
    ADD_PRACTICE_AVAILABLE_SESSIONS(state, payload){
        console.log('add practice available is working', payload)
        state.practice_available_sessions.unshift(payload)
        state.practice_available_sessions_count = state.practice_available_sessions_count + 1
        if(state.practice_available_sessions_count > 10){
            state.practice_available_sessions.pop()
        }
    },
    DEDUCT_PRACTICE_AVAILABLE_SESSIONS(state, payload){
        console.log('deduct practice available jobs is working', payload)

        let index = state.practice_available_sessions.findIndex(
            job => job.id === payload.id
        )
        state.practice_available_sessions.splice(index, 1)
        state.practice_available_sessions_count = state.practice_available_sessions_count - 1
    },
    //================APPLIED=======================
    SET_PRACTICE_APPLIED_SESSIONS(state, payload){
        state.practice_applied_sessions = payload
    },
    SET_PRACTICE_APPLIED_SESSIONS_COUNT(state, payload){
        state.practice_applied_sessions_count = payload
    },
    ADD_PRACTICE_APPLIED_SESSIONS(state, payload){
        console.log('add practice applied is working', payload)
        state.practice_applied_sessions.unshift(payload)
        state.practice_applied_sessions_count = state.practice_applied_sessions_count + 1
        if(state.practice_applied_sessions_count > 10){
            state.practice_applied_sessions.pop()
        }
    },
    DEDUCT_PRACTICE_APPLIED_SESSIONS(state, payload){
        console.log('deduct practice applied jobs is working', payload)

        let index = state.practice_applied_sessions.findIndex(
            job => job.id === payload.id
        )
        state.practice_applied_sessions.splice(index, 1)
        state.practice_applied_sessions_count = state.practice_applied_sessions_count - 1
    },
    //================ALLOCATED=======================
    SET_PRACTICE_ALLOCATED_SESSIONS(state, payload){
        state.practice_allocated_sessions = payload
    },
    SET_PRACTICE_ALLOCATED_SESSIONS_COUNT(state, payload){
        state.practice_allocated_sessions_count = payload
    },
    ADD_PRACTICE_ALLOCATED_SESSIONS(state, payload){
        console.log('add practice allocated is working', payload)
        state.practice_allocated_sessions.unshift(payload)
        state.practice_allocated_sessions_count = state.practice_allocated_sessions_count + 1
        if(state.practice_allocated_sessions_count > 10){
            state.practice_allocated_sessions.pop()
        }
    },
    DEDUCT_PRACTICE_ALLOCATED_SESSIONS(state, payload){
        console.log('deduct practice allocated jobs is working', payload)

        let index = state.practice_allocated_sessions.findIndex(
            job => job.id === payload.id
        )
        state.practice_allocated_sessions.splice(index, 1)
        state.practice_allocated_sessions_count = state.practice_allocated_sessions_count - 1
    },
    //====================ONGOING=====================
    SET_PRACTICE_ONGOING_SESSIONS(state, payload){
      state.practice_ongoing_sessions = payload
    },
    SET_PRACTICE_ONGOING_SESSIONS_COUNT(state, payload){
      state.practice_ongoing_sessions_coung = payload
    },
    //=================COMPLETED======================
    SET_PRACTICE_COMPLETED_SESSIONS(state, payload){
        state.practice_completed_sessions = payload
    },
    SET_PRACTICE_COMPLETED_SESSIONS_COUNT(state, payload){
        state.practice_completed_sessions_count = payload
    },
    ADD_PRACTICE_COMPLETED_SESSIONS(state, payload){
        console.log('add practice completed is working', payload)
        state.practice_completed_sessions.unshift(payload)
        state.practice_completed_sessions_count = state.practice_completed_sessions_count + 1
        if(state.practice_completed_sessions_count > 10){
            state.practice_completed_sessions.pop()
        }
    },
    //=================UNFILLED======================
    SET_PRACTICE_UNFILLED_SESSIONS(state, payload){
        state.practice_unfilled_sessions = payload
    },
    SET_PRACTICE_UNFILLED_SESSIONS_COUNT(state, payload){
        state.practice_unfilled_sessions_count = payload
    },
    ADD_PRACTICE_UNFILLED_SESSIONS(state, payload){
        console.log('add practice completed is working', payload)
        state.practice_unfilled_sessions.unshift(payload)
        state.practice_unfilled_sessions_count = state.practice_unfilled_sessions_count + 1
        if(state.practice_unfilled_sessions_count > 10){
            state.practice_unfilled_sessions.pop()
        }
    },
    //=================CANCELLED======================
    SET_PRACTICE_CANCELLED_SESSIONS(state, payload){
        state.practice_cancelled_sessions = payload
    },
    SET_PRACTICE_CANCELLED_SESSIONS_COUNT(state, payload){
        state.practice_cancelled_sessions_count = payload
    },
    ADD_PRACTICE_CANCELLED_SESSIONS(state, payload){
        console.log('add practice current is working', payload)
        state.practice_cancelled_sessions.unshift(payload)
        state.practice_cancelled_sessions_count = state.practice_cancelled_sessions_count + 1
        if(state.practice_cancelled_sessions_count > 10){
            state.practice_cancelled_sessions.pop()
        }
    },
    //=================DECLINED======================
    SET_PRACTICE_DECLINED_SESSIONS(state, payload){
        state.practice_declined_sessions = payload
    },
    SET_PRACTICE_DECLINED_SESSIONS_COUNT(state, payload){
        state.practice_declined_sessions_count = payload
    },
    ADD_PRACTICE_DECLINED_SESSIONS(state, payload){
        console.log('add practice declined is working', payload)
        state.practice_declined_sessions.unshift(payload)
        state.practice_declined_sessions_count = state.practice_declined_sessions_count + 1
        if(state.practice_declined_sessions_count > 10){
            state.practice_declined_sessions.pop()
        }
    },
    // =================== LOCUM ======================

    // ====================ALLOCATED=====================
    SET_LOCUM_ALLOCATED_JOBS(state, payload){
        state.locum_allocated_jobs = payload
    },
    SET_LOCUM_ALLOCATED_JOBS_COUNT(state, payload){
        state.locum_allocated_jobs_count = payload
    },
    ADD_LOCUM_ALLOCATED_JOBS(state, payload){
        console.log('add locum allocated jobs is working', payload)
        state.locum_allocated_jobs.unshift(payload)
        state.locum_allocated_jobs_count = state.locum_allocated_jobs_count + 1
        if(state.locum_allocated_jobs_count > 10){
            state.locum_allocated_jobs.pop()
        }
    },
    DEDUCT_LOCUM_ALLOCATED_JOBS(state, payload){
        console.log('deduct locum allocated jobs is working', payload)
        let index = state.locum_allocated_jobs.findIndex(
            job => job.id === payload.id
        )
        state.locum_allocated_jobs.splice(index, 1)
        state.locum_allocated_jobs_count = state.locum_allocated_jobs_count - 1
    },
    //================== ONGOING =====================
    SET_LOCUM_ONGOING_JOBS(state, payload){
      state.locum_ongoing_jobs = payload
    },
    SET_LOCUM_ONGOING_JOBS_COUNT(state, payload){
      state.locum_ongoing_jobs_count = payload
    },
    //ADD LOCUM ONGOING JOBS
    //DEDUCT LOCUM ONGOING JOBS
    //=================AVAILABLE======================
    SET_LOCUM_AVAILABLE_JOBS(state, payload){
        state.locum_available_jobs = payload
    },
    SET_LOCUM_AVAILABLE_JOBS_COUNT(state, payload){
        state.locum_available_jobs_count = payload
    },
    ADD_LOCUM_AVAILABLE_JOBS(state, payload){
        console.log('add locum available jobs is working', payload)
        state.locum_available_jobs.unshift(payload)
        state.locum_available_jobs_count = state.locum_available_jobs_count + 1
        if(state.locum_available_jobs_count > 10){
            state.locum_available_jobs.pop()
        }
    },
    DEDUCT_LOCUM_AVAILABLE_JOBS(state, payload){
        console.log('deduct locum available jobs is working', payload)
        let index = state.locum_available_jobs.findIndex(
            job => job.id === payload.id
        )
        state.locum_available_jobs.splice(index, 1)
        state.locum_available_jobs_count = state.locum_available_jobs_count - 1
    },
    //=================MATCHED======================
    SET_LOCUM_MATCHED_JOBS(state, payload){
        state.locum_matched_jobs = payload
    },
    SET_LOCUM_MATCHED_JOBS_COUNT(state, payload){
        state.locum_matched_jobs_count = payload
    },
    ADD_LOCUM_MATCHED_JOBS(state, payload){
        console.log('add locum matched jobs is working', payload)
        state.locum_matched_jobs.unshift(payload)
        state.locum_matched_jobs_count = state.locum_matched_jobs_count + 1
        if(state.locum_matched_jobs_count > 10){
            state.locum_matched_jobs.pop()
        }
    },
    DEDUCT_LOCUM_MATCHED_JOBS(state, payload){
        console.log('deduct locum matched jobs is working', payload)

        let index = state.locum_matched_jobs.findIndex(
            job => job.id === payload.id
        )
        state.locum_matched_jobs.splice(index, 1)
        state.locum_matched_jobs_count = state.locum_matched_jobs_count - 1
    },
    //=================APPLIED======================
    SET_LOCUM_APPLIED_JOBS(state, payload){
        state.locum_applied_jobs = payload
    },
    SET_LOCUM_APPLIED_JOBS_COUNT(state, payload){
        state.locum_applied_jobs_count = payload
    },
    ADD_LOCUM_APPLIED_JOBS(state, payload){
        console.log('applied jobs count', state.locum_applied_jobs_count)
        state.locum_applied_jobs.unshift(payload)
        state.locum_applied_jobs_count = state.locum_applied_jobs_count + 1
        if(state.locum_applied_jobs_count > 10){
            state.locum_applied_jobs.pop()
        }
        console.log('add locum applied jobs is working', state.locum_applied_jobs)
        
    },
    DEDUCT_LOCUM_APPLIED_JOBS(state, payload){
        console.log('deduct locum applied jobs is working', payload)

        let index = state.locum_applied_jobs.findIndex(
            job => job.id === payload.id
        )
        state.locum_applied_jobs.splice(index, 1)
        state.locum_applied_jobs_count = state.locum_applied_jobs_count - 1
    },
    //==================CANCELLED=====================
    SET_LOCUM_CANCELLED_JOBS(state, payload){
        state.locum_cancelled_jobs = payload
    },
    SET_LOCUM_CANCELLED_JOBS_COUNT(state, payload){
        state.locum_cancelled_jobs_count = payload
    },
    ADD_LOCUM_CANCELLED_JOBS(state, payload){
        console.log('add locum cancelled jobs is working', payload)
        state.locum_cancelled_jobs.unshift(payload)
        state.locum_cancelled_jobs_count = state.locum_cancelled_jobs_count + 1
        if(state.locum_cancelled_jobs_count > 10){
            state.locum_cancelled_jobs.pop()
        }
    },
    //=================UNSUCCESSFUL======================
    SET_LOCUM_UNSUCCESSFUL_JOBS(state, payload){
        state.locum_unsuccessful_jobs = payload
    },
    SET_LOCUM_UNSUCCESSFUL_JOBS_COUNT(state, payload){
        state.locum_unsuccessful_jobs_count = payload
    },
    ADD_LOCUM_UNSUCCESSFUL_JOBS(state, payload){
        console.log('add locum unsuccessful jobs is working', payload)
        state.locum_unsuccessful_jobs.unshift(payload)
        state.locum_unsuccessful_jobs_count = state.locum_unsuccessful_jobs_count + 1
        if(state.locum_unsuccessful_jobs_count > 10){
            state.locum_unsuccessful_jobs.pop()
        }
    },
    //===================DECLINED====================
    SET_LOCUM_DECLINED_JOBS(state, payload){
        state.locum_declined_jobs = payload
    },
    SET_LOCUM_DECLINED_JOBS_COUNT(state, payload){
        state.locum_declined_jobs_count = payload
    },
    ADD_LOCUM_DECLINED_JOBS(state, payload){
        console.log('add locum declined jobs is working', payload)
        state.locum_declined_jobs.unshift(payload)
        state.locum_declined_jobs_count = state.locum_declined_jobs_count + 1
        if(state.locum_declined_jobs_count > 10){
            state.locum_declined_jobs.pop()
        }
    },
    //====================COMPLETED===================
    SET_LOCUM_COMPLETED_JOBS(state, payload){
        state.locum_completed_jobs = payload

    },
    SET_LOCUM_COMPLETED_JOBS_COUNT(state, payload){
        state.locum_completed_jobs_count = payload
    },
    ADD_LOCUM_COMPLETED_JOBS(state, payload){
        console.log('add locum completed jobs is working', payload)
        state.locum_completed_jobs.unshift(payload)
        state.locum_completed_jobs_count = state.locum_completed_jobs_count + 1
        if(state.locum_completed_jobs_count > 10){
            state.locum_completed_jobs.pop()
        }
    },
    
}   