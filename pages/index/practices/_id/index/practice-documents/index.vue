<template>
    <div class="mt-5">
        <transition name="fade" mode="out-in">    
            <PracticeDocuments :practice="practice"/>
        </transition>
        <nuxt-child/>
    </div>
</template>
<script>
import PracticeDocuments from '@/components/Practices/PracticeDocuments'
export default {
    components:{
        PracticeDocuments
    },
    transition:{
        name:'fade',
        mode:'out-in'
    },
    data(){
        return{
            practice: null
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
<style>

</style>