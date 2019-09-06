<template>
  <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
    <div class="px-2">
      <div class="flex flex-no-wrap justify-start">
        <div class="text-4xl mb-4 text-white">Support</div>
      </div>
    </div>
    <!-- TABLE RESPONSIVE-->
    <div v-if="emails.length>0" class="px-2 table border-separate overflow-x-auto" style="border-spacing: 0 10px;"> 
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
        v-for="(email, index) in emails"
          :key="`support-${index}`"
          :to="`/supports/${email.id}`"
        class="flex flex-col sm:flex-row sm:flex-wrap justify-between px-2 py-2 border-l-8 border-yellow-dark md:border-l-0 md:table-row my-2 text-white no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light" 
      >
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 md:pl-2 pr-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Sender E-Mail</strong>
          <span class="break-word">{{ email.sender.email }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Account Type</strong>
          <span class="break-all">{{ email.sender.domain }}</span>
        </div>
        <div class="flex flex-col sm:w-1/2 md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Account Role</strong>
          <span class="break-all">{{ email.sender.domain }}</span>
        </div>
        <div class="flex flex-col sm:w-full md:w-auto md:table-cell px-1 py-2 md:py-4 align-middle">
          <strong class="block md:hidden text-sm uppercase">Date Sent</strong>
          <span class="break-all">{{$moment(email.sender.created_at).format('MMM DD,YYYY | HH:MM:ss') }}</span>
        </div>
      </nuxt-link>
      <!-- END BODY -->
    </div>
    <div v-else class="flex justify-center text-white ">
      <div>There are currently no messages of concern.</div>
    </div>
    <!-- END TABLE -->
    <div class="support-shield" v-if="$route.name.includes('index-supports-id')"></div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      emails: []
    };
  },
  async asyncData({ app,store,route }) {
    try {
      let response = await app.$axios.get(`/api/v1/admin/supports`);

      const emails = response.data.data.emails;

      return {
        emails
      };
    } catch (err) {
      store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
      console.log("index emails index asyncData err", err);
    }
  },

  
};
</script>
