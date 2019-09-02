<template>
    <div class="edit-practice-user-modal shadow-lg">   
        <EditPracticeUser :user="user" :practice="practice"/>
    </div>
</template>
<script>
import EditPracticeUser from '@/components/Practices/EditPracticeUser'
export default {
    transition:{
        name:'slide',
        mode:'out-in'
    },
    components:{
        EditPracticeUser
    },
    data(){
        return{
            user:null,
            practice:null
        }
    },
    async asyncData({app,store,route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/practice-users/${route.params.pracUserId}`)
            const user = response.data.data.user
            const practice = response.data.data.user.practice_detail.practice
            return{
                user,
                practice,    
            }
        }catch(err){
            store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
            console.log("something went wrong!",err)
        }
    }
}
</script>
<style>

</style>