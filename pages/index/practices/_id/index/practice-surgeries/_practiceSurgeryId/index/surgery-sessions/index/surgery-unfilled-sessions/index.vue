<template>
  <div>
    <PracticeUnfilledSessions :practice="practice" :practiceSurgery="practiceSurgery" />
  </div>
</template>
<script>
import PracticeUnfilledSessions from '@/components/Practices/Sessions/PracticeUnfilledSessions'
export default {
  components:{
    PracticeUnfilledSessions
  },
  data (){
    return{
      practice: '',
      practiceSurgery: ''
    }
  },
  async asyncData ({ app, store, route }){
    try{
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice
      response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/practice-surgeries/${route.params.practiceSurgeryId}`)
      const practiceSurgery = response.data.practice_surgery
      return{
        practice,
        practiceSurgery
      }
    }catch(err){
      store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      console.log('get sessions error',err)
    }
  }
}
</script>
<style>

</style>