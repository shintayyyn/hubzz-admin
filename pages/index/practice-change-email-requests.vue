<template>
  <div class="flex-1 flex flex-col overflow-hidden py-2">
    <div class="px-4 md:px-6">
      <div class="flex justify-start overflow-x-auto">
        <nuxt-link
          to="/locum-change-email-requests"
          style="font-family:Nunito"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="false ? 'border rounded-lg text-black border-sunglow bg-sunglow' : 'text-white'"
        >
          <span>Locum</span>
        </nuxt-link>
        <nuxt-link
          to="/practice-change-email-requests"
          style="font-family:Nunito"
          class="mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="true ? 'border rounded-lg text-black border-sunglow bg-sunglow' : 'text-white'"
        >
          <span>Practice</span>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        loading: false,
        practiceChangeEmailRequests: [],
      }
    },
  }
</script>
