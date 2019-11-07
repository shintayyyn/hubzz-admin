<template>
  <div>
    <div class="flex justify-between text-sm text-white">
      <nuxt-link to="/billings" class="text-white pb-2">
        <svgicon name="arrow-left-solid" height="32" width="32" class="text-white hover:text-sunglow fill-current focus:outline-none" />
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
      <div class="invoice flex flex-col bg-white p-4">
        <div class="flex flex-wrap overflow-hidden">
          <div class="px-1 w-3/5 overflow-hidden">
            <!-- Column Content -->
          </div>
          <div class="mb-2 px-1 w-full sm:w-2/5 overflow-hidden">
            <p class="text-sm text-right">
              Hubzz Limited
              Mws, 601 London Road
              Westcliff-On-Sea SS0 9PE
              billing@hubzz.co.uk
              Registered Company 10832559
            </p>
          </div>
        </div>
        <div class="flex flex-wrap overflow-hidden">
          <div class="my-1 px-1 w-2/3 overflow-hidden">
            <div class="border-2 border-gray-300 rounded-lg p-4 text-sm">
              <div class="pb-2">To: Accounts Department</div>
              <select
                class="block appearance-none font-bold w-full bg-white border-b-2 border-gray-300 hover:border-gray py-2 leading-tight focus:outline-none"
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
        <div class="flex flex-wrap overflow-hidden">
          <div class="my-1 px-1 w-full overflow-hidden">
            <select
              class="block appearance-none font-bold text-sm w-full bg-white border-b-2 border-gray-300 hover:border-gray py-2 leading-tight focus:outline-none"
            >
              <option>Select the Practice for this Invoice</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>

          <div class="my-1 px-1 w-full overflow-hidden">
            <div class="flex flex-col border-b border-gray-400 pb-2">
              <!--HEADER-->
              <div class="flex items-center justify-center py-2 bg-black">
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
                <div class="mr-2">
                  <span class="bg-gray-900 hover:bg-gray-800 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white">+</span>
                </div>
              </div>
              <!--HEADER-->
              <div class="flex justify-center py-1">
                <div class="w-2/3 text-sm mx-1">
                  <textarea class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1" placeholder="Enter Description"></textarea>
                </div>
                <div class="w-1/3 text-sm mx-1">
                  <input class="border-b-2 border-gray-300 w-full h-full focus:outline-none" type="number" placeholder="Enter Amount"/>
                </div>
                <div class="mr-2 flex items-center">
                  <span class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white">-</span>
                </div>
              </div>
              <div class="flex justify-center py-1">
                <div class="w-2/3 text-sm mx-1">
                  <textarea class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1" placeholder="Enter Description"></textarea>
                </div>
                <div class="w-1/3 text-sm mx-1">
                  <input class="border-b-2 border-gray-300 w-full h-full focus:outline-none" type="number" placeholder="Enter Amount"/>
                </div>
                <div class="mr-2 flex items-center">
                  <span class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white">-</span>
                </div>
              </div>
            </div>
          </div>
          <div class="my-1 px-1 w-full overflow-hidden">
            <div class="flex flex-wrap">
              <div class="my-1 px-1 w-2/3 font-bold">Total</div>
              <div class="my-1 px-1 w-1/3 text-right">£1200</div>
            </div>
          </div>
        </div>
        <div class="border-2 border-gray-300 rounded-lg p-2 text-sm">
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