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
            user:null
        }
    },
    async asyncData({app, route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
            const user = response.data.data.user
            return{
                user
            }
        }catch(err){
            console.log('get locumUser error!!!')
        }
    }
    
}
</script>
<style>

</style>