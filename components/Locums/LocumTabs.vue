<template>
	<div class="flex flex-row flex-wrap justify-start">
		<nuxt-link
			:to="getRoute()"
			class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg transition-hover"
			:class="$route.path == `/locums/${user.id}` ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
		>Profile</nuxt-link>
		<nuxt-link
			v-if="authAdminPermissions.includes('View Locum Jobs')"
			:to="getRoute('locum-jobs')"
			class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg transition-hover"
			:class="$route.path.includes(`/locums/${user.id}/locum-jobs`) ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
		>Jobs</nuxt-link>
		<nuxt-link
      v-if="user.status !== 'Deactivated' && authAdminPermissions.includes('View Locum Compliance Detail')"
			:to="getRoute('locum-compliance')"
			class="px-4 py-3 mr-2 text-sm font-bold cursor-pointer rounded-lg transition-hover"
			:class="$route.path === `/locums/${user.id}/locum-compliance` ? 'bg-sunglow hover:bg-sunglow-dark' : 'hover:bg-waterloo text-white'"
		>Compliance</nuxt-link>
	</div>
</template>
<script>
export default {
	props: ["user"],
	computed: {
		authAdminPermissions() {
			return this.$store.getters["permissions"];
		},
		getRoute() {
			return tab => {
				if (!tab) {
					tab = "";
				}
				const query = {
					...this.$route.query
				};

				delete query.order_by;
				return {
					path: tab
						? `/locums/${this.user.id}/${tab}`
						: `/locums/${this.user.id}`,
					query
				};
			};
		}
	}
};
</script>