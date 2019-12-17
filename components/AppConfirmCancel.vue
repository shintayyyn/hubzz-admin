<template>
	<div class="confirmcancel fixed top-0 mx-4 w-4/5 flex justify-center">
		<div
			class="confirmcancel-modal border-solid rounded-b-lg bg-yellow-500 px-6 py-2"
		>
			<div class="flex justify-center py-2">
				<div class>Are you sure you want to delete this Admin Account?</div>
			</div>
			<div class="flex justify-center mb-2">
				<button
					class="border border-solid bg-yellow-500 hover:text-white focus:outline-none text-black font-bold py-2 px-4 mx-2 rounded-lg"
          @click="performAction()"

				>
        	<!-- @click.prevent="$emit('confirm')" -->
				  Confirm
				</button>
				<!-- @click="performAction()" -->
				<button
					class="border border-solid bg-yellow-500 hover:text-white focus:outline-none text-black font-bold py-2 px-4 mx-2 rounded-lg"
					@click.prevent="$emit('close')"
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: ["adminAccountId"],
	created() {
		console.log("account id", this.adminAccountId);
	},
	methods: {
    getAdminUsers() {
      this.$store.dispatch("adminusers/fetchAdminUsersCount", {});
      this.$store.dispatch("adminusers/fetchAdminUsers", {
        limit: 10
      });
      this.$store.commit("adminusers/ADD_ADMIN_USER", this.toPostUser);
    },
		async performAction() {
      console.log('it works')
			if (this.adminAccountId) {
				await this.$axios
					.$delete(`/api/v1/admin/admin-users/${this.adminAccountId}`)
					.then(res => {
            console.log(res)
            this.$store.getters["adminusers/getAdminUsers"];
            // this.getAdminUsers()
						this.$emit("close");
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: "Admin Account Successfully Deleted"
						});
					})
					.catch(err => {
						console.log("delete error", err);
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "danger",
							text: err.response.data.message
						});
					});
			}
		}
	}
};
</script>
<style scoped>
.confirmcancel {
	z-index: 600;
}
.confirmcancel-modal {
	width: 100%;
	/* margin: 0 20px; */
}
@media screen and (min-width: 991px) {
	.confirmcancel-modal {
		width: auto;
	}
}
button:active {
	transform: translate(2px, 2px);
}
</style>
