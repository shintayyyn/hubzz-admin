<template>
  <div class="spoke-modal p-4 md:p-8 shadow-lg">
    <div @click="goBack()" class="cursor-pointer mb-4">
      <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current"/>
    </div>
    <PracticeSurgeriesTabs :practice="practice" :practiceSurgery="practiceSurgery"/>
    <nuxt-child/>
  </div>
</template>
<script>
import PracticeSurgeriesTabs from '@/components/Practices/PracticeSurgeriesTabs'
export default {
  components:{
    PracticeSurgeriesTabs
  },
  data(){
    return{
      practice: '',
      practiceSurgeries: '',
    }
  },
  async asyncData({ app, store, route }){
    try{
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice
      response = await app.$axios.$get(`/api/v1/admin/practices/${practice.id}/practice-surgeries/${route.params.practiceSurgeryId}`)
      const practiceSurgery = response.data.practice_surgery

      return{
        practice,
        practiceSurgery
      }
    }catch(err){
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log('get practice or practice surgery error', err)
    }
  },
  methods:{
    goBack(){
      const query = {
          ...this.$route.query
      }
      console.log('route', this.$route)
      this.$router.push({path:`/practices/${this.$route.params.id}/practice-surgeries`,query})
    },
  }
}
</script>
<style>
.card {
  min-width: 100px;
  height: 250px;
  box-sizing: content-box;
}
.spoke-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.spoke-modal {
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
  .spoke-modal {
    width: 70%;
  }
}
</style>