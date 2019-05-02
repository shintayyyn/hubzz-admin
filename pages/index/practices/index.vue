<template>
  <div class="flex-1 flex flex-col px-4 py-2  overflow-auto">
    <div class="flex flex-wrap overflow-hidden sm:-mx-3">
      <div class="w-1/2  sm:my-3 sm:px-3 overflow-hidden">
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

      <div class="w-1/2 sm:my-3 sm:px-3 overflow-hidden">
        <nuxt-link
          to="/practices/addpractice"
          class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow float-right"
        >Add Practice</nuxt-link>
      </div>
    </div>

    <!-- TABLE -->
    <div>
      <div class="flex flex-col">
        <!-- HEADER -->
        <div class="flex my-2">
          <div style="width: 20%;">
            <div class="flex text-white text-xs px-2 py-4">
              <strong>Practice Name</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs px-2 py-4">
              <strong>Practice Code</strong>
            </div>
          </div>
          <div style="width: 20%">
            <div class="flex text-white text-xs px-2 py-4">
              <strong>Created</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs px-2 py-4">
              <strong>Expires</strong>
            </div>
          </div>
        
            <div class="flex text-white text-xs px-2 py-4">
              <strong>Status</strong>
            </div>

        </div>
        <!-- HEADER -->

        <!-- BODY -->
        <nuxt-link
          v-for="(practice, index) in practices"
          :key="`practice-${index}`"
          :to="`/practices/${practices._id}`"
          class="flex no-underline rounded-lg bg-waterloo  shadow hover:bg-waterloo-light my-2"
        >
          <div class="flex" style="width: 20%;">
            <div class="flex text-white text-xs py-4 p-2">
              <span>{{ practice.name }}</span>
            </div>
          </div>
          <div class="flex" style="width: 20%;">
            <div class="flex text-white text-xs py-4 p-2">
              <span>{{ practice.code }}</span>
            </div>
          </div>
          <div class="flex" style="width: 20%;">
            <div class="flex text-white text-xs py-4 p-2">
              <span>{{ $moment(practice.created).format('MMM D, YYYY | hh:mm A') }}</span>
            </div>
          </div>
          <div class="flex" style="width: 20%;">
            <div class="flex text-white text-xs py-4 p-2 ">
              <span>{{ practice.expires }}</span>
            </div>
          </div>
          <div class="flex">
            	<div class=" flex py-2 px-4 items-center">
                <span
								class=" inline-flex no-underline py-2 my-2 text-xs text-black rounded-full shadow "
								:class="`${practice.status === 'Active' ? 'bg-green text-white px-4 ' : 'bg-yellow text-black px-2'}`"
								v-if="practice.status"
							>{{ practice.status }}</span>
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
          status: "Active"
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
          status: "Active"
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
  },
  methods: {}
};
</script>
