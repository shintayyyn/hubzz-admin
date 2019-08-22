<template>
    <div>
        <div class="mt-5">
            <transition name="fade" mode="out-in">
                <PracticeHub :practice="practice" :practiceHub="practiceHub" :practiceParent="practiceParent"/>
            </transition>
        </div>
        <nuxt-child/>
    </div>
</template>
<script>
import PracticeHub from '@/components/Practices/PracticeHub'
export default {
    components:{
        PracticeHub
    },
    data(){
        return{
            practice:'',
            practiceHub:'',
            practiceParent:''
        }
    },
    async asyncData({app,route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
            const practice = response.data.data.practice
            console.log('one',practice)

            response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}/parent-surgery`)
            const practiceHub = response.data.data.practice
            console.log('two',practiceHub)
            
            let practiceParent = ''
            if (practiceHub.parent_surgery) {
                response = await app.$axios.get(`/api/v1/admin/practices/${practiceHub.parent_surgery.practice.id}`)
                practiceParent = response.data.data.practice
            }
            console.log('three',practiceParent)
            
            return{
                practice,
                practiceHub,
                practiceParent,
            }
        }catch(err){
            console.log('get parent practice error!!',err)
        }
    }
    
}
</script>
<style>
</style>