<template>
  <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
    <div>
      <nuxt-link
        to="/billing/addinvoice"
        class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow"
      >Add Invoice</nuxt-link>
    </div>
    <!-- TABLE -->
    <div>
      <div class="flex flex-col">
        <!-- HEADER -->
        <div class="flex my-2">
          <div class="width: 10%;">
            <div class="flex text-white text-sm p-4">
              <strong>Invoice Number</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-sm p-4">
              <strong>Practice /Surgery</strong>
            </div>
          </div>
          <div style="width: 10%;">
            <div class="flex text-white text-sm p-4">
              <strong>Created</strong>
            </div>
          </div>
          <div style="width: 10%;">
            <div class="flex text-white text-sm p-4">
              <strong>Issued</strong>
            </div>
          </div>
          <div style="width: 10%;">
            <div class="flex text-white text-sm p-4">
              <strong>Job Numbers</strong>
            </div>
          </div>
          <div style="width: 10%;">
            <div class="flex text-white text-sm p-4">
              <strong>£ Amount</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-sm p-4">
              <strong>Status</strong>
            </div>
          </div>
        </div>
        <!-- HEADER -->

        <!-- BODY -->
        <nuxt-link
          v-for="(billing, index) in billings"
          :key="`billing-${index}`"
          :to="`/billing/addinvoice`"
          class="flex no-underline rounded-lg bg-waterloo hover:bg-waterloo-light my-2"
        >
          <div style="width: 10%;">
            <div class="flex text-white text-sm p-4">
              <span>{{ billing.invnum }}</span>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-sm p-4">
              <span>{{ billing.practice }}</span>
            </div>
          </div>
          <div style="width: 10%;">
            <div class="flex text-white text-sm p-4">
              <span>{{ billing.created }}</span>
            </div>
          </div>
          <div style="width: 10%;">
            <div class="flex text-white text-sm p-4">
              <span>{{ billing.issued }}</span>
            </div>
          </div>
          <div style="width: 10%;">
            <div class="flex text-white text-sm p-4">
              <span>{{ billing.jobnums }}</span>
            </div>
          </div>
          <div style="width: 10%;">
            <div class="flex text-white text-sm p-4">
              <span>{{ billing.amount }}</span>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-sm p-4">
              <span>{{ billing.status }}</span>
              <div class="p-4" v-if="billing.status=='Issued'">
                <a class="p-3 bg-green-dark  ">Mark as paid</a>
                </div>
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
          practice: "Disembowelment",
          created: "10/02/2019",
          issued: "15/02/2019",
          jobnums: "H00000000101",
          amount: "£100.00",
          status: "Paid"
        },
        {
          invnum: "0000000002",
          practice: "Live Skinning",
          created: "10/02/2019",
          issued: "14/02/2019",
          jobnums: "H00000000102",
          amount: "£200.00",
          status: "Issued"
        },
        {
          invnum: "0000000001",
          practice: "Live Limb Cutting",
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
