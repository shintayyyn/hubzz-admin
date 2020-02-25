<template>
  <div class="mt-5">
    <transition name="fade" mode="out-in">    
        <PracticeDocuments :practice="practice"/>
    </transition>
    <nuxt-child/>
  </div>
</template>
<script>
import PracticeDocuments from '@/components/Practices/PracticeDocuments'
export default {
    components:{
        PracticeDocuments
    },
    transition:{
        name:'fade',
        mode:'out-in'
    },
    data(){
        return{
            // practice: null
        }
    },
    computed:{
      practice(){
        return this.$store.state.practices.practice
      }
    },
    async asyncData({app, store, route}){
        try{
            let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
            const practice = response.data.practice
            await store.commit('practices/SET_SPECIFIC_PRACTICE', practice)
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
<style>

</style>