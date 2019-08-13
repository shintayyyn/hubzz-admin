<template>
    <div class="practice-tab mt-2">
        <PracticeRates :practice="practice"/>
    </div>
</template>
<script>
import PracticeRates from '@/components/Practices/PracticeRates'
export default {
    transition:{
        name:'fade',
        mode:'out-in'
    },
    components:{
        PracticeRates
    },
    data(){
        return{
            practice:null
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