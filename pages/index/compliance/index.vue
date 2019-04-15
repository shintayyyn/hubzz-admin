<template>
  <div class="flex-1 flex flex-col py-2 px-6 overflow-auto">
    <div class="flex py-2">
      <div class="flex sm-6">
        <div class="w-3/5">
          <div class="relative">
            <input
              class="outline-none rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:hubzz-yellow bg-waterloo"
              placeholder="Search for..."
            >
            <button class="-ml-5 pd-2 pin-t pin-r pin-b">
              <svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
            </button>
            <button
              class="rounded-lg text-xs text-white p-2 mx-1 hover:text-black hover:bg-yellow-dark"
            >Go</button>
          </div>
        </div>
        <div class="w-1/5">
          <div class="text-xs text-white p-2 mx-1">Filter by Status</div>
        </div>
        <div class="w-1/5">
          <select
            class="outline-none rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:hubzz-yellow bg-waterloo"
          >
            <option>All</option>
            <option>Empty</option>
            <option>Incomplete</option>
            <option>Pending</option>
            <option>Expiring</option>
            <option>Expired</option>
            <option>Rejected</option>
            <option>Complaint</option>
          </select>
        </div>
      </div>
    </div>

    <!-- TABLE -->
    <div style="width: 800px;">
      <div class="flex flex-col">
        <!-- HEADER -->
        <div class="flex my-2">
          <div style="width: 30%;">
            <div class="flex text-white text-xs p-4">
              <strong>Locum</strong>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <strong>Profession</strong>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <strong>Last File Uploaded</strong>
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
          v-for="(compliance, index) in compliances"
          :key="`compliance-${index}`"
          :to="`/compliance/${compliance._id}`"
          class="flex no-underline rounded-lg bg-waterloo hover:bg-waterloo-light my-2"
        >
          <div style="width: 30%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ compliance.name }}</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ $moment(compliance.createdAt).format('MMM D, YYYY | hh:mm A') }}</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ compliance.updatedAt }}</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <button>Edit</button>
              <button>Delete</button>
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
  // async asyncData({ app }) { <!--PROMISES HERE-->
  //   try {
  //     let response = await app.$axios.get(`/api/v1/compliances`);
  //     const compliances = response.data.data.compliances;
  //     return {
  //       compliances
  //     };
  //   } catch (err) {
  //     console.log("index qualifications index asyncData err", err);
  //   }
  // },
  data() {
    return {
      compliances: []
    };
  }
};
</script>
