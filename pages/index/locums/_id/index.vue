<template>
    <div class="locum-modal p-8 shadow-lg">
        <div @click="goBack()" class="cursor-pointer">
            <svgicon name="arrow-left-solid" height="32" widht="32" class="text-white fill-current"/>
        </div>
        <LocumTabs :user="user"/>
        <div class="compliance-shield" v-if="$route.name.includes('index-locum-compliance-docId')"/>
        <nuxt-child/>
    </div>
</template>
<script>
import LocumTabs from '@/components/Locums/LocumTabs'
export default {
    components:{
        LocumTabs
    },
    data(){
        return{
            user: null,
        }
    },
    async asyncData({app, route}){
        try{
            
            let response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
            const user = response.data.data.user
            return{
                user
            }
        }catch(err){
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
.locum-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.locum-modal {
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
  .locum-modal {
    width: 80%;
  }
}
</style>