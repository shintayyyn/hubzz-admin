<template>
  <section class="flex-1 flex-col py-2 px-2">
    <template v-if="$route.name === 'index-locums'">
      <div class="flex flex-row justify-start overflow-x-auto border-b border-yellow-500 mb-4 pt-1">
        <nuxt-link
          v-if="authAdminPermissions.includes('View Locums')"
          :to="`/locums`" 
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name ===`index-locums` ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          Locums
        </nuxt-link>
        <nuxt-link
          v-if="authAdminPermissions.includes('View Reports')"
          :to="`/locums/compliance-reports`"
          class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
          :class="$route.name.includes(`compliance-reports`)? 'border-b-4 border-yellow-500' : 'text-gray-600'"
        >
          Compliance Reports
        </nuxt-link>
      </div>
    </template>
    
    <nuxt-child />
  </section>
</template>

<script>
	export default {
  computed : {
    authAdminPermissions () {
			return this.$store.getters["permissions"]
    },
  },
  async asyncData ({ store, error }) {
    try {
      const authAdminPermissions = store.getters["permissions"]

      if (authAdminPermissions.includes('View Locums') === false 
        && authAdminPermissions.includes('View Locum Jobs') === false
        && authAdminPermissions.includes('View Locum Compliance Detail') === false
        && authAdminPermissions.includes('View Reports') === false) {
        error({
          statusCode: 403,
          message: 'You are not authorized to view this page.',
        })
        return
      }

    } catch(err) {
      error({ statusCode: 404 })
      store.commit("SET_NOTIFICATION", {
        enabled: true,
        status: "danger",
        text: "Something went wrong!"
      })
      console.log("get parent practice error!!", err)
    }
  },
  created () {
    if (this.authAdminPermissions.includes('View Reports')
      && this.authAdminPermissions.includes('View Locums') === false
    ) {
      this.$router.push(`/locums/compliance-reports`)
    }
  },
}
</script>

<style>
	.page-button {
		background: linear-gradient(to top, #f2d024, #efde86);
	}

	.page-button-disabled {
		background: linear-gradient(to top, #6b717e, #6b7386);
		cursor: not-allowed;
	}

	.page-button:active {
		transform: translate(2px, 2px);
	}
</style>
