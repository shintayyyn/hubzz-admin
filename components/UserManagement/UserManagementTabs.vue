<template>
	<div class="flex justify-start overflow-x-auto px-4">
		<nuxt-link
			:to="getRoute()"
			class="p-3 mx-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
			:class="
				$route.path == `/user-management`
					? 'bg-sunglow hover:bg-sunglow-dark text-black'
					: 'text-white'
			"
			>Users</nuxt-link
		>
		<nuxt-link
			:to="getRoute('roles-and-permissions')"
			class="p-3 mx-2 text-sm font-bold cursor-pointer rounded-lg whitespace-no-wrap transition-hover"
			:class="
				$route.path.includes(`/user-management/roles-and-permissions`)
					? 'bg-sunglow hover:bg-sunglow-dark text-black'
					: 'text-white'
			"
			>Roles and Permissions</nuxt-link
		>
	</div>
</template>
<script>
export default {
	// props:['practice'],

	computed: {
		getRoute() {
			return tab => {
				if (!tab) {
					tab = "";
				}
				const query = {
					...this.$route.query
				};
				// delete query.order_by
				// delete query.status
				return {
					path: tab ? `/user-management/${tab}` : `/user-management`,
					query
				};
			};
		}
	}
};
</script>
