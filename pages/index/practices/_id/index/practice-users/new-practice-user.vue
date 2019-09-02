<template>
    <div class="new-practice-user-modal shadow-lg">
        <transition name = "slide" mode = "out-in">
            <CreatePracticeUser :practice="practice" :surgery="surgery"/>
        </transition>
        <nuxt-child/>
    </div>
    
</template>
<script>
import CreatePracticeUser from '@/components/Practices/CreatePracticeUser'
export default {
    components:{
        CreatePracticeUser
    },
    data(){
        return{
            practice:null,
            surgery:null
        }
    },

    async asyncData({app,store,route}){

        try{
            const response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
            const practice = response.data.data.practice
            const surgery = response.data.data.practice.surgery
            return{
                practice,
                surgery
            }
        
        }catch(err){
            store.commit('SET_NOTIFICATION',{ enabled: true, status:'warning', text:'Something went wrong!'})
            console.log("index practices index create asyncData err", err);
        }
    },

    methods:{

    }
};
</script>
<style>
.new-practice-user-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.new-practice-user-modal {
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
  .new-practice-user-modal {
    width: 70%;
  }
}
</style>