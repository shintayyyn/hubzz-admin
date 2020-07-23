<template>
  <div>
    <div class="add-practice-modal shadow-lg">
      <AddPracticeSurgery :practice="practice" />
    </div>
  </div>
</template>

<script>
import AddPracticeSurgery from '@/components/Practices/AddPracticeSurgery'

export default {
  components:{
    AddPracticeSurgery,
  },

  data (){
    return {
      practice: ''
    }
  },
  
  async asyncData ({ app, route, store }) {
    try{
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice
      console.log('practice', practice)
      console.log('route', route.name)
      return {
        practice
      }
    }catch(err){
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log('get practice error!!!!',err)
    }
  }
}
</script>

<style>
  .add-spoke-modal {
    position: fixed;
    top: 0;
    right: 0;
    margin-right: 0%;
    width: 100%;
    height: 100%;
    overflow: auto;
    border-left: solid 2px #ffc72c;
    transition: all 0.3s ease-in-out;
    background-color: #505561;
    z-index: 512;
  }

  @media screen and (min-width: 1200px) {
    .add-spoke-modal {
      width: 70%;
    }
  }
</style>