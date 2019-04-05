<template>
  <div class="flex-1 flex flex-col py-2 px-6 overflow-auto">
    <div>
      <nuxt-link
        to="/locums/create"
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
              <strong>Date Signed-Up</strong>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <strong>Sign-Up Verified</strong>
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
          :to="`/locums/${locums._id}`"
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
              <span>{{ locum.signupdate }}</span>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <span>{{ locum.signupverified }}</span>
            </div>
          </div>
          <div style="width: 20%;">
            <div class="flex text-white text-xs p-4">
              <span>{{locum.status}}</span>
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
  //     let response = await app.$axios.get(`/api/v1/qualifications`);

  //     const qualifications = response.data.data.qualifications;

  //     return {
  //       qualifications
  //     };
  //   } catch (err) {
  //     console.log("index qualifications index asyncData err", err);
  //   }
  // },

  data() {
    return {
      locums: [
        {
          name: "Mr.Jerico Pulvera, Ph. D",
          profession: "GP",
          signupdate: "19/03/2019",
          signupverified: "19/03/2019",
          status: "Active"
        },
        {
          name: "Mr.Jerico Pulvera, Ph. D",
          profession: "GP",
          signupdate: "19/03/2019",
          signupverified: "19/03/2019",
          status: "Active"
        },
        {
          name: "Mr.Jerico Pulvera, Ph. D",
          profession: "GP",
          signupdate: "19/03/2019",
          signupverified: "19/03/2019",
          status: "Active"
        }
      ]
    };
  }
};
</script>
