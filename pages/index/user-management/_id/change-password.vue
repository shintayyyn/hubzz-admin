<template>
	<div class="text-white bg-waterloo my-2 p-4 shadow rounded-lg text-sm max-w-lg">
		<AppInput
			v-model="form.password"
			:type="'password'"
			:name="'password'"
			:label="'New Password'"
			:error="formError.find(item => item.field === 'password')"
			required
		/>
		<AppInput
			v-model="form.password_confirmation"
			:type="'password'"
			:name="'password_confirmation'"
			:label="'Confirm Password'"
			:error="formError.find(item => item.field === 'password_confirmation')"
			required
		/>
		<AppButton :label="'Save Changes'" @click="changePassword()" />
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
export default {
	components: {
		AppInput,
		AppButton,
		AppFilterSearch
	},
	data() {
		return {
			user: '',
			form: {
				password: "",
				password_confirmation: ""
			},
			formError: []
		};
	},
  async asyncData({ app, store, route }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/admin-users/${route.params.id}`
			);
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
		}
	},
	created() {
		if (this.$auth.user.id === this.user.id) {
			this.$router.push(`/account/change-password`);
		}
	},
	watch: {
		"form.password"(value) {
			if (value && value.length < 6) {
				this.formError.push({
					field: "password",
					message: "Password Must Be Atleast 6 Characters"
				});
			} else {
				let index = this.formError.findIndex(item => item.field === "password");
				let error = this.formError.filter(item => item.field === "password");
				console.log(
					"pass",
					index,
					value.length,
					index >= 0 || value.length >= 6
				);
				if (index >= 0 || value.length >= 6) {
					this.formError.splice(index, error.length);
				}
			}
			if (this.form.password_confirmation) {
				const error = this.ValidateSamePassword(
					value,
					this.form.password_confirmation
				);
				if (error) {
					this.formError.push(error);
				} else {
					let index = this.formError.findIndex(
						item => item.field === "password_confirmation"
					);
					let errors = this.formError.filter(
						item => item.field === "password_confirmation"
					);
					if (index >= 0) {
						this.formError.splice(index, errors.length);
					}
				}
			}
		},
		"form.password_confirmation"(value) {
			const error = this.ValidateSamePassword(this.form.password, value);
			if (error) {
				this.formError.push(error);
			} else {
				let index = this.formError.findIndex(
					item => item.field === "password_confirmation"
				);
				let errors = this.formError.filter(
					item => item.field === "password_confirmation"
				);
				if (index >= 0) {
					this.formError.splice(index, errors.length);
				}
			}
		}
	},
	methods: {
		checkForm: function(userInfo, surgID) {
			this.formError = [];
			if (!this.formError.length) {
				this.changePassword();
			}
		},
		async changePassword() {
			await this.$axios
				.$put(`/api/v1/admin/users/${this.user.id}/change-password`, this.form)
				.then(res => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Saved Changes"
					});
				})
				.catch(err => {
					this.formError = err.response.data.error_messages;
					// this.$store.commit('SET_NOTIFICATION', { enabled: true, status: 'danger', text: err.response.data.message })
				});
		}
	}
};
</script>
