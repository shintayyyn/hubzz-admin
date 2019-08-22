<template>
  <div class="flex-1 flex flex-col py-2 px-6">
    <div class="flex flex-no-wrap justify-start">
      <div class="text-4xl mb-4 text-white">Reports</div>
    </div>
    <!-- TABLE -->
      <div class="flex flex-col">
        <!-- BODY -->
        <nuxt-link
          v-for="(report, index) in reports"
          :key="`report-${index}`"
          :to="`/reports/${report.id}`"
          class="inline-flex no-underline w-full p-3 rounded-lg bg-waterloo hover:bg-waterloo-light my-2"
        >
          <div class="flex-1 ml-2 text-sm text-white ">
            <span class="font-semibold mr-4">{{report.code}} </span>
            <span>{{report.description}}</span>
            <div class="flex-1 float-right text-xs px-2 md:px-4">
              <svgicon
                name="arrow-right"
                width="21"
                height="21"
                color="white"
              ></svgicon>
            </div>
          </div>
        </nuxt-link>
        <!-- BODY -->
      </div>
      <!-- TABLE -->
      <div class="report-shield" v-if="$route.name.includes('index-reports-id')"></div>
      <nuxt-child/>
  </div>
</template>
<script>
export default {
  data() {
    return {
      qualifications: [],
      reports:[
        {
          id:'1',
          code:'REP-001',
          description:'Invoices paid / unpaid',
        },
        {
          id:'2',
          code:'REP-002',
          description:'Tax report information - Money earnt and Tax and NI paid'
        },
        {
          id:'3',
          code:'REP-002',
          description:'Practices worked for'
        },
        {
          id:'4',
          code:'REP-002',
          description:'Practices that cancel jobs'
        },
        {
          id:'5',
          code:'REP-002',
          description:'How many Locums are signed-up in the area'
        }]
    };
  },
  async asyncData({ app }) {
    try {
      let response = await app.$axios.get(`/api/v1/qualifications`);

      const qualifications = response.data.data.qualifications;

      return {
        qualifications
      };
    } catch (err) {
      console.log("index qualifications index asyncData err", err);
    }
  },

};
</script>
