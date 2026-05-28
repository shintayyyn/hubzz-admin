<template>
  <div class="flex-1 flex-col py-2 px-2">
    <div v-if="!$route.params.id" class="flex flex-row justify-start overflow-x-auto border-b border-yellow-500 mb-4 pt-1">
      <nuxt-link
        to="/referral-lottery?status=entries"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          (!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'entries')) &&
            $route.name !== 'index-referral-lottery-email-template'
            ? 'border-b-4 border-yellow-500'
            : 'text-gray-600'
        "
      >
        Prize Draw Entries
      </nuxt-link>

      <nuxt-link
        to="/referral-lottery?status=winners"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.query && $route.query.status && $route.query.status.toLowerCase() === 'winners' ? 'border-b-4 border-yellow-500' : 'text-gray-600'
        "
      >
        Prize Draw Winners
      </nuxt-link>

      <nuxt-link
        to="/referral-lottery/email-template"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'index-referral-lottery-email-template' ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
      >
        Template
      </nuxt-link>
    </div>

    <nuxt-child />
  </div>
</template>
<script>
export default {
  async asyncData({ store, error }) {
    const authAdminPermissions = store.getters['permissions']

    if (authAdminPermissions.includes('View Referral Lottery') === false) {
      error({
        statusCode: 403,
        message: 'You are not authorized to view this page.'
      })
      return
    }
  }
}
</script>
