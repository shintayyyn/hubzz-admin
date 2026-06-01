<template>
  <div>
    <PracticeBillingInvoiceForm :propInvoice="locumInvoice" :practice="practice" />
  </div>
</template>
<script>
import PracticeBillingInvoiceForm from '@/components/Billings/PracticeBillingInvoiceForm'
export default {
  components: {
    PracticeBillingInvoiceForm
  },
  data() {
    return {
      practice: '',
      locumInvoice: ''
    }
  },
  async asyncData({ app, route }) {
    try {
      let response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/locum-invoices/${route.params.locumInvoiceId}`)
      const locumInvoice = response.data.locum_invoice
      response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice
      return {
        locumInvoice,
        practice
      }
    } catch (err) {
      return
    }
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
  border-left: solid 2px #ffc72c;
  transition: all 0.3s ease-in-out;
  background-color: #505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .locum-invoice-modal {
    width: 80%;
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
