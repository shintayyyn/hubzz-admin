<template>
  <div class="flex-1 flex flex-col py-2 px-4">
    <!-- <div>
      <nuxt-link
        to="/reports/create"
        class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow"
      >Create</nuxt-link>
    </div>-->

    <!-- TABLE -->
      <div class="flex flex-col">
        <!-- BODY -->
        <nuxt-link
          v-for="(qualification, index) in qualifications"
          :key="`qualification-${index}`"
          :to="`/reports/${qualification._id}`"
          class="flex items-center no-underline rounded-lg bg-waterloo hover:bg-waterloo-light my-2"
        >
          <div class="w-1/3 flex text-white text-xs px-2 py-4"><span>REP-010</span></div>
          <div class="w-1/3 flex text-white text-xs px-2 py-4"><span>REP-011</span></div>
          <div class="w-1/3 flex text-white text-xs px-2 py-4"><span>REP-012</span></div>
          <div class="flex text-white text-xs px-2 md:px-4">
            <svgicon
              name="chevron-right"
              width="21"
              height="21"
              color="white"
            ></svgicon>
          </div>
        </nuxt-link>
        <!-- BODY -->
      </div>
      <!-- TABLE -->

      <nuxt-child/>
  </div>
</template>

<script>
export default {
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

  data() {
    return {
      qualifications: []
    };
  }
};
</script>
