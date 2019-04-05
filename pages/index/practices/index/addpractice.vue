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
      <div class="text-sm text-white py-2 px-6">
        <h2>Add Practice</h2>
      </div>
      <div
        class="flex items-center pd-4 border-b-2 border-grey-light focus-within:border-teal"
        style="width: 400px;"
      >
        <div class="flex flex-col">
          <input
            class="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none"
            type="text"
            placeholder="Jane Doe"
            aria-label="Full name"
          >
        </div>
      </div>
      <div class="self-end">
        <button
          class="inline-flex py-2 px-4 my-2 bg-sunglow text-xs text-black rounded-lg shadow"
        >Save</button>
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
