<template>
    <div class="p-8 text-white">
        <div @click="goBack()" class="cursor-pointer">
            <svgicon name="arrow-left-solid" height="32" widht="32" class="text-white fill-current"/>
        </div>
        <div class="text-4xl text-white">Add a FAQ for Practices</div>
        <div class="m-8">
            <CreateFaq :domain="domain"/>
        </div>
            
        <div class="add-faq-shield" v-if="$route.name.includes('index-faqs-add')"></div>
        <nuxt-child/>
    </div>
</template>
<script>
import CreateFaq from '@/components/Faqs/CreateFaq'
export default {
    components:{
        CreateFaq
    },
    data(){
        return{
            domain:'Practice'
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
</style>