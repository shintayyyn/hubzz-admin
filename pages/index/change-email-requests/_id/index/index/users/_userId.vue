<template>
  <div class="fixed inset-y-0 right-0 m-0 w-full h-full xl:w-7/10 z-512 overflow-auto border-l-2 border-sunglow bg-trout p-2 md:p-4 shadow-lg" style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end bg-trout">
      <div class="flex justify-between text-sm text-white">
        <nuxt-link :to="{ name: 'index-change-email-requests-id-index-index' }" class="text-white hover:text-sunglow p-1">
          <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
        </nuxt-link>
      </div>

      <div>
        <div
          class="mx-2 md:mx-4 flex no-underline shadow-lg rounded-lg bg-waterloo mt-4 shadow"
          style="position:relative;"
        >
          <div class="w-4/5 overflow-hidden text-sm m-4">
            <div class="text-gray-400">
              <p class="m-2">
                ID <span class="m-2 text-white">{{ user ? user.id : null }}</span>
              </p>
              <p class="m-2">
                Domain <span class="m-2 text-white">{{ user ? user.domain : null }}</span>
              </p>
              <p class="m-2">
                Username <span class="m-2 text-white">{{ user ? user.username : null }}</span>
              </p>
              <p class="m-2">
                Name <span class="m-2 text-white">{{ user ? user.name : null }}</span>
              </p>
              <p class="m-2">
                Email <span class="m-2 text-white">{{ user ? user.email : null }}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      changeEmailRequest: {
        type: Object,
        required: true,
      }
    },

    computed: {
      user () {
        if (!this.changeEmailRequest) {
          return null
        }

        const user = this.changeEmailRequest.users.find(user => user.id.toString() === this.$route.params.userId.toString())

        return user || null
      },
    },
  }
</script>
