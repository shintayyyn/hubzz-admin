<template>
    <div class="practice-modal p-8 shadow-lg">
      <div @click="goBack()" class="cursor-pointer mb-4">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white fill-current"/>
      </div>
      <PracticeTabs :practice="practice"/>
      <nuxt-child/>
      <div class="practice-shield" v-if="$route.name.includes('pracUserId')"></div>
      <div class="practice-shield" v-if="$route.name.includes('pracDocId')"></div>
      <div class="practice-shield" v-if="$route.name.includes('practiceSessionId')"></div>
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
        }
    },
    computed:{
      practice(){
        return this.$store.state.practices.practice
      }
    },
    async asyncData({app,store,route}){
        try{
           
            let response = await app.$axios.get(`/api/v1/admin/practices/${route.params.id}`)
            const practice = response.data.data.practice
            await store.commit('practices/SET_SPECIFIC_PRACTICE',practice)
            return{
                
            }
        }catch(err){
          store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
          console.log('get practice error!!!!',err)
        }
    },
    
    methods:{
        goBack(){
            const query = {
                ...this.$route.query
            }
            this.$router.push({path:'/practices',query})
        },
    }
}
</script>
<style>

</style>
