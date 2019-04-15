<template>
  <div class="flex-1 flex flex-col py-2 px-6 overflow-auto">
    <!-- <div>
      <nuxt-link
        to="/reports/create"
        class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow"
      >Create</nuxt-link>
    </div>-->

    <!-- TABLE -->
    <div>
      <div class="flex flex-col">
        <!-- BODY -->
        <nuxt-link
          v-for="(qualification, index) in qualifications"
          :key="`qualification-${index}`"
          :to="`/reports/${qualification._id}`"
          class="flex no-underline rounded-lg bg-waterloo hover:bg-waterloo-light my-2"
        >
          <div style="width: 30%;">
            <div class="flex text-white text-xs p-4">
              <span>REP-010</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <span>REP-011</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <span>REP-012</span>
            </div>
          </div>
          <div style="width: 25%; padding-left:100px">
            <div class="flex text-white text-xs p-4">
              <i class="material-icons">keyboard_arrow_right</i>
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
