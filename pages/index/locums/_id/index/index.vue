<template>
    <div>
        <div class="mt-5">
            <transition name="fade" mode="out-in">
                <LocumProfile :user="user"/>
            </transition>
        </div>
        <nuxt-child/>
        <div class="locum-shield" v-if="$route.name.includes('index-locum-compliance-docId')"></div>
        <!--PUT SHIELDS HERE FOR CHILDREN-->
    </div>
</template>
<script>
import LocumProfile from '@/components/Locums/LocumProfile'
export default {
    components:{
        LocumProfile,
    },
    data(){
        return{
            user: null,
        }
    },
    async asyncData({app, store, route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
            const user = response.data.data.user
            return{
                user
            }
        }catch(err){
            store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
            console.log("get locum error!",err)
        }
    },
    methods:{
        goBack(){
            const query = {
                ...this.$route.query
            }
            if(query.job_status){
                delete query.job_status
            }
            this.$router.push({path:'/locums',query})
        },
    }
}
</script>
<style>

</style>