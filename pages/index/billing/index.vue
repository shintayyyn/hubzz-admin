<template>
  <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
    <div>
      <nuxt-link
        to="/billing/addinvoice"
        class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow"
      >Add Invoice</nuxt-link>
    </div>

    <!-- TABLE RESPONSIVE-->
    <div class="table border-separate overflow-x-auto" style="border-spacing: 0 10px;"> 
      <!-- HEADER -->
      <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
        <div class="table-cell p-2 align-middle">Invoice Number</div> 
        <div class="table-cell p-2 align-middle">Practice / Surgery</div>
        <div class="table-cell p-2 align-middle">Created</div>
        <div class="table-cell p-2 align-middle">Issued</div>
        <div class="table-cell p-2 align-middle">Job Numbers</div>
        <div class="table-cell p-2 align-middle">£ Amount</div>
        <div class="table-cell p-2 align-middle">Status</div>
      </div>
      <!-- END HEADER -->
      <!-- BODY -->
      <nuxt-link
        v-for="(billing, index) in billings"
        :key="`billing-${index}`"
        :to="`/billing/addinvoice`"
        class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
        draggable="false"
      >
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Invoice Number</strong>
          <span class="break-all">{{ billing.invnum }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Practice / Surgery</strong>
          <span class="break-word">{{ billing.practice }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Created</strong>
          <span class="break-all">{{ billing.created }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Issued</strong>
          <span class="break-all">{{ billing.issued }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Job Numbers</strong>
          <span class="break-all">{{ billing.jobnums }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">£ Amount</strong>
          <span class="break-all">{{ billing.amount }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell pl-1 pr-4 py-2 md:py-4 align-middle">
          <strong class="block md:hidden">Status</strong>
          <span>{{ billing.status }}</span>
          <div class="py-4" v-if="billing.status=='Issued'">
            <a class="px-4 py-2 whitespace-no-wrap rounded-full bg-green-dark">Mark as paid</a>
          </div>
          </div>
      </nuxt-link>
      <!-- END BODY -->
    </div>
    <!-- END TABLE -->
    
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  // async asyncData({ app }) {
  //   try {
  //     let response = await app.$axios.get(`/api/v1/qualifications`);

  //     const qualifications = response.data.data.qualifications;

  //     return {
  //       qualifications
  //     };
  //   } catch (err) {
  //     console.log("index qualifications index asyncData err", err);
  //   }
  // },

  data() {
    return {
      billings: [
        {
          invnum: "0000000001",
          practice: "OLDHAM",
          created: "10/02/2019",
          issued: "15/02/2019",
          jobnums: "H00000000101",
          amount: "£100.00",
          status: "Paid"
        },
        {
          invnum: "0000000002",
          practice: "TROUTBECK",
          created: "10/02/2019",
          issued: "14/02/2019",
          jobnums: "H00000000102",
          amount: "£200.00",
          status: "Issued"
        },
        {
          invnum: "0000000001",
          practice: "INSPIRE",
          created: "10/02/2019",
          issued: "15/02/2019",
          jobnums: "H00000000103",
          amount: "£100.00",
          status: "Paid"
        }
      ]
    };
  }
};
</script>

<style>
.md\:table-cell:first-child{
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
}
.md\:table-cell:last-child{
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
}
</style>
