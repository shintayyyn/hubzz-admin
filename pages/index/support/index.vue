<template>
  <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
    <div>
      <nuxt-link
        to="/support/addinvoice"
        class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow"
      >Add Invoice</nuxt-link>
    </div>

    <!-- TABLE RESPONSIVE-->
    <div class="table border-separate overflow-x-auto" style="border-spacing: 0 10px;"> 
      <!-- HEADER -->
      <div class="hidden md:table-row font-bold text-white text-sm py-4"> 
        <div class="table-cell p-2 align-middle">Sender Name</div> 
        <div class="table-cell p-2 align-middle">Account Type</div>
        <div class="table-cell p-2 align-middle">Account Role</div>
        <div class="table-cell p-2 align-middle">Date Sent</div>
      </div>
      <!-- END HEADER -->
      <!-- BODY -->
      <nuxt-link
        v-for="(support, index) in supports"
          :key="`support-${index}`"
          :to="`/support/${support.id}`"
        class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
      >
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Sender Name</strong>
          <span class="break-word">{{ support.senderName }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Account Type</strong>
          <span class="break-all">{{ support.accountType }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Account Role</strong>
          <span class="break-all">{{ support.accountRole }}</span>
        </div>
        <div class="flex flex-col sm:w-full md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Date Sent</strong>
          <span class="break-all">{{ support.dateSent }}</span>
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
      supports: [
        {
          id:1,
          senderName: "Mr. Practice User",
          accountType: "Practice",
          accountRole: "Practice Manager",
          dateSent: "Nov 20, 2019 | 12:00 AM",
        },
        {
          id:2,
          senderName: "Mr. Locum User",
          accountType: "Locum",
          accountRole: "Nurse",
          dateSent: "Nov 20, 2019 | 12:00 AM",
        },
        {
          id:3,  
          senderName: "Ms. Locum User II",
          accountType: "Locum",
          accountRole: "GP",
          dateSent: "Nov 20, 2019 | 12:00 AM",
        }
      ]
    };
  }
};
</script>
