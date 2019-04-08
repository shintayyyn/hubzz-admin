<template>
  <div class="flex-1 flex flex-col py-2 px-6 overflow-auto">
    <div class="flex justify-between">
      <div class="flex py-2">
        <div class="relative">
          <input
            class="outline-none rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:hubzz-yellow bg-waterloo"
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
    </div>

    <!-- TABLE -->
    <div style="width: 800px;">
      <div class="flex flex-col">
        <!-- HEADER -->
        <div class="flex my-2">
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Name</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Profession</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Date signed-up</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Sign-up verified</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Status</strong>
            </div>
          </div>
        </div>
        <!-- HEADER -->

        <!-- BODY -->
        <nuxt-link
          v-for="(locum, index) in locums"
          :key="`locum-${index}`"
          :to="`/locums/view-profile`"
          class="flex no-underline rounded-lg bg-waterloo hover:bg-waterloo-light my-2"
        >
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ locum.name }}</span>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ locum.profession }}</span>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ $moment(locum.dateSigned).format('MMM D, YYYY | hh:mm A') }}</span>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ $moment(locum.signVerified).format('MMM D, YYYY | hh:mm A') }}</span>
            </div>
          </div>
          <div style="width: 20%;">
            <div
              class="inline-flex text-white text-xs mt-2 py-2 p-5 border border-white rounded-full"
            >
              <span>{{ locum.status }}</span>
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
      let response = await app.$axios.get(`/api/v1/locums`);

      const locums = response.data.data.locums;

      return {
        locums
      };
    } catch (err) {
      console.log("index locums index asyncData err", err);
    }
  },

  data() {
    return {
      locums: [
        {
          name: "Vayne Aurelius",
          profession: "Alchemist",
          dateSigned: "2019-3-01 12:33:00",
          signVerified: "2019-3-01 12:33:00",
          status: "Pending"
        },
        {
          name: "Nicole Tithel",
          profession: "Gladiator",
          dateSigned: "2019-3-12 12:33:00",
          signVerified: "2019-3-01 12:33:00",
          status: "Active"
        },
        {
          name: "Xayah",
          profession: "ADR",
          dateSigned: "2019-1-23 13:50:20",
          signVerified: "2019-1-28 15:27:10",
          status: "Active"
        },
        {
          name: "Rakan",
          profession: "Support",
          dateSigned: "2019-1-23 13:50:20",
          signVerified: "2019-1-28 15:27:10",
          status: "Disabled"
        },
        {
          name: "Blitzcrank",
          profession: "Doctor",
          dateSigned: "2019-2-12 11:52:20",
          signVerified: "2019-1-28 15:27:10",
          status: "Activated"
        },

        {
          name: "Darius",
          profession: "Executioner",
          dateSigned: "2019-4-03 1:52:20",
          signVerified: "2019-4-28 15:27:10",
          status: "Activated"
        }
      ]
    };
  }
};
</script>
