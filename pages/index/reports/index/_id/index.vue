<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div style="width: calc(100% - 70px);" class="flex-1 flex flex-col self-end bg-trout shadow-lg">
      <div class="flex justify-between text-sm text-white py-2 px-6">
        <nuxt-link to="/reports/" class="text-white p-1">
          <svgicon name="arrow-left-solid" height="22" width="22" class="text-white fill-current"/>
        </nuxt-link>
      </div>
      <div class="flex p-6">
        <div class="flex sm-6">
          <div class="w-3/5">
            <div class="relative">
              <input
                class="outline-none rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:hubzz-yellow bg-waterloo"
                placeholder="Search for..."
              >
              <button class="-ml-5 pd-2 pin-t pin-r pin-b">
                <svgicon name="times-solid" height="12" width="12" class="text-white fill-current"/>
              </button>
              <button
                class="rounded-lg text-xs text-white p-2 mx-1 hover:text-black hover:bg-yellow-dark"
              >Go</button>
            </div>
          </div>
          <div class="w-1/5">
            <div class="text-xs text-white p-2 mx-1">Filter by Status</div>
          </div>
          <div class="w-1/5">
            <select
              class="outline-none rounded-lg border-2 border-transparent text-xs text-white p-2 pr-6 focus:hubzz-yellow bg-waterloo"
            >
              <option>All</option>
              <option>Paid</option>
              <option>Not Paid</option>
            </select>
          </div>
        </div>
      </div>
      <div class="p-2">
        <table class="text-left text-xs w-50">
          <thead class="bg-waterloo flex text-white border-white pt-3 pl-2">
            <tr class="flex w-full mb-4">
              <th class="p-1 w-full">Practice</th>
              <th class="p-1 w-full">Invoice Number</th>
              <th class="p-1 w-full">Job Numbers</th>
              <th class="p-1 w-full">Date Paid</th>
              <th class="p-1 w-full">£ Amount</th>
            </tr>
          </thead>
          <tbody class="bg-white flex flex-col text-xs items-center justify-between w-full">
            <tr class="flex w-full mb-4">
              <td class="p-1 w-1/4">DR BAKER AND PARTNERS</td>
              <td class="p-1 w-1/4">0000000003</td>
              <td class="p-1 w-1/4">H0000000101</td>
              <td class="p-1 w-1/4">07/03/2019</td>
              <td class="p-1 w-1/4">100.00</td>
            </tr>
            <tr class="flex w-full mb-4">
              <td class="p-1 w-1/4">DR BAKER AND PARTNERS</td>
              <td class="p-1 w-1/4">0000000003</td>
              <td class="p-1 w-1/4">H0000000101</td>
              <td class="p-1 w-1/4">07/03/2019</td>
              <td class="p-1 w-1/4">100.00</td>
            </tr>
            <tr class="flex w-full mb-4">
              <td class="p-1 w-1/4">DR BAKER AND PARTNERS</td>
              <td class="p-1 w-1/4">0000000003</td>
              <td class="p-1 w-1/4">H0000000101</td>
              <td class="p-1 w-1/4">07/03/2019</td>
              <td class="p-1 w-1/4">100.00</td>
            </tr>
            <tr class="flex w-full mb-4">
              <td class="p-1 w-1/4">DR BAKER AND PARTNERS</td>
              <td class="p-1 w-1/4">0000000003</td>
              <td class="p-1 w-1/4">H0000000101</td>
              <td class="p-1 w-1/4">07/03/2019</td>
              <td class="p-1 w-1/4">100.00</td>
            </tr>
            <tr class="flex w-full mb-4">
              <td class="p-1 w-1/4">DR BAKER AND PARTNERS</td>
              <td class="p-1 w-1/4">0000000003</td>
              <td class="p-1 w-1/4">H0000000101</td>
              <td class="p-1 w-1/4">07/03/2019</td>
              <td class="p-1 w-1/4">100.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  transition: "subpage",

  // async asyncData({ app, route }) {
  //   try {
  //     let response = await app.$axios.get(
  //       `/api/v1/qualifications/${route.params.id}`
  //     );

  //     const qualification = response.data.data.qualification;

  //     return {
  //       qualification
  //     };
  //   } catch (err) {
  //     console.log("index qualifications index _id index asyncData err", err);
  //   }
  // },

  data() {
    return {
      qualification: null
    };
  }
};
</script>
