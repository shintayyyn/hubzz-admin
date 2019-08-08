<template>
    <div class="locum-modal shadow-lg">
        <PracticeDetailModal :practice="practice"/>
        <nuxt-child/>
    </div>
</template>
<script>
import PracticeDetailModal from '@/components/Practices/PracticeDetailModal'
export default {
    // transition:{
    //     name:'slide',
    //     mode:'out-in'
    // },
    components:{
        PracticeDetailModal
    },
    data() {
        return {
            practice: null,
        }
    },
    async asyncData({app, route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
            const practice = response.data.data.practice
            return{
                practice
            }
        }catch(err){
             console.log('get practice error!!!!',err)
        }
    }
}
</script>
