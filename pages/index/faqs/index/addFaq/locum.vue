<template>
    <div class="p-4 md:p-8 text-white">
        <div @click="goBack()" class="cursor-pointer">
            <svgicon name="arrow-left-solid" height="32" widht="32" class="text-white fill-current"/>
        </div>
        <div class="mt-4 text-2xl md:text-4xl text-white">Add a FAQ for Locums</div>
        <div class="md:mx-8">
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
            domain:'Locum'
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