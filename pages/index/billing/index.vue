<template>
  <div class="flex-1 flex flex-col py-2 px-6 overflow-auto">
    <div class="flex justify-between">
      <nuxt-link
        to="/billing/add-invoice"
        class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow"
      >Add Invoice</nuxt-link>
    </div>

    <!-- TABLE -->
    <div style="width: 800px;">
      <div class="flex flex-col">
        <!-- HEADER -->
        <div class="flex my-2">
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Invoice number</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>invoice/Surgery</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Created</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Issued</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Job numbers</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>£ Amount</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Status</strong>
            </div>
          </div>
        </div>
        <!-- HEADER -->

        <!-- BODY -->
        <nuxt-link
          v-for="(invoice, index) in invoices"
          :key="`invoice-${index}`"
          :to="`/billing/${invoice._id}`"
          class="flex no-underline rounded-lg bg-waterloo hover:bg-waterloo-light my-2"
        >
          <div style="width: 30%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ invoice.number }}</span>
            </div>
          </div>
          <div style="width: 30%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ invoice.invoice }}</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ $moment(invoice.createdAt).format('MMM D, YYYY | hh:mm A') }}</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ $moment(invoice.issuedAt).format('MMM D, YYYY | hh:mm A') }}</span>
            </div>
          </div>
          <div style="width: 30%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ invoice.jobNumber }}</span>
            </div>
          </div>
          <div style="width: 30%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ invoice.amount }}</span>
            </div>
          </div>
          <div style="width: 30%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ invoice.status }}</span>
            </div>
          </div>
        </nuxt-link>
        <!-- BODY -->
      </div>
    </div>
    <!-- TABLE -->

    <nuxt-child/>
  </div>
</template>

<script>
export default {
  async asyncData({ app }) {
    try {
      let response = await app.$axios.get(`/api/v1/invoices`);

      const invoices = response.data.data.invoices;

      return {
        invoices
      };
    } catch (err) {
      console.log("index invoices index asyncData err", err);
    }
  },

  data() {
    return {
      invoices: []
    };
  }
};
</script>
