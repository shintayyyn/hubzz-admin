<template>
    <div class="practice-modal">
      <div @click="goBack()" class="cursor-pointer m-6">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white fill-current"/>
      </div>
      <PracticeSessionModal :job="job"/>
    </div>
</template>
<script>
import PracticeSessionModal from '@/components/Practices/Sessions/PracticeSessionModal'
export default {
  components:{
    PracticeSessionModal
  },
  data(){
    return{
      job: ''
    }
  },
  async asyncData({ app, store, route }){
    try{
      console.log(route.params.specificSessionId)
      let response = await app.$axios.get(`/api/v1/admin/jobs/${route.params.specificSessionId}`)
      const job = response.data.data.job
      console.log('job',job)
      store.commit('jobs/TOGGLE_LOADING', false)
      return{
        job
      }
    }catch(err){
      console.log('get job error!',err)
    }
  },
  methods:{
    goBack(){
      const query = {
          ...this.$route.query
      }
      this.$router.push({path:`/practices/${this.$route.params.id}/practice-sessions`,query})
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