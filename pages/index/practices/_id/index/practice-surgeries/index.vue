<template>
   
        <div class="practice-tab mt-5">
            <transition name="fade" mode="out-in">
                <PracticeSurgeries :practice="practice"/>
            </transition>
            <nuxt-child/>
        </div>
        
   
</template>
<script>
import PracticeTabs from '@/components/Practices/PracticeTabs'
import PracticeSurgeries from '@/components/Practices/PracticeSurgeries'
export default {
    transition:{
        name:'fade',
        mode:'out-in'
    },
    components:{
        PracticeSurgeries,
        PracticeTabs
    },
    data() {
        return {
            practice:null,
        }
    },
    async asyncData({app, route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
            const practice = response.data.data.practice
            console.log("this",practice)

            return{
                practice
            }
        }catch(err){
             console.log('get practice error!!!!',err)
        }
    }
}
</script>
