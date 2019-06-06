<template>
  <div class="absolute pin-t pin-b pin-r pin-l flex flex-col">
    <div
      style="width: calc(100% - 140px);"
      class="flex-1 flex flex-col self-end bg-trout overflow-auto"
    >
      <!-- HEADER -->
      <div class="flex text-sm text-white py-2 px-6">
        <nuxt-link
          :to="{path:`/compliances/${locumUser.id}`}"
          class="text-white hover:text-yellow-dark p-1 mr-4"
        >
          <svgicon
            name="arrow-left-solid"
            height="22"
            width="22"
            class="hover:text-yellow-dark fill-current"
          />
        </nuxt-link>
        <button
          class="text-white hover:text-black hover:bg-yellow-dark rounded-lg inline-flex p-2 mr-4"
        >
          <i class="material-icons -mt-1" style="font-size:20px;">save</i>Save
        </button>
        <button class="text-white hover:text-black hover:bg-yellow-dark rounded-lg inline-flex p-2">
          <i class="material-icons -mt-1" style="font-size:20px;">remove_red_eye</i>Download
        </button>
      </div>
      <!-- HEADER -->
      <!-- BODY -->
      <div class="flex-col shadow-lg rounded-lg bg-waterloo mx-6 mt-10">
        <div class="inline-flex text-xs m-4">
          <div class="text-grey m-2">
            <p class="mr-20">Title</p>
            <p class="text-white">{{locumComplianceDocument.compliance_document ? locumComplianceDocument.compliance_document.name: null}}</p>
            <p class="mt-5 mr-20">Locum</p>
            <p class="text-white underline">{{locumUser.personal_detail ? locumUser.personal_detail.name : null}}</p>
            <p class="mt-5 mr-20">Mobile phone number</p>
            <p class="text-white">{{locumUser.contact_detail ? locumUser.contact_detail.mobile_number : null}}</p>
            <div class="mt-5 mr-20">
              <label for="expiryDate">Expiry date</label>
              <input
                type="date"
                class="date-picker hasDatepicker valid"
                name="expiryDate"
                disable-min-date
                value
                placeholder="dd/mm/yyyy"
                id="dp1554355291222"
                aria-invalid="false"
              >
            </div>
          </div>
          <div class="text-grey m-2">
            <p class="mr-20">Headline</p>
            <p class="text-white">s</p>
          </div>
        </div>
      </div>
      <!-- BODY -->
    </div>
  </div>
</template>

<script>
export default {
  transition: "subpage",

  data() {
    return {
      locumUser:null,
    };
  },

  async asyncData({ app, route }) {
    try {

      let response = await app.$axios.get(`/api/v1/admin/locum-detail-compliance-documents/${route.params.fileID}`)
      const locumComplianceDocument = response.data.data.locum_detail_compliance_document

      response = await app.$axios.get(`/api/v1/admin/locum-users/${locumComplianceDocument.locum_detail.user.id}`)
      const locumUser = response.data.data.user

      return{
        locumComplianceDocument,
        locumUser
      }

    } catch (err) {
      console.log("index practices index create asyncData err", err);
    }
  },


};
</script>
