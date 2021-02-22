<template>
  <div>   
    <EditPracticeUser
      :practiceUser="practiceUser"
      @setPracticeUser="setPracticeUser"
    />
  </div>
</template>

<script>
  import EditPracticeUser from '@/components/Practices/EditPracticeUser'

  export default {
    transition:{
      name:'slide',
      mode:'out-in'
    },

    components:{
      EditPracticeUser,
    },

    data (){
      return{
        practiceUser: null,
        practice: null,
      }
    },

    async asyncData ({ app, store, route, error }){
      try {
        let response = await app.$axios.get(`/api/v1/admin/practice-users/${route.params.pracUserId}`)

        const practiceUser = response.data.data.user

        return{
          practiceUser,    
        }
      } catch(err){
        error({statusCode: 404})
        store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
        console.log("something went wrong!",err)
      }
    },

    methods: {

      setPracticeUser (practiceUser) {
        this.practiceUser = practiceUser
        this.$emit('practiceUpdated')
      },

    },

  }
</script>
