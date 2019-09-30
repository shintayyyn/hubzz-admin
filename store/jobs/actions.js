import * as jobsApi from '@/api/jobs'

export default{
    async initializeAdminJobTransactionListener({ state, commit, dispatch }) {
        //=============MANUAL TRIGGERS BY LOCUM=============
        this.$socket.on("locumAppliedToJob",async jobId => {
            let locumJobParams = {
                viewing_locum_user_id : state.viewing_jobs_locum_user_id,
                jobId,
            }
            const response = await jobsApi.fetchSpecificJob(this.$axios,locumJobParams)
            const locumJob = response.data.job
            console.log('locumJob', locumJob)
            commit('ADD_LOCUM_APPLIED_JOBS', locumJob)
            commit('DEDUCT_LOCUM_AVAILABLE_JOBS', locumJob)
            commit('ADD_PRACTICE_APPLIED_SESSIONS', locumJob)
        })
        this.$socket.on("locumUnsuccessfulJob",async jobId => {
            let locumJobParams = {
                viewing_locum_user_id : state.viewing_jobs_locum_user_id,
                jobId,
            }
            const response = await jobsApi.fetchSpecificJob(this.$axios,locumJobParams)
            const locumJob = response.data.job
            commit('ADD_LOCUM_UNSUCCESSFUL_JOBS', locumJob)
        })
        this.$socket.on("locumDeclinedJob", async jobId => {
            let locumJobParams = {
                viewing_locum_user_id : state.viewing_jobs_locum_user_id,
                jobId,
            }
            const response = await jobsApi.fetchSpecificJob(this.$axios,locumJobParams)
            const locumJob = response.data.job
            commit('ADD_LOCUM_DECLINED_JOBS', locumJob)
            commit('DEDUCT_LOCUM_CURRENT_JOBS', locumJob)
            commit('ADD_PRACTICE_DECLINED_SESSIONS',locumJob)
        })
        
        //===========MANUAL TRIGGERS BY PRACTICE================
        
        this.$socket.on("practiceAppointLocum", async jobId => {
            // commit('UPDATE_PRACTICE_ALLOCATED_SESSIONS', jobId)
            // commit('UPDATE_LOCUM_CURRENT_JOBS', jobId)
            // commit('UPDATE_LOCUM_UNSUCCESSFUL_JOBS', jobId)
        })
        this.$socket.on("practiceCancelJob", async jobId => {
            // commit('UPDATE_PRACTICE_CANCELLED_SESSIONS', jobId)
        })
        
        this.$socket.on("practiceTerminateJob", async jobId => {
            // commit('UPDATE_PRACTICE_COMPLETED_SESSIONS', jobId)
        })

    },
    async fetchLocumJobs({ commit }, payload){
        const response = await jobsApi.fetchLocumJobs(this.$axios, payload)
    },
    async fetchSpecificJob({ commit }, payload){
        const response = await jobsApi.fetchSpecificJob(this.$axios, payload)
    }
}