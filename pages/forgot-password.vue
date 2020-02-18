<template>
	<div class="px-4 md:px-8">
		<div class="py-4">
			<svgicon
				@click="$router.go(-1)"
				name="arrow-left-solid"
				height="32"
				widht="32"
				class="text-white hover:text-sunglow fill-current cursor-pointer"
			/>
		</div>
		<div class="lg:mx-auto w-full xl:w-2/3">
			<template v-if="!sendRequest">
				<div class="text-white mt-8">
					Check your email inbox for further instructions
					<strong>should your email address match our records.</strong>
				</div>
			</template>
			<template v-if="sendRequest">
				<div class="px-2 text-xl md:text-2xl text-white mb-4">Forgot Password</div>
				<div
					class="flex flex-col items-start p-4 md:px-10 md:py-6 rounded-lg shadow-lg"
					style="background-color: #55565A;"
				>
					<p
						class="text-white mb-2"
					>Please enter the email address of your account at Hubzz. If your email address matches our records, you'll receive an email with further instruction to proceed.</p>
					<AppInput
						v-model="form.email"
						:label="'Email Address'"
						:type="'email'"
						:class="'text-white w-full'"
						:error="formError.find(item => item.field === 'email')"
						@submit="sendEmail"
					/>
					<AppButton :label="'Send'" @click="sendEmail" />
				</div>
			</template>
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
	data() {
		return {
			form: {
				email: ""
			},
			sendRequest: true,
			formError: []
		};
	},
	methods: {
		sendEmail() {
			this.Validate(this.form);

			if (!this.formError.length) {
				this.$axios
					.post(`/api/v1/forgot-password`, this.form)
					.then(res => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: res.data.message
						});
						this.sendRequest = false;
					})
					.catch(err => {
						if (
							err &&
							err.response &&
							err.response.data &&
							err.response.data.error_messages
						) {
							err.response.data.error_messages.forEach(error => {
								if (error.message === "Invalid Email") {
									error.message = "Email Address does not match our record";
								}
								this.formError.push(error);
							});
						}
					});
			}
		}
	}
};
</script>