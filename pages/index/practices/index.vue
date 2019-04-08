<template>
  <div class="flex-1 flex flex-col py-2 px-6 overflow-auto">
    <div class="flex flex-wrap overflow-hidden">
      <div class="w-1/3 overflow-hidden">
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
      <div class="w-1/3 overflow-hidden pl-24">
        <nuxt-link
          to="/practices/addpractice"
          class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow"
        >Add Practice</nuxt-link>
      </div>
    </div>

    <!-- TABLE -->
    <div style="width: 800px;">
      <div class="flex flex-col">
        <!-- HEADER -->
        <div class="flex my-2">
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Practice Name</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Practice Code</strong>
            </div>
          </div>
          <div style="width: 20%">
            <div class="flex text-white text-xs p-4">
              <strong>Created</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Expires</strong>
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
          v-for="(practice, index) in practices"
          :key="`practice-${index}`"
          :to="`/practices/${practices._id}`"
          class="flex no-underline rounded-lg bg-waterloo shadow hover:bg-waterloo-light my-2"
        >
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ practice.name }}</span>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ practice.code }}</span>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ $moment(practice.created).format('MMM D, YYYY | hh:mm A') }}</span>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ practice.expires }}</span>
            </div>
          </div>
          <div style="width: 20%; padding-top:15px">
            <div
              class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-full shadow"
            >
              <span>{{ practice.status }}</span>
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
  // async asyncData({ app }) {
  //   try {
  //     let response = await app.$axios.get(`/api/v1/practices`);

  //     const practices = response.data.data.practices;

  //     return {
  //       practices
  //     };
  //   } catch (err) {
  //     console.log("index qualifications index asyncData err", err);
  //   }
  // },

  data() {
    return {
      practices: [
        {
          id: 1,
          name: "BARROW HEALTH CENTRE",
          code: "C82062",
          created: "01/04/2019 06:12:05",
          expires: "25/01/2023",
          status: "Disabled"
        },
        {
          name: "BARROW HEALTH CENTRE",
          code: "C82062",
          created: "01/04/2019 06:12:05",
          expires: "25/01/2023",
          status: "Disabled"
        },
        {
          name: "BARROW HEALTH CENTRE",
          code: "C82062",
          created: "01/04/2019 06:12:05",
          expires: "25/01/2023",
          status: "Disabled"
        },
        {
          name: "BARROW HEALTH CENTRE",
          code: "C82062",
          created: "01/04/2019 06:12:05",
          expires: "25/01/2023",
          status: "Disabled"
        }
      ]
    };
  }
};
</script>
