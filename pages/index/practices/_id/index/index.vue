<template>
    <div>
        <div class="mt-5">
            <transition name="fade" mode="out-in" >
                <PracticeProfile :practice="practice"/>
            </transition>
        </div>
      <div class="practice-shield" v-if="$route.name.includes('index-practice-users-pracUserId')"></div>
      <div class="practice-shield" v-if="$route.name.includes('index-practice-documents-pracDocId')"></div>
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

</style>
