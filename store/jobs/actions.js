import * as jobsApi from '@/api/jobs'

export default{
    async initializeAdminJobTransactionListener({ state, commit, dispatch }) {
        //=============MANUAL TRIGGERS BY LOCUM=============
        this.$socket.on("locumAppliedToJob",async jobId => {
            commit('UPDATE_LOCUM_APPLIED_JOBS', jobId)
        })
        this.$socket.on("locumUnsuccessfulJob",async jobId => {
            commit('UPDATE_LOCUM_UNSUCCESSFUL_JOBS', jobId)
        })
        this.$socket.on("locumDeclinedJob", async jobId => {
            commit('UPDATE_LOCUM_DECLINED_JOBS', jobId)
        })
        //===========MANUAL TRIGGERS BY ADMIN================
        this.$socket.on("practiceAppointLocum", async jobId => {
            commit('UPDATE_PRACTICE_ALLOCATED_SESSIONS', jobId)
        })
        this.$socket.on("practiceCancelJob", async jobId => {
            
        })
        this.$socket.on("practiceCreateNewJob", async jobId => {

        })
        this.$socket.on("practiceTerminateJob", async jobId => {

        })
    },
    async fetchLocumJobs({ commit }, payload){
        const response = await jobsApi.fetchLocumJobs(this.$axios, payload)
    }
}