<template>
	<div class="flex flex-col">
		<div class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 mb-4 pt-1">
			<nuxt-link
				:to="`/user-management/${$route.params.id}`"
				class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
				:class="
					$route.path == `/user-management/${$route.params.id}`
						? 'border-b-4 border-gray-500' : 'text-gray-600'
				"
				>User Info</nuxt-link
			>
			<nuxt-link
				v-if="authAdminPermissions.includes('Edit Admin Account')"
				:to="`/user-management/${$route.params.id}/edit`"
				class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
				:class="
					$route.path == `/user-management/${$route.params.id}/edit`
						? 'border-b-4 border-gray-500' : 'text-gray-600'
				"
				>Edit Info</nuxt-link
			>
			<nuxt-link
				v-if="authAdminPermissions.includes('Edit Admin Account')"
				:to="`/user-management/${$route.params.id}/change-password`"
				class="md:mr-5 px-3 py-2 text-sm font-bold cursor-pointer whitespace-no-wrap"
				:class="
					$route.path == `/user-management/${$route.params.id}/change-password`
						? 'border-b-4 border-gray-500' : 'text-gray-600'
				"
				>Change Password</nuxt-link
			>
		</div>
		<nuxt-child :adminRoles="adminRoles" />
	</div>
</template>
<script>
export default {
	components: {
	},
	data() {
		return {
			user: "",
			adminRoles: []
		};
	},

	async created() {
		await this.$axios.$get(`/api/v1/admin/admin-roles`).then(res => {
			res.data.roles.forEach(item => {
				this.adminRoles.push({ value: item.id, label: item.name });
			});
			let default_role = res.data.roles.find((item, index) => index === 0);
		});
	},
	computed: {
		authAdminPermissions() {
			return this.$store.getters["permissions"];
		}
	},
	methods: {
		goBack() {
			const query = {
				...this.$route.query
			};
			this.$router.push({ path: "/user-management", query });
		},

	}
};
</script>
<style>
.admin-user-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.admin-user-modal {
	position: fixed;
	top: 0;
	right: 0;
	margin-right: 0%;
	width: 100%;
	height: 100%;
	overflow: auto;
	border-left: solid 2px #FFC72C;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 1200px) {
	.admin-user-modal {
		width: 80%;
	}
}
</style>
