<template>
  <div class="mt-5">
    <transition name="fade" mode="out-in">
      <PracticeSurgeries :practice="practice"/>
    </transition>
    <nuxt-child/>
  </div>
</template>
<script>
import PracticeSurgeries from '@/components/Practices/PracticeSurgeries'
export default {
  middleware: 'changedPracticeType',
  transition:{
    name:'fade',
    mode:'out-in'
  },
  components:{
    PracticeSurgeries,
  },
  data() {
    return {
      // practice:null,
    }
  },
  computed:{
    practice(){
      return this.$store.state.practices.practice
    }
  },
  async asyncData({app,store,route}){
    try{
      let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.data.practice
      await store.commit('practices/SET_SPECIFIC_PRACTICE',practice)

      return{
        // practice
      }
    }catch(err){
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log('get practice error!!!!',err)
    }
  }
}
</script>
