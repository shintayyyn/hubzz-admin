<template>
	<div>
		<transition name="fade" mode="out-in">
			<AdminRoles />
		</transition>
	</div>
</template>
<script>
import AdminRoles from "@/components/UserManagement/AdminRoles";
export default {
	components: {
		AdminRoles
	},
	data() {
		return {};
	},
	async asyncData({ app, route, store }) {
		try {
		} catch (err) {}
	},
	methods: {}
};
</script>
<style>
</style>