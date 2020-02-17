<template>
	<div class="px-4 md:px-8">
		<div class="py-4">
			<svgicon
				@click="$router.push('/sign-in')"
				name="arrow-left-solid"
				height="32"
				widht="32"
				class="text-white hover:text-sunglow fill-current cursor-pointer"
			/>
		</div>
		<div class="mx-auto w-full md:w-2/3 md:mt-8">
			<div class="text-xl md:text-2xl text-white mb-4">Reset Password</div>
			<div class="flex flex-col items-start p-4 md:px-10 md:py-6 rounded-lg shadow-lg text-white">
				<AppInput
					v-model="form.password"
					:type="'password'"
					:name="'password'"
					:label="'New password'"
					:placeholder="''"
					:error="formError.find(item => item.field === 'password')"
					@blur="CheckEmptyField(form.password,'password')"
					:class="'w-full'"
				/>
				<AppInput
					v-model="form.password_confirmation"
					:type="'password'"
					:name="'password_confirmation'"
					:label="'Repeat password to confirm'"
					:placeholder="''"
					:error="formError.find(item => item.field === 'password_confirmation')"
					@blur="CheckEmptyField(form.password_confirmation,'password_confirmation')"
					:class="'w-full'"
					@submit="reset"
				/>
				<AppButton :label="'Change Password'" @click="reset" />
			</div>
		</div>
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
export default {
	layout: "auth",

	components: {
		AppInput,
		AppButton
	},
	async asyncData({ app, params, error }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/forgot-password/${params.token}`
			);
			const forgot_password_token = response.data.forgot_password_token;
			return {
				forgot_password_token
			};
		} catch (err) {
			if (err) {
				return error({
					message: err.response.data.message,
					statusCode: err.response.data.status
				});
			}
			throw err;
		}
	},
	data() {
		return {
			form: {
				password: "",
				password_confirmation: ""
			},
			formError: []
		};
	},
	methods: {
		reset() {
			this.formError = [];
			this.Validate(this.form);
			if (!this.formError.length) {
				this.$axios
					.post(
						`/api/v1/reset-password/${this.forgot_password_token.token}`,
						this.form
					)
					.then(res => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: res.data.message
						});
						this.$router.push("/sign-in");
					})
					.catch(err => {
						if (
							err &&
							err.response &&
							err.response.data &&
							err.response.data.error_messages
						) {
							err.response.data.error_messages.forEach(error => {
								this.formError.push({
									field:
										error.field === "password" &&
										error.validation === "confirmed"
											? "password_confirmation"
											: error.field,
									message: error.message,
									validation: error.validation
								});
							});
						}
					});
			}
		}
	}
};
</script>