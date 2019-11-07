<template>
    <div class="job-modal shadow-lg">
        <div class="mt-6 mx-8 my-2">
            <nuxt-link :to="{ path: `/practices/${practiceId}/practice-sessions/practice-allocated-sessions`}" class="cursor-pointer">
                <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current"/>
            </nuxt-link>
        </div>
        <PracticeSessionModal :job="job"/>
    </div>
</template>
<script>
import PracticeSessionModal from '@/components/Practices/Sessions/PracticeSessionModal'
export default {
    components:{
        PracticeSessionModal
    },  
    data(){
        return{
            job:'',
            practiceId:''
        }
    },
    async asyncData({ app, store, route, error }){
        try{
            let response = await app.$axios.$get(`/api/v1/admin/jobs/${route.params.practiceSessionId}`)
            const job = response.data.job
            console.log('job', job)
            const practiceId = route.params.id
            return{
                job,
                practiceId
            }
        }catch(err){
            error({ statusCode: 404 })
            store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
            console.log('get job error!',err)
        }
    }
}
</script>
<style>
.job-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px yellow;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .job-modal {
    width: 70%;
  }
}
</style>