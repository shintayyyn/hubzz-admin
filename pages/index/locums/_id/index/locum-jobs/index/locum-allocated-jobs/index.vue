<template>
    <div>
        <LocumAllocatedJobs :user='user'/>
    </div>
</template>
<script>
import AppLoading from '@/components/Base/AppLoading'
import LocumAllocatedJobs from '@/components/Locums/Jobs/LocumAllocatedJobs'
export default {
    components:{
        AppLoading,
        LocumAllocatedJobs
    },
    computed:{
        user(){
            return this.$store.state.locums.locumUser
        },
    },
    async asyncData({app, store, route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
            const user = response.data.data.user

            await store.commit('locums/SET_LOCUM_USER', user)
            
        }catch(err){
            store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
            console.log('get locum user error!')
        }
    }
}
</script>
<style>

</style>