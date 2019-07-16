<template>
  <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
    <div>
      <nuxt-link
        to="/support/addinvoice"
        class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow"
      >Add Invoice</nuxt-link>
    </div>
    <!-- TABLE -->
    <div>
      <div class="flex flex-col">
        <!-- HEADER -->
        <div class="flex my-2">
           <div style="width: 25%;">
            <div class="flex text-white text-sm p-4">
              <strong>Sender Name </strong>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-sm p-4">
              <strong>Account Type</strong>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-sm p-4">
              <strong>Account Role</strong>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-sm p-4">
              <strong>Date Sent</strong>
            </div>
          </div>
        </div>
        <!-- HEADER -->

        <!-- BODY -->
        <nuxt-link
          v-for="(support, index) in supports"
          :key="`support-${index}`"
          :to="`/support/${support.id}`"
          class="flex no-underline rounded-lg bg-waterloo hover:bg-waterloo-light my-2"
        >
          <div style="width: 25%;">
            <div class="flex text-white text-sm p-4">
              <span>{{ support.senderName }}</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-sm p-4">
              <span>{{ support.accountType }}</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-sm p-4">
              <span>{{ support.accountRole }}</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-sm p-4">
              <span>{{ support.dateSent }}</span>
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
