<template>
	<div class="flex-1 flex flex-col overflow-auto">
		<div class="flex justify-start px-2 md:px-4">
			<nuxt-link
				v-if="authAdminPermissions.includes('View Admin Accounts')"
				:to="getRoute()"
				class="p-3 mx-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
				:class="
					$route.path == `/user-management`
					? 'bg-sunglow hover:bg-sunglow-dark'  :  
					'hover:bg-waterloo text-white'
				"
			>Users</nuxt-link>

			<nuxt-link
				v-if="authAdminPermissions.includes('View Roles')"
				:to="getRoute('roles-and-permissions')"
				class="p-3 mx-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
				:class="
					$route.path.includes(`/user-management/roles-and-permissions`)
					? 'bg-sunglow hover:bg-sunglow-dark'  :  
					'hover:bg-waterloo text-white'
				"
			>Roles and Permissions</nuxt-link>
		</div>
		<div
			class="admin-shield"
			v-if="$route.name.includes('index-user-management-id') || $route.name.includes('roleId') || $route.name.includes('create')"
			@click="$router.go(-1)"
		/>
		<nuxt-child />
	</div>
</template>
<script>
export default {
	data () {
		return {
			userManagementPermissions: [],
		}
	},

	computed: {
    authAdminPermissions () {
      return this.$store.getters["permissions"]
		},
		getRoute () {
			return tab => {
				if (!tab) {
					tab = "";
				}
				const query = {
					...this.$route.query
				};
				delete query.page;
				// delete query.status
				return {
					path: tab ? `/user-management/${tab}` : `/user-management`,
					query
				};
			};
		}
  },

	async asyncData ({ store, error }) {
		try {
			const authAdminPermissions = store.getters["permissions"]

			if (authAdminPermissions.includes('View Roles') === false 
				&& authAdminPermissions.includes('View Admin Accounts') === false) {
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
		}
	},

	created () {
		if (this.authAdminPermissions.find(item => item === 'View Admin Accounts') === undefined){
			this.$router.push(`/user-management/roles-and-permissions`)
		}
	},

}
</script>
<style>
.admin-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
</style>