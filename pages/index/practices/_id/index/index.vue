<template>
    <div>
        <div class="mt-5">
            <transition name="fade" mode="out-in" >
                <PracticeProfile :practice="practice"/>
            </transition>
        </div>
        <nuxt-child/>
    </div>
</template>
<script>
import PracticeProfile from '@/components/Practices/PracticeProfile'
export default {
    components:{
        PracticeProfile,
    },
    data() {
        return {
            // practice: null,
        }
    },
    async asyncData({app,store, route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
            const practice = response.data.data.practice
            await store.commit('practices/SET_SPECIFIC_PRACTICE',practice)
            return{
                // practice
            }
        }catch(err){
            store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
             console.log('get practice error!!!!',err)
        }
    },
    computed:{
      practice(){
        return this.$store.state.practices.practice
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
