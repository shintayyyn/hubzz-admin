<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col overflow-auto">
    <div style="width: calc(100% - 70px);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">
      <!-- HEADER -->
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/billing" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <!-- HEADER -->
      <div class="flex flex-wrap overflow-hidden pl-4">
        <div class="my-1 px-1 w-1/8 overflow-hidden">
          <div class="self-end">
            <button
              class="inline-flex py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow"
            >
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

        <div class="my-1 px-1 w-1/8 overflow-hidden">
          <div class="self-end">
            <button
              class="inline-flex py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow"
            >
              <svgicon
                  name="email-icon"
                  width="21"
                  height="21"
                  color="transparent black"
              ></svgicon>
              <span class="pt-1 pl-1">Save and Archive as Final</span>
            </button>
          </div>
        </div>

        <div class="w-1/3 overflow-hidden"></div>
      </div>

      <div class="flex flex-col bg-white m-4 py-2 px-4" style="width: 550px; height: 750px">
        <div class="flex flex-wrap -mx-1 pt-6 overflow-hidden">
          <div class="my-1 px-1 w-3/5 overflow-hidden">
            <!-- Column Content -->
          </div>
          <div class="my-1 px-1 w-2/5 overflow-hidden">
            <p class="text-xs text-right">
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
            <div class="border border-black rounded-lg p-4 text-xs">
              <div class="pb-2">To: Accounts Department</div>
              <select
                class="block appearance-none w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
              >
                <option>Select the Practice for this Invoice</option>
                <option>Option 2</option>
                <option>Option 3</option>
              </select>
            </div>
          </div>
          <div class="my-1 px-1 w-1/3 overflow-hidden">
            <div class="text-xs float-right text-right content-end">
              <strong>INVOICE</strong>
              <br>Not yet issued
            </div>
          </div>
        </div>
        <div class="flex flex-wrap -mx-1 overflow-hidden">
          <div class="my-1 px-1 w-full overflow-hidden">
            <select
              class="block appearance-none text-xs w-full bg-white border border-grey-light hover:border-grey px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
            >
              <option>Select the Practice for this Invoice</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>

          <div class="my-1 px-1 w-full overflow-hidden">
            <div class="flex flex-col">
              <!--HEADER-->
              <div class="flex justify-center my-2 bg-black">
                <div style="width: 70%;">
                  <div class="text-white text-xs text-center">
                    <strong>Description</strong>
                  </div>
                </div>
                <div style="width: 30%;">
                  <div class="text-white text-xs text-center">
                    <strong>Total</strong>
                  </div>
                </div>
              </div>
              <!--HEADER-->
            </div>
          </div>
          <div class="my-1 px-1 w-full overflow-hidden"></div>

          <div class="my-1 px-1 w-full overflow-hidden">
            <div class="flex flex-wrap -mx-1 overflow-hidden">
              <div class="my-1 px-1 w-3/5 overflow-hidden">Total</div>
              <div class="my-1 px-1 w-1/5 overflow-hidden">£</div>
              <div class="my-1 px-1 w-1/5 overflow-hidden">
                <button
                  class="bg-black hover:bg-grey-dark text-white font-bold px-2 py-1 rounded-full float-right"
                >+</button>
              </div>
            </div>
          </div>
        </div>

        <div class="content-end border border-black rounded-lg p-1 text-xs">
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
