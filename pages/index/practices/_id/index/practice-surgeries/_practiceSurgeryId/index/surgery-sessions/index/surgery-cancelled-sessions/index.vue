<template>
  <div>
    <PracticeCancelledSessions :practice="practice" :practice_surgery="practice_surgery" />
  </div>
</template>
<script>
import PracticeCancelledSessions from '@/components/Practices/Sessions/PracticeCancelledSessions'
export default {
  components:{
    PracticeCancelledSessions
  },
  computed:{

  },
  data(){
    return{
      practice: '',
      practice_surgery: ''
    }
  },
  async asyncData({ app, store, route }){
    try{
      let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.data.practice
      response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}/practice-surgeries/${route.params.practiceSurgeryId}`)
      const practice_surgery = response.data.data.practice_surgery
      return{
        practice,
        practice_surgery
      }
    }catch(err){
      console.log('get sessions error',err)
    }
  }
}
</script>
<style>

</style>