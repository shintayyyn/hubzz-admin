<template>
  <div class="">
    <PracticeSessionModal :job="job" />
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
      job: ''
    }
  },
  async asyncData({ app, store, route, error }) {
    try {
      let response = await app.$axios.$get(`/api/v1/admin/jobs/${route.params.practiceSessionId}`)
      const job = response.data.job
      return {
        job
      }
    } catch (err) {
      error({ statusCode: 404 })
      store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
    }
  }
}
</script>
