<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div
      style="width: calc(100% - 70px);"
      class="flex-1 flex flex-col self-end bg-trout shadow-lg"
    >
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/practices/_id/" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <div class="text-white pl-8">
        <div class="flex flex-wrap overflow-hidden">
          <div class="w-1/8 overflow-hidden">
            <strong>qwe</strong>
          </div>

          <div class="w-1/8 overflow-hidden pl-2">
            <span
              class="inline-flex no-underline py-2 px-4 bg-sunglow text-sm text-black rounded-lg shadow"
            >unfilled</span>
          </div>
        </div>

        <p class="text-xs pt-4">Posted 18/03/2019</p>
      </div>
      <div class="flex flex-col rounded-lg p-2 text-white lg:w-3/5">
        <form class="flex flex-col bg-waterloo m-4 py-2 px-4 shadow rounded-lg">
          <div class="flex flex-wrap overflow-hidden pt-4">
            <!--LEFT-->
            <div class="w-1/2 lg:w-1/2 sm:w-full overflow-hidden text-grey-light text-xs">
              <p class="flex text-white text-xs pb-4 font-semibold">Job Number</p>
              <p class="flex pb-4">H0000000252</p>
              <p class="flex text-white text-xs pb-4 font-semibold">Rate</p>
              <p class="flex pb-4">£ 1 per hour</p>
              <p class="flex text-white text-xs pb-4 font-semibold">Total Hours</p>
              <p class="flex pb-4">1 Hour(s)</p>
              <p class="flex text-white text-xs pb-4 font-semibold">Job Description</p>
              <p class="flex pb-4">qwe</p>
              <p class="flex text-white text-xs pb-4 font-semibold">Extra Information</p>
              <p class="flex pb-4">qwe</p>
            </div>
            <!--RIGHT-->
            <div class="w-1/2 lg:w-1/2 sm:w-full overflow-hidden text-grey-light text-xs">
              <p class="flex text-white text-xs pb-4 font-semibold">Duration</p>
              <p class="flex pb-4">From 20/03/2019</p>
              <p class="flex pb-4">To 20/03/2019</p>
              <p class="flex pb-4">Shift AM</p>
              <p
                class="flex text-white text-xs pb-4 font-semibold"
              >Auto-assigns this job to the first applicant</p>
              <p class="flex pb-4">No</p>
              <p class="flex pb-4">
                This Job is
                <strong>INSIDE</strong> of scope of
                <strong>IR35</strong>
              </p>
              <p class="flex text-white text-xs pb-4 font-semibold">Role</p>
              <p class="flex pb-4">Nurse | Advanced Nurse Practitioners (ANP)</p>
              <p class="flex text-white text-xs pb-4 font-semibold">Specialty</p>
              <p class="flex pb-4">
                <span
                  class="inline-flex no-underline py-2 px-4 bg-sunglow text-xs text-black rounded-lg shadow"
                >A&E</span>
              </p>
              <p class="flex text-white text-xs pb-4 font-semibold">Clinical Systems</p>
              <p class="flex pb-4">
                <span
                  class="inline-flex no-underline py-2 px-4 bg-sunglow text-xs text-black rounded-lg shadow"
                >Adastra</span>
              </p>
              <p class="flex text-white text-xs pb-4 font-semibold">Spoken Languages</p>
              <p class="flex pb-4">
                <span
                  class="inline-flex no-underline py-2 px-4 bg-sunglow text-xs text-black rounded-lg shadow"
                >English</span>
              </p>
              <p class="flex text-white text-xs pb-4 font-semibold">Compliance Requirements</p>
              <p class="flex pb-4">Passport</p>
              <p class="flex text-white text-xs pb-4 font-semibold">Mandatory Training</p>
              <p class="flex pb-4">None</p>
            </div>
          </div>
          <div class="text-white text-xs">
            <strong>
              Practice
              <br>OLDHAM FAMILY PRACTICE
            </strong>
            <br>1ST FLOOR INTEGRATED C C NEW RADCLIFFE STREET OLDHAM OL1 1NL
          </div>
          <div class="flex flex-col h-64 bg-white shadow rounded-lg text-black">
            <GmapMap
              v-bind:center="{lat:10, lng:10}"
              v-bind:zoom="7"
              map-type-id="terrain"
              style="height: 800px"
            >
              <GmapMarker
                v-bind:key="index"
                v-for="(m, index) in markers"
                v-bind:position="m.position"
                v-bind:clickable="true"
                :draggable="true"
                @click="center=m.position"
              />
            </GmapMap>
          </div>
        </form>
      </div>
    </div>
    <nuxt-child/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      center: { lat: 10.0, lng: 10.0 },
      markers: [
        {
          position: { lat: 10.0, lng: 10.0 }
        },
        { position: { lat: 10.0, lng: 10.0 } }
      ]
    };
  }
};
</script>

<style>
.p {
  padding-bottom: 5px;
}
</style>

