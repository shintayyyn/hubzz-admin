<template>
    <div class="locum-modal shadow-lg">
        <LocumDetailModal :user="user"/>
        <nuxt-child/>
    </div>
</template>
<script>
import LocumDetailModal from '@/components/Locums/LocumDetailModal'
export default {
    // transition:{
    //     name:'slide',
    //     mode:'out-in'
    // },
    components:{
        LocumDetailModal
    },
    data() {
        return {
            user: null,
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
             console.log('get locum error!!!!',err)
        }
    }
}
</script>
