<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100% - 140px);" class="flex-1 flex flex-col self-end bg-trout">
      <!-- HEADER -->
      <div class="flex text-sm text-white py-2 px-6">
        <nuxt-link
          to="/compliances/select-locum"
          class="text-white hover:text-yellow-dark p-1 mr-4"
        >
          <svgicon
            name="arrow-left-solid"
            height="22"
            width="22"
            class="hover:text-yellow-dark fill-current"
          />
        </nuxt-link>
        <button
          class="text-white hover:text-black hover:bg-yellow-dark rounded-lg inline-flex mr-4"
        >
          <i class="material-icons -mt-1" style="font-size:20px;">save</i>Save
        </button>
        <button class="text-white hover:text-black hover:bg-yellow-dark rounded-lg inline-flex">
          <i class="material-icons -mt-1" style="font-size:20px;">remove_red_eye</i>Download
        </button>
      </div>
      <!-- HEADER -->
      <!-- BODY -->
      <div class="flex lg:w-1/2 no-underline shadow-lg rounded-lg bg-waterloo mx-6 mt-10 shadow">
        <div class="inline-flex flex-row">
          <div class="text-xs flex m-4">
            <div class="text-grey">
              <p class="m-2">Name</p>
              <p class="m-2 text-white">Ms Marie Rochelle RN</p>
              <p class="m-2 mt-5 mr-20">Email address</p>
              <p class="m-2 text-white underline">rorieee95@gmail.com</p>
              <p class="m-2 mt-5 mr-20">Mobile phone number</p>
              <p class="m-2 text-white">454284664</p>
              <div class="m-2 mt-5 mr-20">
                <label for="expiryDate">Expiry date</label>
                <input
                  type="date"
                  class="date-picker hasDatepicker valid"
                  name="expiryDate"
                  disable-min-date
                  value
                  placeholder="dd/mm/yyyy"
                  id="dp1554355291222"
                  aria-invalid="false"
                >
              </div>
            </div>
            <div class="text-grey">
              <p class="m-2 mr-20">Headline</p>
              <p class="m-2 text-white">s</p>
            </div>
          </div>
        </div>
      </div>
      <!-- BODY -->
    </div>

    <div>
      <!-- <nuxt-child/> -->
    </div>
  </div>
</template>

<script>
export default {
  transition: "subpage",

  async asyncData({ app, route }) {
    try {
    } catch (err) {
      console.log("index practices index create asyncData err", err);
    }
  },

  data() {
    return {};
  }
};
</script>
