<template>
    <div class="mt-5">
        <LocumJobs :user="user"/>
    </div>
</template>
<script>
import LocumJobs from '@/components/Locums/LocumJobs'
export default {
    components:{
        LocumJobs
    },
    data(){
        return{
            // user:null
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