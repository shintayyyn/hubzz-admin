<template>
    <div class="mt-5">
        <SessionsTabs :practice="practice"/>
        <nuxt-child/>
    </div>
</template>
<script>
import SessionsTabs from '@/components/Practices/SessionsTabs'
export default {
    transition:{
        name:'fade',
        mode:'out-in'
    },
    components:{
        SessionsTabs

    },
    data() {
        return {
            // practice:null,
        }
    },
    created(){
        if(this.$route.name == 'index-practices-id-index-practice-sessions-index'){
            this.$router.push({path:`/practices/${this.practice.id}/practice-sessions/practice-available-sessions`}).catch(err => {})
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