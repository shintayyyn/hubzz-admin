<template>
    <div class="billing-modal p-4 md:p-8 shadow-lg">
      <!-- HEADER -->
      <div class="flex items-center text-sm text-white py-2">
        <nuxt-link to="/billings" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current"/>
        </nuxt-link>
      </div>
      <!-- HEADER -->
      <div class="max-w-2xl">
        <div class="flex items-center text-white py-2">
          <p>Invoice Number: <span class="font-bold">0000000001</span></p>
          <p class="px-3 py-1 mx-2 rounded text-black bg-green-300 uppercase font-bold">Paid</p>
        </div>
        <embed class="object-contain object-top w-full h-full document" src="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"/>
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
      qualification: null,
    };
  },
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
  border-left: solid 2px yellow;
  transition: all 0.3s ease-in-out;
  background-color:#505561;
  z-index: 512;
}
@media screen and (min-width: 1200px) {
  .billing-modal {
    width: 80%;
  }
}
.document {
  width: 100%;
  min-height: 50vh;
}

@media screen and (min-width: 768px) {
  .document {
    min-height: 80vh;
  }
}
</style>