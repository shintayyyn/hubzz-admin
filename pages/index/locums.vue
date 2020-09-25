<template>
  <div class="flex-1 flex flex-col py-2 px-2 overflow-y-auto">
    <div class="px-2 mx-5 text-xl md:text-4xl text-white">
      {{ $route.name.includes('compliance-reports') ? 'Compliance Reports' : 'Locums' }}
    </div>
    <div class="flex justify-start my-2 mx-6">
      <nuxt-link
        v-if="authAdminPermissions.includes('View Locums')"
        :to="`/locums`" 
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.name ===`index-locums` ? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >
        Locums
      </nuxt-link>
      <nuxt-link
        v-if="authAdminPermissions.includes('View Reports')"
        :to="`/locums/compliance-reports`"
        class="p-3 text-sm font-bold cursor-pointer text-white rounded-lg whitespace-no-wrap mx-1"
        :class="$route.name.includes(`compliance-reports`)? 'bg-waterloo hover:bg-gray-500' : 'hover:bg-waterloo'"
      >
        Compliance Reports
      </nuxt-link>
    </div>
    <nuxt-link
      v-if="$route.name.includes(`index-locums-id`)"
      class="bg-shield z-511 fixed inset-0 opacity-50"
      to="/locums"
    />
    <nuxt-child />
  </div>
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
      const authAdminpermissions = store.getters["permissions"]

      if (authAdminpermissions.includes('View Locums') === false 
        && authAdminpermissions.includes('View Locum Jobs') === false
        && authAdminpermissions.includes('View Locum Compliance Detail') === false) {
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
  }
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
