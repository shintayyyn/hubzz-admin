<template>
    <div class="practice-modal p-8 shadow-lg">
      <div @click="goBack()" class="cursor-pointer">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white fill-current"/>
      </div>
      <PracticeTabs :practice="practice"/>
      <nuxt-child/>
    </div>
</template>
<script>
import PracticeTabs from '@/components/Practices/PracticeTabs'
export default {
    components:{
        PracticeTabs
    },
    data() {
        return {
            practice: null,
        }
    },
    async asyncData({app, route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
            const practice = response.data.data.practice
            return{
                practice
            }
        }catch(err){
             console.log('get practice error!!!!',err)
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
            this.$router.push({path:'/practices',query})
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
.practice-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.practice-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px orange;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .practice-modal {
    width: 80%;
  }
}
</style>
