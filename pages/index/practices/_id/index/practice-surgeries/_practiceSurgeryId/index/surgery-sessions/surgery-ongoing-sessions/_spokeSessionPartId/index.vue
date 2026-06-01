<template>
  <div>
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
      let response = await app.$axios.$get(`/api/v1/admin/job-parts/${route.params.spokeSessionPartId}`)
      const job_part = response.data.job_part
      const practiceId = route.params.id
      return {
        job_part,
        practiceId
      }
    } catch (err) {
      error({ statusCode: 404 })
      store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      console.log('get job error!', err)
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
  border-left: solid 2px #ffc72c;
  transition: all 0.3s ease-in-out;
  background-color: #505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .job-modal {
    width: 60%;
  }
}
</style>
