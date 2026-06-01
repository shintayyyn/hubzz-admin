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
      job_part: ''
    }
  },
  async asyncData({ app, store, route, error }) {
    try {
      let response = await app.$axios.$get(`/api/v1/admin/job-parts/${route.params.practiceSessionPartId}`)
      const job_part = response.data.job_part
      return {
        job_part
      }
    } catch (err) {
      error({ statusCode: 404 })
      store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
    }
  }
}
</script>
