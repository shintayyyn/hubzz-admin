<template>
    <div class="faq-modal p-8 shadow-lg">
        <div @click="goBack()" class="cursor-pointer">
            <svgicon name="arrow-left-solid" height="32" widht="32" class="text-white hover:text-sunglow fill-current"/>
        </div>
        <EditFaq :faqs="faqs"/>
    </div>
</template>

<script>
import EditFaq from '@/components/Faqs/EditFaq'
export default {
    components:{
        EditFaq
    },
    data(){
        return{
            faqs: null
        }
    },
    async asyncData({app, route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/faqs/${route.params.id}`)
            const faqs = response.data.data.faqs
            console.log(faqs)
            return{
                faqs
            }
        }catch(err){
            console.log("get faq error!",err)
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
            this.$router.push({path:'/faqs',query})
        },
    }
    
}
</script>
<style>
.faq-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px yellow;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .faq-modal {
    width: 80%;
  }
}
</style>