<template>
  <div class="fixed lg:absolute overflow-x-hidden overflow-y-auto pin-t pin-b pin-r pin-l flex flex-col">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout shadow-lg">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/support" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <!-- HEADER -->
      <div class="flex flex-wrap overflow-hidden pl-4">
        <div class="px-1 w-1/8 overflow-hidden">
          <div class="self-end">
            <button class="inline-flex py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow">
              <svgicon
                  name="reply"
                  width="21"
                  height="21"
                  color="black"
              ></svgicon>
              <span class="pt-1 pl-1">Reply?</span>
            </button>
          </div>
        </div>

        <div class="px-1 w-1/8 overflow-hidden">
          <div class="self-end">
            <button
              class="inline-flex py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow"
            >
              <svgicon
                  name="forward"
                  width="21"
                  height="21"
                  color="black"
              ></svgicon>
              <span class="pt-1 pl-1">Forward?</span>
            </button>
          </div>
        </div>
      </div>
      <div class="m-4">
        <div class="invoice flex flex-col bg-white py-2 px-4" style="height: 750px">
          WORK IN PROGRESS
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
<style>
  .invoice{
    width: 100%;
  }
  .page-overlap{
    min-width: 100%;
  }
  @media screen and (min-width: 768px){
    .page-overlap{
    min-width: calc(100% - 70px);
    }
    .invoice{
      width: 550px;
    }
  }

  @media screen and (min-width: 1200px) {
    .page-overlap{
      min-width: calc(100% - 200px);
    }
  }
</style>