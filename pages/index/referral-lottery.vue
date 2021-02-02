<template>
  <div class="flex-1 flex flex-col py-2 px-2 mx-2 md:px-6 overflow-x-hidden">
    <div class="flex justify-start my-2">
      <div class="relative">
        <nuxt-link
          to="/referral-lottery?status=entries"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'entries')? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-white'"
        >
          Prize Draw Entries
        </nuxt-link>
      </div>
      <div class="relative">
        <nuxt-link
          to="/referral-lottery?status=winners"
          class="md:mr-5 p-3 text-sm font-bold cursor-pointer"
          :class="$route.query && $route.query.status && $route.query.status.toLowerCase() === 'winners' ? 'border rounded-lg border-yellow-500 bg-yellow-500' : 'text-white'"
        >
          Prize Draw Winners
        </nuxt-link>
      </div>
    </div>

    <nuxt-child />
  </div>
</template>
<script>
export default {
  async asyncData ({ store, error }) {
    const authAdminPermissions = store.getters["permissions"]

    if (authAdminPermissions.includes('View Referral Lottery') === false) {
      error({
        statusCode: 403,
        message: 'You are not authorized to view this page.',
      })
      return
    }
  }
}
</script>

