<template>
  <div class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-x-hidden">
    <div class="flex flex-row justify-start overflow-x-auto py-3">
      <div class="relative">
        <nuxt-link
          to="/referral-lottery?status=entries"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'entries')? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >
          Raffle Entries
        </nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          to="/referral-lottery?status=winners"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.status && $route.query.status.toLowerCase() === 'winners' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-gray-600'"
        >
          Raffle Winners
        </nuxt-link>
      </div>
    </div>
    <nuxt-child />
  </div>
</template>
<script>
import AppButton from "@/components/Base/AppButton"
export default {
    components: {
        AppButton
    },
}
</script>