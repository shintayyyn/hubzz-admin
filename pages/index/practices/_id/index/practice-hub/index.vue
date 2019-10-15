<template>
    <div>
        <div class="mt-5">
            <transition name="fade" mode="out-in">
                <PracticeHub :practice="practice" :practiceHub="practiceHub" :practiceParent="practiceParent"/>
            </transition>
        </div>
        <nuxt-child/>
    </div>
</template>
<script>
import PracticeHub from '@/components/Practices/PracticeHub'
export default {
    middleware: 'changedPracticeType',
    components:{
        PracticeHub
    },
    data(){
        return{
            // practice:'',
            // practiceHub:'',
            // practiceParent:''
        }
    },
    computed:{
        practice(){
            return this.$store.state.practices.practice
        },
        practiceHub(){
            return this.$store.state.practices.practiceHub
        },
        practiceParent(){
            return this.$store.state.practices.practiceParent
        }
    },
    async asyncData({ app, store, route, error }){
      try{
        //Practice Hub is the Practice's data as the Hub
        //Practice Parent is the Practice's data as a Specific Practice
        let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
        const practice = response.data.data.practice

        response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}/parent-surgery`)
        const practiceHub = response.data.data.practice
              
        let practiceParent = ''
        if (practiceHub.parent_surgery && practiceHub.parent_surgery.practice) {
            response = await app.$axios.get(`/api/v1/admin/practices/${practiceHub.parent_surgery.practice.id}`)
            practiceParent = response.data.data.practice
            await store.commit('practices/SET_PRACTICE_PARENT',practiceParent) 
        }
        await store.commit('practices/SET_SPECIFIC_PRACTICE',practice)
        await store.commit('practices/SET_PRACTICE_HUB',practiceHub)
      
        // return{
        //     practice,
        //     practiceHub,
        //     practiceParent,
        // }
      }catch(err){
        error({statusCode: 404})
        store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
        console.log('get parent practice error!!',err)
      }
    }
    
}
</script>
<style>
</style>