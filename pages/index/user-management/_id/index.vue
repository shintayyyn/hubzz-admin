<template>
	<div class="y-2 p-4 shadow rounded-lg text-sm max-w-lg">
		<p class="font-semibold">E-mail Address</p>
		<p class="mx-1 mb-2">{{ user.email }}</p>
		<p class="font-semibold">Name</p>
		<p class="mx-1 mb-2">{{ user.personal_detail.first_name }} {{ user.personal_detail.last_name }}</p>
		<p class="font-semibold">Role</p>
		<div v-if="user.admin_detail.roles.length > 0">
			<p
				class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-yellow-500"
				v-for="adminRoles in user.admin_detail.roles"
				:key="adminRoles.id + '-name'"
			>
				{{ adminRoles ? adminRoles.name : null }}
			</p>
		</div>
	</div>
</template>
<script>
export default {
	data () {
		return {
			user: '',
		}
	},
  async asyncData ({ app, store, route, error }) {
		try {
			const authAdminPermissions = store.getters["permissions"]
			if (authAdminPermissions.includes('View Admin Accounts') === false) {
				error({
					statusCode: 403,
					message: 'You are not authorized to view this page.',
				})
				return
			}
			let response = await app.$axios.$get(
				`/api/v1/admin/admin-users/${route.params.id}`
			)
			const user = response.data.user
			return {
				user
			}
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			})
		}
	},
}
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
