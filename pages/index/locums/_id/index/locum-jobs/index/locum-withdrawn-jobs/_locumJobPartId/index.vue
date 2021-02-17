<template>
  <div>
    <JobPartModal :specificJobPart="specificJobPart" :isNuxtChild="true"/>
  </div>
</template>
<script>
import JobPartModal from '@/components/Base/JobPartModal'
export default {
  components:{
    JobPartModal
  },
  data (){
    return{
      specificJobPart: '',
      locumUserId:''
    }
  },
  async asyncData ({ app, store, route, error }){
    try{  
      let response = await app.$axios.$get(`/api/v1/admin/job-parts/${route.params.locumJobPartId}`)
      const specificJobPart = response.data.job_part
      const locumUserId = route.params.id
      return{
        specificJobPart,
        locumUserId
      }
    }catch(err){
      error({statusCode: 404})
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
  border-left: solid 2px #FFC72C;
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