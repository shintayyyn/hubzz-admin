<template>
    <div class="billing-modal p-8 shadow-lg">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/billings" class="text-white p-1">
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
</template>

<script>
export default {

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
<style>
 .billing-shield {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #333;
  opacity: 0.5;
  z-index: 511;
}
.billing-modal {
  position: fixed;
  top: 0;
  right: 0;
  margin-right: 0%;
  width: 100%;
  height: 100%;
  overflow: auto;
  border-left: solid 2px orange;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .billing-modal {
    width: 80%;
  }
}
</style>