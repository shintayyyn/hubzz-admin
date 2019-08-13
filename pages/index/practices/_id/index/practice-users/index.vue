<template>
    <div class="practice-tab mt-5">
        <transition name="fade" mode="out-in">
            <PracticeUsers :practice="practice"/>
        </transition>
        <nuxt-child/>
    </div>
</template>
<script>
import PracticeUsers from '@/components/Practices/PracticeUsers'
import PracticeTabs from '@/components/Practices/PracticeTabs'
export default {
    transition:{
        name:'fade',
        mode:'out-in'
    },
    components:{
        PracticeUsers,
        PracticeTabs
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
