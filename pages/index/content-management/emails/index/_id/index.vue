<template>
  <div class="fixed inset-y-0 right-0 m-0 w-full h-full xl:w-4/5 z-512 overflow-auto border-l-2 border-sunglow bg-trout p-2 md:p-4 shadow-lg" style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link to="/content-management/emails" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div class="flex-1 flex flex-col py-2">
        <div class="text-xl md:text-2xl text-white">
          <span>View Email</span>
        </div>

        <div class="mt-4">
          <a
            v-if="url"
            :href="url"
            target="_blank"
            class="
              inline-flex items-center text-black text-sm rounded-lg py-2 px-4
              font-bold focus:outline-none transitions-colors duration-150 ease-liner
              bg-sunglow hover:bg-sunglow-dark
            "
          >
            <span>View HTML</span>
          </a>
        </div>
      
        <div class="flex text-white my-4 py-2 px-3 bg-waterloo-dark shadow rounded-lg text-sm max-w-lg">
          <div class="w-full text-gray-300 text-sm p-2">
            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Email</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">
                    <span>{{ email ? email.email : null }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="w-full text-gray-300 text-sm p-2">
              <div class="flex flex-col py-2">
                <div class="relative flex justify-between flex-wrap leading-none">
                  <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                    <span>Username</span>
                  </label>
                </div>
        
                <div class="flex flex-row justify-start">
                  <div class="flex flex-col w-full">
                    <span class="pl-4 py-2 font-bold text-xs sm:text-sm">
                      <span>{{ email ? email.username : null }}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>User</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">
                    <span>{{ email && email.user ? email.user.name : null }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Email Type</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">
                    <span>{{ email && email.email_type ? email.email_type.name : null }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Sent At</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">
                    <span>{{
                      email && email.sent_at
                        ? $moment(email.sent_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm')
                        : null
                    }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Created At</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm">
                    <span>{{
                      email && email.created_at
                        ? $moment(email.created_at, 'YYYY-MM-DD[T]HH:mm:ss.SSS').format('DD/MM/YYYY | HH:mm')
                        : null
                    }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Payload</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm overflow-auto bg-trout" style="height: 300px;">
                    <span class="whitespace-pre-wrap">{{ email && email.payload ? JSON.stringify(email.payload, null, 4) : null }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div class="flex flex-col py-2">
              <div class="relative flex justify-between flex-wrap leading-none">
                <label class="text-xs sm:text-sm py-1 pr-2 font-bold">
                  <span>Reponse</span>
                </label>
              </div>
      
              <div class="flex flex-row justify-start">
                <div class="flex flex-col w-full">
                  <span class="pl-4 py-2 font-bold text-xs sm:text-sm overflow-auto bg-trout" style="height: 300px;">
                    <span class="whitespace-pre-wrap">{{ email && email.response ? JSON.stringify(email.response, null, 4) : null }}</span>
                  </span>
                </div>
              </div>
            </div>

            <div v-if="false" class="mt-4">
              <nuxt-link
                :to="`/content-management/emails/${$route.params.id}/edit`"
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
                @click="deleteEmail"
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
        email: null,
      }
    },

    computed: {
      url () {
        return this.email
          ? `${process.env.API_URL}/api/v1/admin/emails/${this.email.id}/html`
          : null
      }
    },

    mounted () {
      this.loading = true
      this.$axios.get(`/api/v1/admin/emails/${this.$route.params.id}`).then((response) => {
        this.email = response.data.data.email
      }).catch((err) => {
        console.log('err', err)
        this.$nuxt.error(err)
      }).finally(() => {
        this.loading = true
      })
    },

    methods: {
      deleteEmail () {
        const result = window
          ? window.confirm('Are you sure you want to delete this email?')
          : true

        if (result) {
          const emailId = this.email.id
          this.loading = true
          this.$axios.delete(`/api/v1/admin/emails/${emailId}`).then(() => {
            this.$emit('emailDeleted', {
              id: emailId,
            })
            this.$router.push('/content-management/emails')
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
