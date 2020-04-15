<template>
  <div>
    <PracticeApprovedSessionsParts :practice="practice" :practiceSurgery="practiceSurgery"/>
  </div>
</template>
<script>
import PracticeApprovedSessionsParts from '@/components/Practices/Sessions/PracticeApprovedSessionsParts'
export default {
  components:{
    PracticeApprovedSessionsParts
  },
  data (){
    return{
      practiceSurgery: ''
    }
  },
  computed: {
    practice (){
      return this.$store.state.practices.practice
    }
  },
  async asyncData ({ app, store, route }){
    try{
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice
      await store.commit('practices/SET_SPECIFIC_PRACTICE',practice)
      response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/practice-surgeries/${route.params.practiceSurgeryId}`)
      const practiceSurgery = response.data.practice_surgery
      return{
        practiceSurgery
      }
    }catch(err){
      store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: 'Something went wrong!' })
      console.log('get job parts error', err)
    }
  },  
}
</script>
<style>

</style>