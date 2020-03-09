<template>
  <div class="edit-practice-user-modal shadow-lg">   
    <EditPracticeUser :user="user"/>
  </div>
</template>
<script>
import EditPracticeUser from '@/components/Practices/EditPracticeUser'
import AppButton from '@/components/Base/AppButton'
export default {
  transition:{
    name:'slide',
    mode:'out-in'
  },
  components:{
    EditPracticeUser,
    AppButton
  },
  data (){
    return{
      user:null,
      practice:null
    }
  },
  async asyncData ({ app, store, route, error }){
    try{
      let response = await app.$axios.$get(`/api/v1/admin/practice-users/${route.params.pracUserId}`)
      const user = response.data.user
      return{
        user,    
      }
    }catch(err){
      error({statusCode: 404})
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log("something went wrong!",err)
    }
  }
}
</script>
<style>

</style>