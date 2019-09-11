<template>
    <div class="mt-5">
        <LocumCompliance :user="user"/>
        <nuxt-child/>
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
    async asyncData({app, store, route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
            const user = response.data.data.user
            return{
                user
            }
        }catch(err){
            store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
            console.log("get locum compliance error!",err)
        }
    }
    
}
</script>
<style>

</style>