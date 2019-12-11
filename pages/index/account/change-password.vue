<template>
	<div
		class="w-full flex text-sm max-w-lg bg-waterloo my-2 py-2 px-3 shadow rounded-lg transition-hover"
	>
		<div class="w-full overflow-hidden text-gray-300 text-sm p-2">
			<AppInput
				v-model="form.old_password"
				:type="'password'"
				:label="'Current Password'"
				:error="formError.find(item => item.field === 'old_password')"
				@blur="CheckEmptyField(form.old_password, 'old_password')"
			/>
			<AppInput
				v-model="form.new_password"
				:type="'password'"
				:label="'New Password'"
				:error="formError.find(item => item.field === 'new_password')"
				@blur="CheckEmptyField(form.new_password, 'new_password')"
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
			/>
			<AppButton :label="'Save Changes'" @click="updatePassword(form)" />
		</div>
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
export default {
	components: {
		AppInput,
		AppButton
	},
	data() {
		return {
			form: {
				old_password: "",
				new_password: "",
				new_password_confirmation: ""
			},
			formError: []
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
							this.$store.commit("SET_NOTIFICATION", {
								enabled: true,
								status: "success",
								text: "Password Succesfully Changed"
							});
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
