<template>
  <div>
    <!-- TABS  GO HERE -->
    <!-- <CompletedSessionsTabs :practice="practice"/> -->
    <!-- <PracticeCompletedSessions :practice='practice'/> -->
    <!-- <nuxt-child/> -->

    <PracticeCompletedSessionsParts :practice='practice' />
  </div>
</template>
<script>
import PracticeCompletedSessionsParts from '@/components/Practices/Sessions/PracticeCompletedSessionsParts'
export default {
    components:{
      PracticeCompletedSessionsParts
    },
    // created(){
    //   const query = {
    //     ...this.$route.query,
    //   }
    //   this.$router.push(`/practices/${this.practice.id}/practice-sessions/practice-completed-sessions/to-be-invoiced`, query)
    // },
    computed:{
        practice(){
            return this.$store.state.practices.practice
        }
    },
    async asyncData({ app, store, route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
            const practice = response.data.data.practice
            await store.commit('practices/SET_SPECIFIC_PRACTICE',practice)
            return{

            }
        }catch(err){
            store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
            console.log('get practice error!!!!',err)
        }
    }
    
}
</script>
<style>

</style>