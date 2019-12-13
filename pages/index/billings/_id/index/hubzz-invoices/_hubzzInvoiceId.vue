<template>
  <div class="hubzz-invoice-modal">
    <div class="items-center text-sm text-white py-2 m-6">
      <div @click="goBack()" class="text-white hover:text-sunglow p-1">
        <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current"/>
      </div>
      <div>
        <HubzzInvoice 
          :forViewing="true"
          :practice="practice" 
          :practiceInvoice="practiceInvoice"/>
      </div>
    </div>
  </div>
</template>
<script>
import HubzzInvoice from '@/components/Billings/HubzzInvoice'
export default {
  components:{
    HubzzInvoice
  },
  data(){
    return{
      practiceInvoice: '',
      practice: ''
    }
  },
  async asyncData({ app, route, params }){
    try{
      let response = await app.$axios.$get(`/api/v1/admin/practice-invoices/${route.params.hubzzInvoiceId}`)
      const practiceInvoice = response.data.practice_invoice
      response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice
      return{
        practiceInvoice,
        practice
      }
    }catch(err){
      console.log('get invoice error', err)
    }
  },
  methods:{
    goBack(){
      const query = {
        ...this.$route.query
      }
      this.$router.push({path:`/billings/${this.$route.params.id}/hubzz-invoices`,query})
    },
  }
}
</script>

<style>
.hubzz-invoice-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #FFC72C;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .hubzz-invoice-modal {
    width: 70%;
  }
}
.document {
  width: 100%;
  min-height: 50vh;
}

@media screen and (min-width: 768px) {
  .document {
    min-height: 80vh;
  }
}
</style>