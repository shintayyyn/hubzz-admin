<template>
    <div class="mt-5">
        <LocumJobsTabs :user="user"/>
        <nuxt-child/>
    </div>
</template>
<script>
import LocumJobsTabs from '@/components/Locums/LocumJobsTabs'
export default {
    components:{
        LocumJobsTabs
    },
    data(){
        return{
        }
    },
    created(){
        if(this.$route.name == 'index-locums-id-index-locum-jobs-index'){
            this.$router.push({path:`/locums/${this.user.id}/locum-jobs/locum-current-jobs`, query: this.$route.query})
        }
    },
    computed:{
        user(){
            return this.$store.state.locums.locumUser
        }
    },
    async asyncData({app, store, route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
            const user = response.data.data.user

            await store.commit('locums/SET_LOCUM_USER', user)
            await store.commit('jobs/SET_JOBS_LOCUM_USER_ID_VIEWER',user.id )
            return{
                // user
            }
        }catch(err){
            store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
			console.log('Get locum job error',err)
        }
    }
    
}
</script>
<style>

</style>