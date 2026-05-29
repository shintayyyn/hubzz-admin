<template>
  <div class="">
    <PracticeSessionModal :jobPart="job_part" :job="job_part ? job_part.job : null" />
  </div>
</template>

<script>
import PracticeSessionModal from '@/components/Practices/PracticeSessionModal'

export default {
  components: {
    PracticeSessionModal
  },

  data() {
    return {
      job_part: '',
      practiceId: ''
    }
  },

  async asyncData({ app, store, route, error }) {
    try {
      const jobResponse = await app.$axios.$get(`/api/v1/admin/jobs/${route.params.practiceSessionId}`)
      const job = jobResponse.data.job
      const jobPartId = job && job.job_parts && job.job_parts.length > 0 ? job.job_parts[0].id : null

      if (!jobPartId) {
        throw new Error('Applied job has no job parts.')
      }

      const jobPartResponse = await app.$axios.$get(`/api/v1/admin/job-parts/${jobPartId}`)
      const job_part = jobPartResponse.data.job_part
      const practiceId = route.params.id
      return {
        job_part,
        practiceId
      }
    } catch (err) {
      error({ statusCode: 404 })
      store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      console.log('get applied session error!', err)
    }
  }
}
</script>

<style>
.job-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #FFC72C;
  transition: all 0.3s ease-in-out;
  background-color: #505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .job-modal {
    width: 70%;
  }
}
</style>
