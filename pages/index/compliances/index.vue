<template>
  <div class="flex-1 flex flex-col py-2 px-6">
    <div class="flex justify-between">
      <div class="flex py-2">
        <div class="relative">
          <input
            class="outline-none rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 bg-waterloo"
            placeholder="Search for..."
          >
          <button class="p-2 absolute pin-t pin-r pin-b">
            <svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
          </button>
        </div>
        <button
          class="rounded-lg text-xs text-white p-2 mx-1 hover:text-black hover:bg-yellow-dark"
        >Go</button>
      </div>
      <div class="relative">
        <label class="text-xs text-white">Filter by Status</label>
        <select
          class="outline-none rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:hubzz-yellow bg-waterloo"
          id="grid-state"
        >
          <option>All</option>
          <option>Empty</option>
          <option>Incomplete</option>
          <option selected>Pending</option>
          <option>Expiring</option>
          <option>Expired</option>
          <option>Rejected</option>
          <option>Compliant</option>
        </select>
      </div>
      <div>
        <!-- BLANK -->
      </div>
      <div>
        <!-- BLANK -->
      </div>
    </div>

    <!-- TABLE -->
    <div class>
      <!-- HEADER -->
      <div class="flex my-2">
        <div style="width: 30%;">
          <div class="flex text-white text-xs p-4">
            <strong>Locum</strong>
          </div>
        </div>
        <div style="width: 30%;">
          <div class="flex text-white text-xs p-4">
            <strong>Profession</strong>
          </div>
        </div>
        <div style="width: 25%;">
          <div class="flex text-white text-xs p-4">
            <strong>Last file uploaded</strong>
          </div>
        </div>
        <div style="width: %;">
          <div class="flex text-white text-xs p-4">
            <strong>Status</strong>
          </div>
        </div>
      </div>
      <!-- HEADER -->

      <!-- BODY -->
      <nuxt-link
        v-for="(compliance, index) in compliances"
        :key="`compliance-${index}`"
        :to="`/compliances/select-locum`"
        class="flex no-underline shadow-lg rounded-lg bg-waterloo hover:bg-waterloo-light mt-2"
      >
        <div style="width: 30%;">
          <div class="flex text-white text-xs p-4">
            <span>{{ compliance.name }}</span>
          </div>
        </div>
        <div style="width: 30%;">
          <div class="flex text-white text-xs p-4">
            <span>{{ compliance.profession }}</span>
          </div>
        </div>
        <div style="width: 25%;">
          <div class="flex text-white text-xs p-4">
            <span>{{ compliance.lastFileUpload }}</span>
          </div>
        </div>
        <div style="width: 7%;">
          <div
            class="inline-flex text-white text-xs mt-2 py-2 p-5 border border-white rounded-full"
          >
            <span>{{ compliance.status }}</span>
          </div>
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
      let response = await app.$axios.get(`/api/v1/compliances`);

      const compliances = response.data.data.compliances;

      return {
        compliances
      };
    } catch (err) {
      console.log("index compliances index asyncData err", err);
    }
  },

  data() {
    return {
      compliances: [
        {
          name: "Vayne Aurelius",
          profession: "Alchemist",
          lastFileUpload: "2019-3-01 12:33:00",
          status: "Pending"
        },
        {
          name: "Nicole Tithel",
          profession: "Gladiator",
          lastFileUpload: "2019-3-12 12:33:00",
          status: "Active"
        },
        {
          name: "Xayah",
          profession: "ADR",
          lastFileUpload: "2019-1-23 13:50:20",
          status: "Active"
        },
        {
          name: "Rakan",
          profession: "Support",
          lastFileUpload: "2019-1-23 13:50:20",
          status: "Disabled"
        },
        {
          name: "Blitzcrank",
          profession: "Doctor",
          lastFileUpload: "2019-2-12 11:52:20",
          status: "Activated"
        },

        {
          name: "Darius",
          profession: "Executioner",
          lastFileUpload: "2019-4-03 1:52:20",
          status: "Activated"
        }
      ]
    };
  }
};
</script>
