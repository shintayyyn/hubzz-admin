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
      job: null
    }
  },

  async asyncData({ app, route, error }) {
    try {
      const { practiceSessionId } = route.params

      const response = await app.$axios.get(`/api/v1/admin/jobs/${practiceSessionId}`)

      const job = response.data.data.job

      return {
        job
      }
    } catch (err) {
      error(err)
    }
  }
}
</script>
