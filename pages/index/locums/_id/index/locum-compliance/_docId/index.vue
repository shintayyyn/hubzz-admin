<template>
    <div class="compliance-modal shadow-lg">
        <LocumComplianceFile :user="user" :compliance_doc="compliance_doc"/> 
    </div>
</template>

<script>
import LocumComplianceFile from '@/components/Locums/LocumComplianceFile'
export default {
    transition:{
        name:'slide',
        mode:'out-in'
    },
    components:{
        LocumComplianceFile
    },
    data(){
        return{
            compliance_doc:null,
            user:null
        }
    },
    async asyncData({ app, route }) {
        try {
            let response = await app.$axios.get(`/api/v1/admin/locum-detail-compliance-documents/${route.params.docId}`)
            const compliance_doc = response.data.data.locum_detail_compliance_document

            response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
            const user = response.data.data.user
            
            console.log(compliance_doc)
            console.log(user)
            return{
                compliance_doc,
                user
            }
        }catch (err) {
        console.log("index practices index create asyncData err", err);
        }
    },
}
</script>

<style>

</style>
