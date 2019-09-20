<template>
    <div class="practice-document-modal"> 
        <PracticeDocumentFile :practiceDoc="practiceDoc"/>   
    </div>

</template>
<script>
import PracticeDocumentFile from '@/components/Practices/PracticeDocumentFile'
export default {
    transition:{
        name:'slide',
        mode:'out-in'
    },
    components:{
        PracticeDocumentFile
    },
    data(){
        return{
            practiceDoc:null,
        }
    },
    computed:{
      practice(){
        return this.$store.state.practices.practice
      }
    },
    async asyncData({app,store,route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/practice-documents/${route.params.pracDocId}`)
            const practiceDoc = response.data.data.practice_document
            response = await app.$axios.get(`/api/v1/admin/practices/${practiceDoc.practice.id}`)
            const practice = response.data.data.practice
            await store.commit('practices/SET_SPECIFIC_PRACTICE', practice)

            return{
                practiceDoc,
            }
        }catch(err){
            store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
            console.log('get document error!',err)
        }

    },
    methods:{
        
    }
    
}
</script>
<style >

</style>