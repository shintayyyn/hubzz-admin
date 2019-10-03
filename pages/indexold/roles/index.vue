<template>
  <div class="flex-1 flex flex-col py-2 px-6">
    <div class="flex pb-8">
      <div class="relative">
        <input
          class="outline-none rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:hubzz-yellow bg-waterloo"
          placeholder="Search for..."
        >
        <button class="p-2 absolute top-0 right-0 bottom-0">
          <svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
        </button>
      </div>
      <button
        class="rounded-lg text-xs text-white p-2 mx-1 hover:text-black hover:bg-yellow-500"
      >Go</button>
    </div>

    <div>
      <table style="border-collapse: separate; border-spacing: 0 .75rem;">
        <thead>
          <tr>
            <th>
              <div class="flex text-white text-xs p-4">
                <span>Name</span>
              </div>
            </th>
            <th>
              <div class="flex text-white text-xs p-4">
                <span>Created At</span>
              </div>
            </th>
            <th>
              <div class="flex text-white text-xs p-4">
                <span>Updated At</span>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="role in roles"
            v-bind:key="role"
            class="bg-waterloo hover:bg-waterloo-light m-8"
          >
            <td style="border-top-left-radius: .75rem; border-bottom-left-radius: .75rem;">
              <div class="flex text-white text-xs p-4">
                <span>{{ role.name }}</span>
              </div>
            </td>
            <td>
              <div class="flex text-white text-xs p-4">
                <span>{{ role.createdAt }}</span>
              </div>
            </td>
            <td style="border-top-right-radius: .75rem; border-bottom-right-radius: .75rem;">
              <div class="flex text-white text-xs p-4">
                <span>{{ role.updatedAt }}</span>
              </div>
            </td>
          </tr>
          <!-- </tr> -->
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  async asyncData({ app }) {
    try {
      let response = await app.$axios.get(`/api/v1/roles`);

      const roles = response.data.data.roles;

      return {
        roles
      };
    } catch (err) {
      console.log("index roles index asyncData err", err);
    }
  },

  data() {
    return {
      roles: []
    };
  }
};
</script>
