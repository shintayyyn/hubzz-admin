<template>
  <div style="transition: all 0.3s ease-in-out;">
    <div class="flex-1 flex flex-col self-end">
      <div>
        <div
          class="mx-2 md:mx-4 flex no-underline shadow-lg rounded-lg mt-4 shadow"
          style="position:relative;"
        >
          <div class="w-4/5 overflow-hidden text-sm m-4">
            <div>
              <p class="m-2">
                ID <span class="m-2 ">{{ user ? user.id : null }}</span>
              </p>
              <p class="m-2">
                Domain <span class="m-2 ">{{ user ? user.domain : null }}</span>
              </p>
              <p class="m-2">
                Username <span class="m-2 ">{{ user ? user.username : null }}</span>
              </p>
              <p class="m-2">
                Name <span class="m-2 ">{{ user ? user.name : null }}</span>
              </p>
              <p class="m-2">
                Email <span class="m-2 ">{{ user ? user.email : null }}</span>
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
