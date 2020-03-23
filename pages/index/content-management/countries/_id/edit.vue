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
          Edit Country
        </div>
    
        <div class="flex text-white my-4 py-2 px-3 bg-waterloo-dark shadow rounded-lg text-sm max-w-lg">
          <div class="w-full text-gray-300 text-sm p-2">
            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Name</span>
                  <span class="text-red-500"> *</span>
                </label>
                
                <div v-if="nameErrorMessage" class="flex items-center">
                  <div class="bg-red-300 text-red-700 py-1 px-2 text-xs">
                    <span>{{ nameErrorMessage }}</span>
                  </div>
                </div>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <input
                    v-model="name"
                    class="bg-transparent border-b-2 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full"
                    :class="[nameErrorMessage ? 'border-red-500' : 'focus:border-yellow-500']"
                  >
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Code</span>
                  <span class="text-red-500"> *</span>
                </label>
                
                <div v-if="codeErrorMessage" class="flex items-center">
                  <div class="bg-red-300 text-red-700 py-1 px-2 text-xs">
                    <span>{{ codeErrorMessage }}</span>
                  </div>
                </div>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <input
                    v-model="code"
                    class="bg-transparent border-b-2 focus:outline-none py-2 font-bold text-xs sm:text-sm w-full"
                    :class="[codeErrorMessage ? 'border-red-500' : 'focus:border-yellow-500']"
                  >
                </div>
              </div>
            </div>

            <div class="mt-4">
              <button
                class="
                  inline-flex items-center text-black text-sm rounded-lg py-2 px-4
                  font-bold focus:outline-none transitions-colors duration-150 ease-liner
                  bg-sunglow hover:bg-sunglow-dark
                "
                @click="updateCountry"
              >
                <span>Update</span>
              </button>

              <nuxt-link
                :to="`/content-management/countries/${$route.params.id}`"
                class="
                  inline-flex items-center text-black text-sm rounded-lg py-2 px-4
                  font-bold focus:outline-none transitions-colors duration-150 ease-liner
                  bg-gray-400 hover:bg-gray-500
                "
              >
                <span>Cancel</span>
              </nuxt-link>
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
        name: '',
        nameErrorMessage: '',
        code: '',
        codeErrorMessage: '',
      }
    },

    mounted () {
      this.loading = true
      this.$axios.get(`/api/v1/admin/countries/${this.$route.params.id}`).then((response) => {
        this.country = response.data.data.country
        this.name = this.country.name
        this.code = this.country.code
      }).catch((err) => {
        console.log('err', err)
        this.$nuxt.error(err)
      }).finally(() => {
        this.loading = true
      })
    },

    methods: {
      updateCountry () {
        const countryId = this.country.id
        this.loading = true
        this.$axios.put(`/api/v1/admin/countries/${countryId}`, {
          name: this.name,
          code: this.code,
        }).then((response) => {
          const country = response.data.data.country
          this.$emit('countryUpdated', {
            country,
          })
          this.$router.push(`/content-management/countries/${countryId}`)
        }).catch((err) => {
          console.log('err', err)

          if (err.response && err.response.status === 400) {
            const errorMessages = err.response.data.error_messages || []

            const nameErrorMessage = errorMessages.find((errorMessage) => {
              return errorMessage.field === 'name'
            })

            this.nameErrorMessage = nameErrorMessage ? nameErrorMessage.message : ''

            const codeErrorMessage = errorMessages.find((errorMessage) => {
              return errorMessage.field === 'code'
            })

            this.codeErrorMessage = codeErrorMessage ? codeErrorMessage.message : ''

            return
          }

          this.$nuxt.error(err)
        }).finally(() => {
          this.loading = false
        })
      },
    },
  }
</script>
