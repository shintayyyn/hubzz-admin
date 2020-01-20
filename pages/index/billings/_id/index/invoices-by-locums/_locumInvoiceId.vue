<template>
  <div class="locum-invoice-modal p-4 md:p-8 shadow-lg">
    <div class="flex items-center text-sm text-white py-2">
      <div @click="goBack()" class="text-white hover:text-sunglow p-1">
        <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current"/>
      </div>
    </div>
    <div>
      <HubzzInvoice 
        :forViewing="true"
        :practice="practice" 
        :invoiceItems="invoiceItems"
        :dateStart="locumInvoice.date_start"
        :dateEnd="locumInvoice.date_end"
        :locumInvoice="locumInvoice"
      />
    </div>
  </div>
</template>
<script>
import HubzzInvoice from '@/components/Billings/HubzzInvoice'
export default {
  components:{
    HubzzInvoice
  },
  data () {
    return{
      practice: '',
      locumInvoice: '',
      invoiceItems:[],
    }
  },
  created(){
    console.log('invoice id', this.$route.name)
  },
  async asyncData({ app, route, store }){
    try{
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/locum-invoices/${route.params.locumInvoiceId}`)
      const locumInvoice = response.data.locum_invoice
      console.log('locumInvoice', locumInvoice)
      response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`) 
      const practice = response.data.practice
      let invoiceItems = []
      const locumInvoiceItems = locumInvoice.items;
      console.log('items', locumInvoiceItems)
			for (let i = 0; i < locumInvoiceItems.length; i++) {
				const newItem = {
					job_part_id: locumInvoiceItems[i].id,
					description: locumInvoiceItems[i].description,
					total: locumInvoiceItems[i].total
				};
				newItem.id = invoiceItems.length + 1;
				invoiceItems.push(newItem);
      }
      return{
        locumInvoice,
        practice,
        invoiceItems
      }
    }catch(err){
      console.log('Get locum invoice error!', err)
    }
  },
  methods:{
    goBack(){
      const query = {
        ...this.$route.query
      }
      this.$router.push({path:`/billings/${this.$route.params.id}/invoices-by-locums`,query})
    },
  }

}
</script>
<style>
.locum-invoice-modal {
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
  .locum-invoice-modal {
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