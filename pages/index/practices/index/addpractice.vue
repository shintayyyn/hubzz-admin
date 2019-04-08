<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100% - 70px);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/practices" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <!-- HEADER -->

      <div class="flex flex-wrap overflow-hidden p-6 text-base text-white py-2">
        <div class="w-full overflow-hidden">
          <div class="pb-4">
            <strong>Add Practice</strong>
          </div>
        </div>
        <div class="w-full">
          <div
            class="flex items-center pd-4 border-b-2 border-grey-light focus-within:border-teal"
            style="width: 400px;"
          >
            <input
              class="bg-transparent border-none w-full text-white mr-3 py-1 leading-tight focus:outline-none"
              type="text"
              placeholder="Search for practice by name, etc."
              aria-label="Full name"
            >
          </div>
        </div>
        <div class="w-full overflow-hidden">
          <div class="self-end">
            <button
              class="inline-flex py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow"
            >Search</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  transition: "subpage",

  async asyncData({ app, route }) {
    try {
    } catch (err) {
      console.log("index qualifications index create asyncData err", err);
    }
  },

  data() {
    return {
      name: ""
    };
  }
};
</script>
