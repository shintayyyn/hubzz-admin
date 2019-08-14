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
            practice:null,

        }
    },
    async asyncData({app,route}){
        try{
            let response = await app.$axios.get(`/api/v1/admin/practice-documents/${route.params.pracDocId}`)
            const practiceDoc = response.data.data.practice_document
            const practice = practiceDoc.practice

            return{
                practiceDoc,
                practice
            }
        }catch(err){
            console.log('get document error!',err)
        }

    },
    methods:{
        
    }
    
}
</script>
<style >

</style>