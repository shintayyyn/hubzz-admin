<template>
	<div
		class="text-white bg-waterloo my-2 p-4 shadow rounded-lg text-sm max-w-lg"
	>
		<AppInput
			v-model="form.new_password"
			:type="'password'"
			:name="'password'"
			:label="'New Password'"
			:error="formError.find(item => item.field === 'password')"
		/>
		<AppInput
			v-model="form.password_confirmation"
			:type="'password'"
			:name="'password_confirmation'"
			:label="'Confirm Password'"
			:error="formError.find(item => item.field === 'password_confirmation')"
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
	props: ["user"],
	data() {
		return {
			form: {
				password: "",
				password_confirmation: ""
			},
			formError: []
		};
  },
  created(){
    console.log('user', this.user)
  },
	methods: {
		async changePassword() {
			await this.$axios.$put(`/api/v1/me/change-password`, {form})
		}
	}
};
</script>
