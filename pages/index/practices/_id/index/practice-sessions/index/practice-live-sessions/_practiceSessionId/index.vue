<template>
  <div class="job-modal shadow-lg">
    <div class="mt-4 md:mt-6 mx-4 md:mx-8">
      <nuxt-link :to="{ path: `/practices/${$route.params.id}/practice-sessions/practice-live-sessions`}" class="cursor-pointer">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current" />
      </nuxt-link>
    </div>

    <PracticeSessionModal :job="job" />
  </div>
</template>

<script>
import PracticeSessionModal from '@/components/Practices/Sessions/PracticeSessionModal'

export default {
  components:{
    PracticeSessionModal,
  },  

  data () {
    return {
      job: null,
    }
  },

  async asyncData ({ app, route, error }) {
    try {
      const {
        practiceSessionId,
      } = route.params

      const response = await app.$axios.get(`/api/v1/admin/jobs/${practiceSessionId}`)

      const job = response.data.data.job

      return {
        job,
      }
    } catch (err) {
      console.log('err', err.response || err)
      error(err)
    }
  },
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
    background-color:#505561;
    z-index: 512;
  }

  @media screen and (min-width: 1200px) {
    .job-modal {
      width: 70%;
    }
  }
</style>
