<template>
	<div class="admin-user-modal p-4 md:p-8 shadow-lg text-white flex flex-col">
		<div @click="goBack()" class="cursor-pointer">
			<svgicon
				name="arrow-left-solid"
				height="32"
				widht="32"
				class="text-white hover:text-sunglow fill-current"
			/>
		</div>
		<div class="my-4">
			<nuxt-link
				:to="`/user-management/${$route.params.id}`"
				class="rounded-lg font-bold"
				:class="
					$route.path == `/user-management/${$route.params.id}`
						? 'bg-sunglow hover:bg-sunglow-dark px-4 py-2'
						: 'px-4 py-2 text-white hover:bg-waterloo'
				"
				>User Info</nuxt-link
			>
			<nuxt-link
				v-if="authAdminPermissions.includes('Edit Admin Account')"
				:to="`/user-management/${$route.params.id}/edit`"
				class="rounded-lg font-bold"
				:class="
					$route.path == `/user-management/${$route.params.id}/edit`
						? 'bg-sunglow hover:bg-sunglow-dark px-4 py-2'
						: 'px-4 py-2 text-white hover:bg-waterloo'
				"
				>Edit Info</nuxt-link
			>
			<nuxt-link
				v-if="authAdminPermissions.includes('Edit Admin Account')"
				:to="`/user-management/${$route.params.id}/change-password`"
				class="rounded-lg font-bold"
				:class="
					$route.path == `/user-management/${$route.params.id}/change-password`
						? 'bg-sunglow hover:bg-sunglow-dark px-4 py-2'
						: 'px-4 py-2 text-white hover:bg-waterloo'
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
