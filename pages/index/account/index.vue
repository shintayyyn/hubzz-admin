<template>
	<div
		class="w-full p-4 my-2 max-w-lg border rounded-lg transition-hover"
	>
		<div class="font-semibold">Name</div>
		<div class="text-sm mx-2 pb-2">{{ user.personal_detail.name }}</div>

		<div class="font-semibold">E-Mail Address</div>
		<div class="text-sm mx-2 pb-2">{{ user.email }}</div>
		<div class="font-semibold">Roles</div>
		<div 
			v-for="role in user.admin_detail.roles" 
			:key="`role-${role.id}`"
			class="inline-flex m-1 rounded-lg text-sm text-black p-2 bg-sunglow">
			{{ role.name }}
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			user: ""
		};
	},
	async asyncData({ app, route }) {
		try {
			let response = await app.$axios.$get(`/api/v1/admin/me`);
			const user = response.data.user;
			return {
				user
			};
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			});
			console.log("get user error", err);
		}
	}
};
</script>
