import * as jobsApi from '@/api/jobs'

export default{
    async initializeAdminJobTransactionListener({ state, commit, dispatch }) {
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
        this.$socket.on("locumDeclinedJob", async jobId => {
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

            commit('ADD_LOCUM_DECLINED_JOBS', locumJob)
            commit('DEDUCT_LOCUM_CURRENT_JOBS', locumJob)
            commit('ADD_PRACTICE_DECLINED_SESSIONS',practiceSession)
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
            const jobCount = response.data.count
            if(jobCount < 1){

            }
            //commit('ADD_LOCUM_AVAILABLE_JOBS',locumJob)
            //IF JOB IS MATCHED
            //commit('ADD_LOCUM_AVAILABLE_JOBS',locumJob)
            //commit('ADD_LOCUM_MATCHED_JOBS',locumJob)
            
            
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
            commit('DEDUCT_PRACTICE_AVAILABLE_SESSIONS', practiceSession)
        })
        
        this.$socket.on("practiceTerminateJob", async jobId => {
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
            commit('ADD_LOCUM_CANCELLED_JOBS', locumJob)
            commit('ADD_LOCUM_COMPLETED_JOBS', locumJob)

            commit('DEDUCT_PRACTICE_CURRENT_SESSIONS', practiceSession)
            commit('DEDUCT_LOCUM_CURRENT_JOBS', locumJob)

        })

    },
    async fetchLocumJobs({ commit }, payload){
        const response = await jobsApi.fetchLocumJobs(this.$axios, payload)
    },
    async fetchSpecificJob({ commit }, payload){
        const response = await jobsApi.fetchSpecificJob(this.$axios, payload)
    }
}