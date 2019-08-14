<template>
    <div class="mt-5">
        <LocumCompliance :user="user"/>
    </div>
</template>
<script>
import LocumCompliance from '@/components/Locums/LocumCompliance'
export default {
    components:{
        LocumCompliance
    },
    data(){
        return{
            user:null
        }
    },
    async asyncData({app,route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
            const user = response.data.data.user
            console.log(user)
            return{
                user
            }
        }catch(err){
            console.log("get locum error!",err)
        }
    }
    
}
</script>
<style>

</style>