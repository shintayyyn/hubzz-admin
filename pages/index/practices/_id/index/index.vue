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
    async asyncData({app, store, route}){
      try{
        let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
        const practice = response.data.practice
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
