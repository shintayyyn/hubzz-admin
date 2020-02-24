<template>
	<transition name="slide" mode="out-in">
		<div class="role-modal shadow-lg">
			<CreateAdminRole @close="$router.push('/user-management/roles-and-permissions')" />
		</div>
	</transition>
</template>
<script>
import CreateAdminRole from "@/components/UserManagement/CreateAdminRole";
export default {
	components: {
		CreateAdminRole
	}
};
</script>