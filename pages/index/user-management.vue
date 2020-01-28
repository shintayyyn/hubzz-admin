<template>
	<div class="flex-1 flex flex-col overflow-auto">
		<div>
			<UserManagementTabs />
		</div>
		<div
			class="admin-shield"
			v-if="$route.name.includes('index-user-management-id') || $route.name.includes('roleId')"
			@click="$router.go(-1)"
		/>
		<nuxt-child />
	</div>
</template>
<script>
import UserManagementTabs from "@/components/UserManagement/UserManagementTabs";
export default {
	components: {
		UserManagementTabs
	}
};
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