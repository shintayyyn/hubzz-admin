import * as jobsApi from '@/api/jobs'
export default{
    async initializeAdminJobTransactionListener ({ state, commit, dispatch }) {
        //=============MANUAL TRIGGERS BY LOCUM=============
        this.$socket.on("locumAppliedToJob",async jobId => {
            let locumJobParams = {
                viewing_locum_user_id : state.viewing_jobs_locum_user_id,
                jobId,
                countOnly : true
            }
    
            let practiceSessionParams = {
                viewing_practice_id : state.viewing_sessions_practice_id,
                jobId
            }
            let response = await jobsApi.fetchSpecificJob(this.$axios,locumJobParams)
            const locumJob = response.data.job
            response = await jobsApi.fetchSpecificJob(this.$axios, practiceSessionParams)
            const practiceSession = response.data.job

            commit('ADD_LOCUM_APPLIED_JOBS', locumJob)
            commit('DEDUCT_LOCUM_AVAILABLE_JOBS', locumJob)
            commit('DEDUCT_LOCUM_MATCHED_JOBS', locumJob)
            commit('ADD_PRACTICE_APPLIED_SESSIONS', practiceSession)
        })
        this.$socket.on("locumUnsuccessfulJob",async jobId => {
            let locumJobParams = {
                viewing_locum_user_id : state.viewing_jobs_locum_user_id,
                jobId,
                countOnly : true
            }
            
            let response = await jobsApi.fetchSpecificJob(this.$axios,locumJobParams)
            const locumJob = response.data.job
            commit('ADD_LOCUM_UNSUCCESSFUL_JOBS', locumJob)
        })
        this.$socket.on("locumWithdrawnJob", async jobId => {
            let locumJobParams = {
                viewing_locum_user_id : state.viewing_jobs_locum_user_id,
                jobId,
                countOnly : true
            }
            let practiceSessionParams = {
                viewing_practice_id : state.viewing_sessions_practice_id,
                jobId
            }
            let response = await jobsApi.fetchSpecificJob(this.$axios,locumJobParams)
            const locumJob = response.data.job
            response = await jobsApi.fetchSpecificJob(this.$axios, practiceSessionParams)
            const practiceSession = response.data.job

            commit('ADD_LOCUM__JOBS', locumJob)
            commit('DEDUCT_LOCUM_CURRENT_JOBS', locumJob)
            commit('ADD_PRACTICE_WITHDRAWN_SESSIONS',practiceSession)
        })
        
        //===========MANUAL TRIGGERS BY PRACTICE================
        this.$socket.on("practiceCreateNewJob", async jobId => {
            let locumJobParams = {
                viewing_locum_user_id : state.viewing_jobs_locum_user_id,
                jobId,
                countOnly : true
            }
    
            let practiceSessionParams = {
                viewing_practice_id : state.viewing_sessions_practice_id,
                jobId
            }
            let response = await jobsApi.fetchSpecificJob(this.$axios,practiceSessionParams)
            const practiceSession = response.data.job
            response = await jobsApi.fetchSpecificJob(this.$axios, locumJobParams)
            const locumJob = response.data.job

            commit('ADD_PRACTICE_AVAILABLE_SESSIONS', practiceSession)

            //IF JOB IS AVAILABLE ON VIEWING LOCUM:
            locumJobParams.locum_status = 'Available'
            response = await jobsApi.fetchLocumJobs(this.$axios, locumJobParams)
            let jobCount = response.data.count
            if(jobCount > 0){
                commit('ADD_LOCUM_AVAILABLE_JOBS', locumJob)
            }
            locumJobParams.locum_status = 'Matched'
            response = await jobsApi.fetchLocumJobs(this.$axios, locumJobParams)
            jobCount = response.data.count
            if(jobCount > 0){
                commit('ADD_LOCUM_MATCHED_JOBS', locumJob)
            }
        })
        this.$socket.on("practiceAppointLocum", async jobId => {
            // console.log('locum user', state.viewing_jobs_locum_user_id)
            let practiceSessionParams = {
                viewing_practice_id : state.viewing_sessions_practice_id,
                jobId
            }
            let locumJobParams = {
                viewing_locum_user_id : state.viewing_jobs_locum_user_id,
                jobId,
                countOnly : true
            }

            let response = await jobsApi.fetchSpecificJob(this.$axios,practiceSessionParams)
            const practiceSession = response.data.job
            response = await jobsApi.fetchSpecificJob(this.$axios, locumJobParams)
            const locumJob = response.data.job
            
            commit('ADD_PRACTICE_CURRENT_SESSIONS', practiceSession)
            commit('DEDUCT_PRACTICE_APPLIED_SESSIONS', practiceSession)
            commit('DEDUCT_LOCUM_APPLIED_JOBS', locumJob)

            //IF VIEWING LOCUM IS APPOINTED TO THE JOB 
            locumJobParams.locum_status = 'Current'
            response = await jobsApi.fetchLocumJobs(this.$axios, locumJobParams)
            let jobCount = response.data.count
            if(jobCount > 0){
                commit('ADD_LOCUM_CURRENT_JOBS',locumJob)
            }else{
                //IF VIEWING LOCUM IS NOT THE ONE APPOINTED IN THE JOB, WHILE VIEWING LOCUM IS APPLIED
                locumJobParams.locum_status = 'Unsuccessful'
                response = await jobsApi.fetchLocumJobs(this.$axios, locumJobParams)
                jobCount = response.data.count
                if(jobCount > 0){
                    commit('ADD_LOCUM_UNSUCCESSFUL_JOBS',locumJob)
                }
            }
        })
        this.$socket.on("practiceCancelJob", async jobId => {
            let locumJobParams = {
                viewing_locum_user_id : state.viewing_jobs_locum_user_id,
                jobId,
                countOnly : true
            }
    
            let practiceSessionParams = {
                viewing_practice_id : state.viewing_sessions_practice_id,
                jobId
            }

            let response = await jobsApi.fetchSpecificJob(this.$axios,practiceSessionParams)
            const practiceSession = response.data.job
            response = await jobsApi.fetchSpecificJob(this.$axios, locumJobParams)
            const locumJob = response.data.job
            
            commit('ADD_PRACTICE_CANCELLED_SESSIONS', practiceSession)
            commit('ADD_PRACTICE_COMPLETED_SESSIONS', practiceSession)
            commit('DEDUCT_PRACTICE_CURRENT_SESSIONS', practiceSession)
            commit('DEDUCT_LOCUM_CURRENT_JOBS', locumJob)

            locumJobParams.locum_status = 'Cancelled'
            response = await jobsApi.fetchLocumJobs(this.$axios, locumJobParams)
            jobCount = response.data.count
            if(jobCount > 0){
                commit('ADD_LOCUM_CANCELLED_JOBS', locumJob)  
            } 
            locumJobParams.locum_status = 'Completed'
            response = await jobsApi.fetchLocumJobs(this.$axios, locumJobParams)
            jobCount = response.data.count
            if(jobCount > 0){
                commit('ADD_LOCUM_COMPLETED_JOBS', locumJob)
            }
            
        })
        this.$socket.on("practiceTerminateJob", async jobId => { //job is currently ongoing
            let locumJobParams = {
                viewing_locum_user_id : state.viewing_jobs_locum_user_id,
                jobId,
                countOnly : true
            }
    
            let practiceSessionParams = {
                viewing_practice_id : state.viewing_sessions_practice_id,
                jobId
            }

            let response = await jobsApi.fetchSpecificJob(this.$axios,practiceSessionParams)
            const practiceSession = response.data.job
            response = await jobsApi.fetchSpecificJob(this.$axios, locumJobParams)
            const locumJob = response.data.job

            commit('ADD_PRACTICE_CANCELLED_SESSIONS', practiceSession)
            commit('ADD_PRACTICE_COMPLETED_SESSIONS', practiceSession)
            commit('DEDUCT_PRACTICE_CURRENT_SESSIONS', practiceSession)
            commit('DEDUCT_LOCUM_CURRENT_JOBS', locumJob)

            locumJobParams.locum_status = 'Cancelled'
            response = await jobsApi.fetchLocumJobs(this.$axios, locumJobParams)
            jobCount = response.data.count
            if(jobCount > 0){
                commit('ADD_LOCUM_CANCELLED_JOBS', locumJob)  
            } 
            locumJobParams.locum_status = 'Completed'
            response = await jobsApi.fetchLocumJobs(this.$axios, locumJobParams)
            jobCount = response.data.count
            if(jobCount > 0){
                commit('ADD_LOCUM_COMPLETED_JOBS', locumJob)
            }

        })
    },

    async fetchLocumJobs({ commit }, payload) {
      commit('TOGGLE_LOADING', true)
      const response = await jobsApi.fetchLocumJobs(this.$axios, payload)
      commit('TOGGLE_LOADING', false)

      // Allocated
      // Applied
      // Available
      // Completed
      // Matched
      // Unsuccessful

      // ====PARTS=====
      // Approved
      // Cancelled
      // Ongoing
      // Withdrawn
    },

    async fetchPracticeSessions({ commit }, payload) {
      commit('TOGGLE_LOADING', true)
      const response = await jobsApi.fetchPracticeSessions(this.$axios, payload)
      commit('TOGGLE_LOADING', false)
      // Allocated
      // Applied
      // Live
      // Pending
      // Unfilled
      if (payload.countOnly) {
        payload.status.forEach(jobStatus => {
          if (jobStatus.toLowerCase() === 'allocated') {
            commit('SET_PRACTICE_ALLOCATED_SESSIONS_COUNT', response.data.count)
          }
          if (jobStatus.toLowerCase() === 'applied') {
            commit('SET_PRACTICE_APPLIED_SESSIONS_COUNT', response.data.count)
          }
          if (jobStatus.toLowerCase() === 'live') {
            commit('SET_PRACTICE_AVAILABLE_SESSIONS_COUNT', response.data.count)
          }
          if (jobStatus.toLowerCase() === 'unsuccessful') {
            commit('SET_PRACTICE_UNSUCCESSFUL_SESSIONS_COUNT', response.data.count)
          }
          if (jobStatus.toLowerCase() === 'cancelled') {
            commit('SET_PRACTICE_CANCELLED_SESSIONS_COUNT', response.data.count)
          }
          if (jobStatus.toLowerCase() === 'withdrawn') {
            commit('SET_PRACTICE_WITHDRAWN_SESSIONS_COUNT', response.data.count)
          }
          if (jobStatus.toLowerCase() === 'pending') {
            commit('SET_PRACTICE_PENDING_SESSIONS_COUNT', response.data.count)
          }
          // FETCH PENDING PRACTICE
        })
      }
      if (!payload.countOnly) {
        payload.status.forEach(jobStatus => {
          if (jobStatus.toLowerCase() === 'allocated') {
            commit('SET_PRACTICE_ALLOCATED_SESSIONS', response.data.jobs && response.data.jobs.length > 0 ?
            response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'allocated') : [])
          }
          if (jobStatus.toLowerCase() === 'applied') {
            commit('SET_PRACTICE_APPLIED_SESSIONS', response.data.jobs && response.data.jobs.length > 0 ?
            response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'applied') : [])
          }
          if (jobStatus.toLowerCase() === 'live') {
            commit('SET_PRACTICE_AVAILABLE_SESSIONS', response.data.jobs && response.data.jobs.length > 0 ?
            response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'live') : [])
          }
          if (jobStatus.toLowerCase() === 'unfilled') {
            commit('SET_PRACTICE_UNFILLED_SESSIONS', response.data.jobs && response.data.jobs.length > 0 ?
            response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'unfilled') : [])
          }
          if (jobStatus.toLowerCase() === 'cancelled') {
            commit('SET_PRACTICE_CANCELLED_SESSIONS', response.data.jobs && response.data.jobs.length > 0 ?
            response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'cancelled') : [])
          }
          if (jobStatus.toLowerCase() === 'withdrawn') {
            commit('SET_PRACTICE_WITHDRAWN_SESSIONS', response.data.jobs && response.data.jobs.length > 0 ?
            response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'withdrawn') : [])
          }
          if (jobStatus.toLowerCase() === 'pending') {
            commit('SET_PRACTICE_PENDING_SESSIONS', response.data.jobs && response.data.jobs.length > 0 ?
            response.data.jobs.filter(jobPart => jobPart.status.toLowerCase() === 'pending') : [])
          }
          // FETCH PENDING PRACTICE
        })
      }
    },

    async fetchJobParts({ commit }, payload) {
      console.log('payload', payload)
      commit('TOGGLE_LOADING', true)
      const response = await jobsApi.fetchJobParts(this.$axios, payload)
      commit('TOGGLE_LOADING', false)
      // ongoing
      // completed
      // approved
      // cancelled
      // withdrawn
      if (payload.forBilling === true) {
        if(payload.countOnly) {
          console.log('job parts billing count', response.data.count)
          commit('SET_HUBZZ_BILLING_SESSIONS_COUNT', response.data.count)
        }
        if(!payload.countOnly) {
          response.data.job_parts = await response.data.job_parts.map(item => {
            return {
              ...item,
              isGp: item.profession.name === "GP" ? "GP" : "Non-GP",
              tag_status: item.terminated ? "Terminated" : item.status,
              date_time_start: `${this.$moment(item.date_start)
                .format("DD-MM-YYYY")} | ${item.time_start}`,
              date_time_end: `${this.$moment(item.date_end)
                .format("DD-MM-YYYY")} | ${item.time_end}`
            }
          })
          console.log('job parts billing', response.data.job_parts)
          commit('SET_HUBZZ_BILLING_SESSIONS', response.data.job_parts)
        }
      }

      if (payload.countOnly) {
        if (payload.status) {
          payload.status.forEach(jobStatus => {
            if (jobStatus.toLowerCase() === 'ongoing') {
              commit('SET_PRACTICE_ONGOING_SESSIONS_COUNT', response.data.count)
            }
            if (jobStatus.toLowerCase() === 'completed') {
              commit('SET_PRACTICE_COMPLETED_SESSIONS_COUNT', response.data.count)
            }
            if (jobStatus.toLowerCase() === 'approved') {
              commit('SET_PRACTICE_APPROVED_SESSIONS_COUNT', response.data.count)
            }
            if(jobStatus.toLowerCase() === 'cancelled') {
              commit('SET_PRACTICE_CANCELLED_SESSIONS_COUNT', response.data.count)
            }
            if(jobStatus.toLowerCase() === 'withdrawn') {
              commit('SET_PRACTICE_WITHDRAWN_SESSIONS_COUNT', response.data.count)
            }
          })
        }
      }

      if (!payload.countOnly) {
        if (payload.status) {
          payload.status.forEach(jobStatus => {
            if (jobStatus.toLowerCase() === 'ongoing') {
              commit('SET_PRACTICE_ONGOING_SESSIONS', response.data.job_parts)
            }
            if (jobStatus.toLowerCase() === 'completed') {
              commit('SET_PRACTICE_COMPLETED_SESSIONS', response.data.job_parts)
            }
            if (jobStatus.toLowerCase() === 'approved') {
              commit('SET_PRACTICE_APPROVED_SESSIONS', response.data.job_parts)
            }
            if(jobStatus.toLowerCase() === 'cancelled') {
              commit('SET_PRACTICE_CANCELLED_SESSIONS', response.data.job_parts)
            }
            if(jobStatus.toLowerCase() === 'withdrawn') {
              commit('SET_PRACTICE_WITHDRAWN_SESSIONS', response.data.job_parts)
            }
          })
        }
      }
    },

    async fetchSpecificJob ({ commit }, payload){
      const response = await jobsApi.fetchSpecificJob(this.$axios, payload)
    }
}