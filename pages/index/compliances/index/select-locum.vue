<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100% - 70px);" class="flex-1 flex flex-col self-end bg-trout">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/compliances" class="text-white p-1">
          <svgicon
            name="arrow-left-solid"
            height="22"
            width="22"
            class="text-white hover:text-yellow-dark fill-current"
          />
        </nuxt-link>
      </div>
      <!-- HEADER -->
      <!-- BODY -->
      <nuxt-link
        :to="`/compliances/select-locum/view-profile`"
        class="flex lg:w-1/2 no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light mx-6 mt-10 shadow"
        style="position:relative; cursor: pointer;"
      >
        <div class="flex-row">
          <div class="inline-flex text-xs m-4">
            <div class="text-grey">
              <p class="m-2">Full name</p>
              <p class="m-2">Email address</p>
              <p class="m-2">Mobile phone number</p>
              <p class="m-2">Home phone number</p>
            </div>
            <div class="text-white">
              <p class="m-2">Vayne Aurelius</p>
              <p class="m-2 underline">vayne123@gmail.com</p>
              <p class="m-2">8323524</p>
              <p class="m-2">25625659457</p>
            </div>
          </div>
          <div>
            <i
              class="material-icons inline-flex right p-2 absolute -mt-20"
              style="color:white; font-size:30px; right: 0"
            >chevron_right</i>
          </div>
        </div>
      </nuxt-link>

      <div
        class="flex flex-row sm:w-1/2 text-xs text-white shadow-lg rounded-lg bg-waterloo mx-6 mt-3"
      >
        <p class="m-4 text-grey">GMC / NMC Number</p>
        <p class="m-4">7283917</p>
        <button
          class="flex bg-blue:true text-white text-xs m-2 p-2 border border-white focus:bg-green rounded-full"
        >Verified</button>
        <button
          class="flex bg-blue:true text-white text-xs m-2 p-2 border border-white focus:bg-orange rounded-full"
        >Rejected</button>
      </div>
      <div
        class="flex flex-row sm:w-1/2 text-xs text-white shadow-lg rounded-lg bg-waterloo mx-6 mt-3"
      >
        <p class="m-4 text-grey">MPL / NPL Number</p>
        <p class="m-4">6301928</p>
        <button
          class="inline-flex text-white text-xs m-2 p-2 border border-white focus:bg-green rounded-full"
        >Verified</button>
        <button
          class="inline-flex text-white text-xs m-2 p-2 border border-white focus:bg-orange rounded-full"
        >Rejected</button>
      </div>
      <!-- BODY -->
      <!-- TABLE -->
      <div style="sm:w-1/2 ">
        <div class="flex sm:w-1/2 flex-col mx-6">
          <!-- HEADER -->
          <div class="flex my-2">
            <div style="width: 25%;">
              <div class="flex text-white text-xs p-4">
                <strong>Title</strong>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-xs p-4">
                <strong>File size</strong>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-xs p-4">
                <strong>File uploaded</strong>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-xs p-4">
                <strong>Expiry date</strong>
              </div>
            </div>
            <div style="width:15%;">
              <div class="flex text-white text-xs p-4">
                <strong>Days to expire</strong>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-xs p-4">
                <strong>Status</strong>
              </div>
            </div>
          </div>
          <!-- HEADER -->

          <!-- BODY -->
          <nuxt-link
            :to="`/compliances/select-locum/view-file`"
            class="flex no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light my-2"
          >
            <div style="width: 25%;">
              <div class="flex text-white text-xs p-4">
                <span>Artifact sample</span>
              </div>
            </div>
            <div style="width: 10%;">
              <div class="flex text-white text-xs p-4">
                <span>36.7 mb</span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-xs p-4">
                <span>Horus.png</span>
              </div>
            </div>
            <div style="width: 15%;">
              <div class="flex text-white text-xs p-4">
                <span>2019-3-01 12:33:00</span>
              </div>
            </div>
            <div style="width: 20%;">
              <div class="flex text-white text-xs p-4">
                <span>10 day/s</span>
              </div>
            </div>
            <div style="width: 10%;">
              <div
                class="inline-flex text-white text-xs mt-2 py-2 p-3 border border-white rounded-full"
              >
                <span>Pending</span>
              </div>
            </div>
          </nuxt-link>
          <!-- BODY -->
        </div>
      </div>
      <!-- TABLE -->

      <nuxt-child/>
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
