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
<style>
.modal-container {
	z-index: 510;
}

.role-modal {
	position: fixed;
	top: 0;
	right: 0;
	margin-right: 0%;
	width: 100%;
	height: 100%;
	overflow: auto;
	border-left: solid 2px #ffc72c;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}

@media screen and (min-width: 1200px) {
	.role-modal {
		width: 80%;
	}
}

</style>