<template>
  <div class="mt-5">
    <div>
        <!-- <AppLoading :loading="loadingJobs" :message="'Loading Sessions'"/> -->
    </div>
    <SessionsTabs :practice="practice" :practice_surgery="practice_surgery"/>
    <nuxt-child/>
  </div>
</template>
<script>
import SessionsTabs from '@/components/Practices/SessionsTabs'
import AppLoading from '@/components/Base/AppLoading'
export default {
  components:{
    SessionsTabs,
    AppLoading
  },
  data(){
    return{
      practice: '',
      practice_surgery: '',
    }
  },

  created(){
    const query = {
      ...this.$route.query,
    }
    this.$router.push(`/practices/${this.practice.id}/practice-surgeries/${this.practice_surgery.id}/surgery-sessions/surgery-live-sessions`, query)
  },

  async asyncData({ app, route, }){
    try{
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice
      response = await app.$axios.$get(`/api/v1/admin/practices/${practice.id}/practice-surgeries/${route.params.practiceSurgeryId}`)
      const practice_surgery = response.data.practice_surgery
      console.log('practice', practice)
      console.log('practice surgery', practice_surgery)
      return{
        practice,
        practice_surgery
      }
    }catch(err){
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log('get practice/practice surgery error', err)
    }
  },
}
</script>
<style>

</style>