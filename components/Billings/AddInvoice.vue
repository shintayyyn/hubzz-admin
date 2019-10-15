<template>
  <div>
    <div class="flex justify-between text-sm text-white">
      <nuxt-link to="/billings" class="text-white px-1 pb-2">
        <svgicon name="arrow-left-solid" height="22" width="22" class="text-white hover:text-sunglow fill-current focus:outline-none" />
      </nuxt-link>
    </div>
    <!-- HEADER -->
    <div class="flex flex-wrap overflow-hidden md:pl-4 mb-1">
      <div class="px-1">
        <button
          class="inline-flex items-center py-2 px-4 my-1 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow focus:outline-none"
        >
          <svgicon name="save-icon" width="21" height="21" color="transparent black"></svgicon>
          <span class="pl-1">Save Changes</span>
        </button>
      </div>
      <div class="px-1">
        <button
          class="inline-flex items-center py-2 px-4 my-1 bg-sunglow hover:bg-sunglow-dark text-sm text-black rounded-lg shadow"
        >
          <svgicon name="email" width="21" height="21" color="black"></svgicon>
          <span class="pl-1">Save and Archive as Final</span>
        </button>
      </div>
    </div>
    <div class="md:m-4">
      <div class="invoice flex flex-col bg-white py-2 px-4">
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
              <br />Not yet issued
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
              <div class="flex items-center justify-center my-1 py-2 bg-black">
                <div class="w-2/3">
                  <div class="text-white text-sm text-left px-4">
                    <strong>Description</strong>
                  </div>
                </div>
                <div class="w-1/3">
                  <div class="text-white text-sm text-center">
                    <strong>Total</strong>
                  </div>
                </div>
                <div class="px-2">
                <button
                  class="bg-black border text-white font-bold flex items-center justify-center w-6 h-6 rounded-full focus:outline-none"
                >+</button>
              </div>
              </div>
              <!--HEADER-->
              <div class="flex justify-center py-1">
                  <div class="w-2/3 text-sm px-4">
                    <strong>Sample</strong>
                  </div>
                  <div class="w-1/3 text-sm">
                    <strong>1200</strong>
                  </div>
              </div>
            </div>
          </div>
          <div class="my-1 px-2 w-full overflow-hidden">
            <div class="flex flex-wrap -mx-1 overflow-hidden">
              <div class="my-1 px-1 w-2/3 overflow-hidden">Total</div>
              <div class="my-1 px-1 w-1/3 overflow-hidden">£1200</div>
              
            </div>
          </div>
        </div>
        <div class="border border-black rounded-lg p-2 text-sm">
          Payment by BACS:
          <br />Account name: XXX
          <br />Bank: XXX
          <br />Sort code: XXX
          <br />Account number: XXX
          <br />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  transition: "subpage",

  data() {
    return {};
  }
};
</script>
<style>
</style>