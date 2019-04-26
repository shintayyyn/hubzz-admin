<template>
  <div class="flex-1 flex flex-col py-2 px-4 overflow-auto">
    <div>
      <nuxt-link
        to="/qualifications/create"
        class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow"
      >Create</nuxt-link>
    </div>

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

    <!-- TABLE -->
    <div>
      <div class="flex flex-col">
        <!-- HEADER -->
        <div class="flex my-2">
          <div style="width: 30%;">
            <div class="flex text-white text-xs p-4">
              <strong>Name</strong>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <strong>Created At</strong>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <strong>Updated At</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Actions</strong>
            </div>
          </div>
        </div>
        <!-- HEADER -->

        <!-- BODY -->
        <nuxt-link
          v-for="(qualification, index) in qualifications"
          :key="`qualification-${index}`"
          :to="`/qualifications/${qualification._id}`"
          class="flex no-underline rounded-lg bg-waterloo shadow hover:bg-waterloo-light my-2"
        >
          <div style="width: 30%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ qualification.name }}</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ $moment(qualification.createdAt).format('MMM D, YYYY | hh:mm A') }}</span>
            </div>
          </div>
          <div style="width: 25%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ qualification.updatedAt }}</span>
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
  async asyncData({ app }) {
    try {
      let response = await app.$axios.get(`/api/v1/qualifications`);

      const qualifications = response.data.data.qualifications;

      return {
        qualifications
      };
    } catch (err) {
      console.log("index qualifications index asyncData err", err);
    }
  },

  data() {
    return {
      qualifications: []
    };
  }
};
</script>
