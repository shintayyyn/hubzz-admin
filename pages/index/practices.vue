<template>
  <div class="flex-1 flex flex-col p-2 md:px-6 overflow-auto">
    <div class="px-2 text-2xl md:text-4xl text-white">
      {{ $route.name.includes('practice-compliance-reports') ? 'Practice Compliance Reports' : 'Practices' }}
    </div>
    <div class="flex justify-start my-2">
      <nuxt-link
        v-if="authAdminPermissions.includes('View Practices')
          || authAdminPermissions.includes('View Surgery Management') 
          || authAdminPermissions.includes('View Practice Sessions')
          || authAdminPermissions.includes('View Practice Users')
          || authAdminPermissions.includes('View Practice Documents')
          || authAdminPermissions.includes('View Practice Rates')"
        :to="`/practices`" 
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.name ===`index-practices` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >
        Practices
      </nuxt-link>
      <nuxt-link
        v-if="authAdminPermissions.includes('View Reports')"
        :to="`/practices/practice-compliance-reports`"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.name.includes(`practice-compliance-reports`)? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >
        Practice Compliance Reports
      </nuxt-link>
    </div>
    <nuxt-link
      v-if="$route.name.includes(`index-practices-id`)"
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
