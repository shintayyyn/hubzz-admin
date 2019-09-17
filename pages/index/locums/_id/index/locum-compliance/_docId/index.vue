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
            // user:null
        }
    },
    computed:{
        user(){
            return this.$store.state.locums.locumUser
        }
    },
    async asyncData({ app, store, route }) {
        try {
            let response = await app.$axios.get(`/api/v1/admin/locum-detail-compliance-documents/${route.params.docId}`)
            const compliance_doc = response.data.data.locum_detail_compliance_document

            response = await app.$axios.get(`/api/v1/admin/locum-users/${route.params.id}`)
            const user = response.data.data.user
            await store.commit('locums/SET_LOCUM_USER', user)

            return{
                compliance_doc,
                // user
            }
        }catch (err) {
            store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
            console.log("index practices index create asyncData err", err);
        }
    },
}
</script>

<style>
.compliance-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.compliance-modal {
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
  .compliance-modal {
    width: 70%;
  }
}
</style>
