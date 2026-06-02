<template>
  <transition name="slide" mode="out-in">
    <div class="specific-job-part-modal">
      <div class="m-6">
        <div class="m-4">
          <nuxt-link
            class="mb-2"
            :to="{ path: `/billings/hubzz-billing/${$route.params.id}/practice-hubzz-invoices/issue-hubzz-invoice`, query: $route.query }"
          >
            <svgicon name="arrow-left-solid" height="40" width="40" class="fill-current text-white hover:text-sunglow p-1 cursor-pointer" />
          </nuxt-link>
          <AppButton
            v-if="approvedJobPart.invoiced"
            class="mr-2"
            :label="'View Invoice'"
            :icon="'cloud-download'"
            @click="showInvoice = !showInvoice"
          />
        </div>

        <JobPartModal :specificJobPart="approvedJobPart" :isNuxtChild="true" :isInvoice="true" />
        <transition name="slide" mode="out-in">
          <div v-if="showInvoice" class="invoice-modal p-2">
            <div class="text-white hover:text-sunglow p-1 ml-auto" @click="showInvoice = false">
              <svgicon name="times-solid" height="24" width="24" class="fill-current cursor-pointer" />
            </div>
            <div v-if="locumInvoice !== null">
              <PracticeBillingInvoiceForm :propInvoice="locumInvoice" :practice="practice" />
            </div>
            <div v-else>
              Job part is not yet Invoiced.
            </div>
          </div>
        </transition>
      </div>
      <div v-if="showInvoice" class="billing-shield" @click="showInvoice = false" />
    </div>
  </transition>
</template>

<script>
import JobPartModal from '@/components/Base/JobPartModal'
import AppButton from '@/components/Base/AppButton'
import PracticeBillingInvoiceForm from '@/components/Billings/PracticeBillingInvoiceForm'
export default {
  components: {
    JobPartModal,
    AppButton,
    PracticeBillingInvoiceForm
  },
  data() {
    return {
      showInvoice: false,
      approvedJobPart: null,
      locumInvoice: null,
      invoiceItems: [],
      practice: null
    }
  },
  async asyncData({ app, route, store }) {
    try {
      let response = await app.$axios.$get(`/api/v1/admin/job-parts/${route.params.approvedJobPartId}`)
      const approvedJobPart = response.data.job_part

      let locumInvoice = null
      if (approvedJobPart.locum_invoice_id) {
        response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}/locum-invoices/${approvedJobPart.locum_invoice_id}`)
        locumInvoice = response.data.locum_invoice
      }
      response = await app.$axios.$get(`/api/v1/admin/practices/${route.params.id}`)
      const practice = response.data.practice
      return {
        approvedJobPart,
        locumInvoice,
        practice
      }
    } catch (err) {
      store.commit('SET_NOTIFICATION', {
        enabled: true,
        status: 'danger',
        text: 'Something went wrong!'
      })
      console.log('Get hubzz invoices error!', err)
    }
  }
}
</script>

<style>
.specific-job-part-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px #ffc72c;
  transition: all 0.3s ease-in-out;
  background-color: white;
  z-index: 512;
}

.invoice-modal {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 25px;
  min-width: 600px;
  min-height: 450px;
  max-width: 95%;
  max-height: 90%;
  overflow: auto;
  transition: all 0.3s ease-in-out;
  background-color: #505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .specific-job-part-modal {
    width: 50%;
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
