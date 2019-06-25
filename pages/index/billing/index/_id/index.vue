<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100% - 70px);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/billing" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <!-- HEADER -->

      <div class="flex flex-col bg-waterloo m-4 py-2 px-4 rounded-lg" style="width: 400px;">
        <div class="flex flex-col">
          <label class="text-sm" style="color: #CDD0D8;">Name</label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  transition: "subpage",

  async asyncData({ app, route }) {
    try {
      let response = await app.$axios.get(
        `/api/v1/qualifications/${route.params.id}`
      );

      const qualification = response.data.data.qualification;

      return {
        qualification
      };
    } catch (err) {
      console.log("index qualifications index _id index asyncData err", err);
    }
  },

  data() {
    return {
      qualification: null
    };
  }
};
</script>
