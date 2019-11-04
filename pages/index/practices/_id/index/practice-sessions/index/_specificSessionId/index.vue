<template>
    <div class="practice-modal">
      <div @click="goBack()" class="cursor-pointer m-6">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current"/>
      </div>
      <div v-if="!isJobParts">
        <PracticeSessionModal :job="job"/>
      </div>
      <div v-if="isJobParts">
        <JobPartModal :specificJobPart="job" :isNuxtChild="true"/>
      </div>
    </div>
</template>
<script>
import PracticeSessionModal from '@/components/Practices/Sessions/PracticeSessionModal'
import JobPartModal from '@/components/Base/JobPartModal'
export default {
  components:{
    PracticeSessionModal,
    JobPartModal
  },
  data(){
    return{
      job: '',
      isJobParts: ''
    }
  },
  async asyncData({ app, store, route, error }){
    try{
      const isJobParts = route.query
        && route.query.status
        && (
          route.query.status.toLowerCase() === 'ongoing'
          || route.query.status.toLowerCase() === 'completed'
          || route.query.status.toLowerCase() === 'approved'
        )
      console.log(route.params.specificSessionId)
      let response = await app.$axios.get(`/api/v1/admin/${isJobParts === true ? 'job-parts' : 'jobs'}/${route.params.specificSessionId}`)
      let job = ''

      if(isJobParts == true){
        job = response.data.data.job_part
      }else{
        job = response.data.data.job
      }
      
      console.log('job',job)
      store.commit('jobs/TOGGLE_LOADING', false)
      return{
        job,
        isJobParts
      }
    }catch(err){
      error({ statusCode: 404})
      console.log('get job error!',err)
    }
  },
  methods:{
    goBack(){
      const query = {
          ...this.$route.query
      }
      delete query.status
      this.$router.push({path:`/practices/${this.$route.params.id}`,query})
    },
  }
}
</script>
<style>
.practice-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px orange;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .practice-modal {
    width: 80%;
  }
}
</style>