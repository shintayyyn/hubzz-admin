<template>
    <div>
        <PracticeCancelledSessions :practice='practice'/>
    </div>
</template>
<script>
import PracticeCancelledSessions from '@/components/Practices/Sessions/PracticeCancelledSessions'
export default {
    components:{
        PracticeCancelledSessions
    },
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