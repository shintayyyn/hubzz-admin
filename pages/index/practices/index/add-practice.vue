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

      <div class="m-4">
        <h2 class="text-white">Add Practice</h2>
        <form class="w-full max-w-sm">
          <div class="flex items-center border-b border-b-2 py-2">
            <input
              class="appearance-none bg-transparent border-none w-full text-grey mr-3 py-1 px-2 leading-tight focus:outline-none"
              type="text"
              placeholder="Search for practice by name, etc"
              aria-label="Full name"
            >
          </div>
        </form>
        <button
          class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow"
        >Search</button>
      </div>
    </div>
    <div>
      <nuxt-child/>
    </div>
  </div>
</template>

<script>
export default {
  transition: "subpage",

  async asyncData({ app, route }) {
    try {
    } catch (err) {
      console.log("index practices index create asyncData err", err);
    }
  },

  data() {
    return {
      name: ""
    };
  }
};
</script>
