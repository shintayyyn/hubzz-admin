<template>
  <div class="fixed inset-y-0 right-0 m-0 w-full h-full xl:w-4/5 z-512 overflow-auto border-l-2 border-sunglow bg-trout p-2 md:p-4 shadow-lg" style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/content-management/countries" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="flex-1 flex flex-col py-2">
        <div class="text-xl md:text-2xl text-white">
          View Country
        </div>
    
        <div class="flex text-white my-4 py-2 px-3 bg-waterloo-dark shadow rounded-lg text-sm max-w-lg">
          <div class="w-full text-gray-300 text-sm p-2">
            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Name</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">{{ country ? country.name : null }}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Code</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">{{ country ? country.code : null }}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Compliance Document Count</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">{{ country ? country.compliance_document_count : null }}</span>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Locum Compliance Document Count</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">{{ country ? country.locum_compliance_document_count : null }}</span>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <nuxt-link
                :to="`/content-management/countries/${$route.params.id}/edit`"
                class="
                  inline-flex items-center text-black text-sm rounded-lg py-2 px-4
                  font-bold focus:outline-none transitions-colors duration-150 ease-liner
                  bg-sunglow hover:bg-sunglow-dark
                "
              >
                <span>Edit</span>
              </nuxt-link>

              <button
                class="
                  inline-flex items-center text-black text-sm rounded-lg py-2 px-4
                  font-bold focus:outline-none transitions-colors duration-150 ease-liner
                  bg-red-500 hover:bg-red-600 text-white
                "
                @click="deleteCountry"
              >
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        country: null,
      }
    },

    mounted () {
      this.loading = true
      this.$axios.get(`/api/v1/admin/countries/${this.$route.params.id}`).then((response) => {
        this.country = response.data.data.country
      }).catch((err) => {
        console.log('err', err)
        this.$nuxt.error(err)
      }).finally(() => {
        this.loading = true
      })
    },

    methods: {
      deleteCountry () {
        const result = window
          ? window.confirm('Are you sure you want to delete this country?')
          : true

        if (result) {
          const countryId = this.country.id
          this.loading = true
          this.$axios.delete(`/api/v1/admin/countries/${countryId}`).then(() => {
            this.$emit('countryDeleted', {
              id: countryId,
            })
            this.$router.push('/content-management/countries')
          }).catch((err) => {
            console.log('err', err)
            this.$nuxt.error(err)
          }).finally(() => {
            this.loading = true
          })
        }
      }
    }
  }
</script>
