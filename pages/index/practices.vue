<template>
  <div class="flex-1 flex-col px-2">
    <div class="flex flex-row justify-start overflow-x-auto border-b border-yellow-500 mb-4 pt-1">
      <nuxt-link
        v-if="authAdminPermissions.includes('View Practices')
          || authAdminPermissions.includes('View Surgery Management') 
          || authAdminPermissions.includes('View Practice Sessions')
          || authAdminPermissions.includes('View Practice Users')
          || authAdminPermissions.includes('View Practice Documents')
          || authAdminPermissions.includes('View Practice Rates')"
        :to="`/practices`" 
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name ===`index-practices` ? 'border-b-4 border-yellow-500' : 'text-gray-600'"
      >
        Practices
      </nuxt-link>
      <nuxt-link
        v-if="authAdminPermissions.includes('View Reports')"
        :to="`/practices/practice-compliance-reports`"
        class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes(`practice-compliance-reports`)? 'border-b-4 border-yellow-500' : 'text-gray-600'"
      >
        Practice Compliance Reports
      </nuxt-link>
    </div>
    <nuxt-link
      v-if="$route.name.includes(`index-practices-id`) || $route.name.includes(`index-practices-add-practice`)"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/practices"
    />
    <nuxt-child />
  </div>
</template>
<script>
export default {
  computed: {
    authAdminPermissions () {
			return this.$store.getters["permissions"]
    },
  },

  async asyncData ({ store, error }) {
    try {
      const authAdminPermissions = store.getters["permissions"]

      if (authAdminPermissions.includes('View Practices') === false
        && authAdminPermissions.includes('View Surgery Management') === false 
        && authAdminPermissions.includes('View Practice Sessions') === false
        && authAdminPermissions.includes('View Practice Users') === false
        && authAdminPermissions.includes('View Practice Documents') === false
        && authAdminPermissions.includes('View Practice Rates') === false
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
      && this.authAdminPermissions.includes('View Practices') === false
    ) {
      this.$router.push(`/practices/practice-compliance-reports`)
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
