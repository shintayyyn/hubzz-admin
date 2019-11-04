<template>
  <div class="fixed lg:absolute top-0 bottom-0 right-0 left-0 flex flex-col overflow-auto">
    <div class="page-overlap flex-1 flex flex-col self-end bg-trout shadow-lg">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/billing" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current"/>
        </nuxt-link>
      </div>
      <!-- HEADER -->
      <div class="flex flex-wrap overflow-hidden pl-4">
        <div class="px-1 w-1/8 overflow-hidden">
          <div class="self-end">
            <button class="inline-flex py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow">
              <svgicon
                  name="save-icon"
                  width="21"
                  height="21"
                  color="transparent black"
              ></svgicon>
              <span class="pt-1 pl-1">Save Changes</span>
            </button>
          </div>
        </div>

        <div class="px-1 w-1/8 overflow-hidden">
          <div class="self-end">
            <button
              class="inline-flex py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow"
            >
              <svgicon
                  name="email"
                  width="21"
                  height="21"
                  color="black"
              ></svgicon>
              <span class="pt-1 pl-1">Save and Archive as Final</span>
            </button>
          </div>
        </div>
      </div>
      <div class="m-4">
        <div class="invoice flex flex-col bg-white py-2 px-4" style="height: 750px">
          <div class="flex flex-wrap -mx-1 pt-4 overflow-hidden">
            <div class="my-2 px-1 w-3/5 overflow-hidden">
              <!-- Column Content -->
            </div>
            <div class="my-2 px-1 w-full sm:w-2/5 overflow-hidden">
              <p class="text-sm text-right">
                Hubzz Limited
                Mws, 601 London Road
                Westcliff-On-Sea SS0 9PE
                billing@hubzz.co.uk
                Registered Company 10832559
              </p>
            </div>
          </div>
          <div class="flex flex-wrap -mx-1 overflow-hidden">
            <div class="my-1 px-1 w-2/3 overflow-hidden">
              <div class="border border-black rounded-lg p-4 text-sm">
                <div class="pb-2">To: Accounts Department</div>
                <select
                  class="block appearance-none w-full bg-white border border-gray-300 hover:border-gray px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option>Select the Practice for this Invoice</option>
                  <option>Option 2</option>
                  <option>Option 3</option>
                </select>
              </div>
            </div>
            <div class="my-1 px-1 w-1/3 overflow-hidden">
              <div class="text-sm float-right text-right content-end">
                <strong>INVOICE</strong>
                <br>Not yet issued
              </div>
            </div>
          </div>
          <div class="flex flex-wrap -mx-1 overflow-hidden">
            <div class="my-1 px-1 w-full overflow-hidden">
              <select
                class="block appearance-none text-sm w-full bg-white border border-gray-300 hover:border-gray px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                <option>Select the Practice for this Invoice</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>

            <div class="my-1 px-1 w-full overflow-hidden">
              <div class="flex flex-col border-b-2">
                <!--HEADER-->
                <div class="flex justify-center my-1 py-2 bg-black">
                  <div style="width: 70%;">
                    <div class="text-white text-sm text-left px-4">
                      <strong>Description</strong>
                    </div>
                  </div>
                  <div style="width: 30%;">
                    <div class="text-white text-sm text-center">
                      <strong>Total</strong>
                    </div>
                  </div>
                </div>
                <!--HEADER-->
                <div class="flex justify-center py-1">
                  <div style="width: 70%;">
                    <div class="text-sm text-left px-4">
                      <strong>Sample</strong>
                    </div>
                  </div>
                  <div style="width: 30%;">
                    <div class="text-sm text-center">
                      <strong>1200</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="my-2 px-2 w-full overflow-hidden">
              <div class="flex flex-wrap -mx-1 overflow-hidden">
                <div class="my-1 px-1 w-3/5 overflow-hidden">Total</div>
                <div class="my-1 px-1 w-1/5 overflow-hidden">£1200</div>
                <div class="my-1 px-1 w-1/5 overflow-hidden">
                  <button
                    class="bg-black hover:bg-gray-dark text-white font-bold px-2 py-1 rounded-full float-right"
                  >+</button>
                </div>
              </div>
            </div>
          </div>

          <div class="content-end border border-black rounded-lg p-2 text-sm">
            Payment by BACS:
            <br>Account name: XXX
            <br>Bank: XXX
            <br>Sort code: XXX
            <br>Account number: XXX
            <br>
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
<style>
  .invoice{
    width: 100%;
  }
  @media(min-width: 480px){
    .right-side-header-content{
      width: calc(100% - 0px);
    }
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