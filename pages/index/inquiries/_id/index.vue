<template>
  <div class="support-modal p-4 md:p-8 shadow-lg">
    <transition name="fade" mode="out-in">
      <SupportInfo :email="email"/>
    </transition>
  </div>
</template>

<script>
import SupportInfo from '@/components/Supports/SupportInfo'
export default {
  components:{
    SupportInfo
  },
  
  data(){
    return{
      email: null,
    }
  },
  async asyncData({app,route}){
    try{
      let response =  await app.$axios.$get(`/api/v1/admin/supports/${route.params.id}`)
      const email = response.data.email
      return{
        email
      }
    }catch(err){
      console.log('getSupportinfo error!',err)
    }
  },
  methods:{
    goBack(){
      const query = {
        ...this.$route.query
      }
      if(query.session_tab){
        delete query.session_tab
      }
      this.$router.push({path:'/supports',query})
    },
  }
}
</script>
<style>
  .invoice{
    width: 100%;
  }
  .card {
    min-width: 100px;
    height: 250px;
    box-sizing: content-box;
  }
  .support-shield {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #333;
    opacity: 0.5;
    z-index: 511;
  }
  .support-modal {
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
    .support-modal {
      width: 80%;
    }
  }
</style>