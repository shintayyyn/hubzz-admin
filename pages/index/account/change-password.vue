<template>
	<div
		class="relative w-full flex text-sm max-w-lg bg-waterloo my-2 py-2 px-3 shadow rounded-lg transition-hover"
	>
		<AppLoading :loading="loading" class="rounded-lg" />
		<div class="w-full overflow-hidden text-gray-300 text-sm p-2">
			<AppInput
				v-model="form.old_password"
				:type="'password'"
				:label="'Current Password'"
				:error="formError.find(item => item.field === 'old_password')"
				@blur="CheckEmptyField(form.old_password, 'old_password')"
				required
			/>
			<AppInput
				v-model="form.new_password"
				:type="'password'"
				:label="'New Password'"
				:error="formError.find(item => item.field === 'new_password')"
				@blur="CheckEmptyField(form.new_password, 'new_password')"
				required
			/>
			<AppInput
				v-model="form.new_password_confirmation"
				:type="'password'"
				:label="'Confirm New Password'"
				:error="
					formError.find(item => item.field === 'new_password_confirmation')
				"
				@blur="
					CheckEmptyField(
						form.new_password_confirmation,
						'new_password_confirmation'
					)
				"
				required
			/>
			<AppButton :label="'Save Changes'" @click="updatePassword(form)" />
		</div>
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
export default {
	components: {
		AppInput,
		AppButton,
		AppLoading
	},
	data() {
		return {
			form: {
				old_password: "",
				new_password: "",
				new_password_confirmation: ""
			},
			formError: [],
			loading: false
		};
	},
	methods: {
		updatePassword(form) {
			this.formError = [];
			this.Validate(this.form);
			this.ValidateSamePassword(
				this.form.new_password,
				this.form.new_password_confirmation
			);
			if (!this.formError.length) {
				try {
					this.$axios
						.put(`/api/v1/me/change-password`, form)
						.then(res => {
							this.loading = true;
							this.form.old_password = "";
							this.form.new_password = "";
							this.form.new_password_confirmation = "";
							setTimeout(() => {
								this.loading = false;
								this.$store.commit("SET_NOTIFICATION", {
									enabled: true,
									status: "success",
									text: "Password Succesfully Changed"
								});
							}, 500);
						})
						.catch(err => {
							this.formError = err.response.data.error_messages;
							console.log("error", err.response.data);
						});
				} catch (error) {
					console.log();
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					});
					console.log("change password error", err);
				}
			}
		}
	}
};
</script>
