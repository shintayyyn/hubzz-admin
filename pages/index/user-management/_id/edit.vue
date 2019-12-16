<template>
	<div
		class="text-white bg-waterloo my-2 p-4 shadow rounded-lg text-sm max-w-lg"
	>
		<AppInput
			v-model="form.email"
			:type="'email'"
			:name="'email'"
			:label="'Email'"
			:error="formError.find(item => item.field === 'email')"
			@blur="CheckEmptyField(form.email, 'email')"
		/>
		<AppInput
			v-model="form.title"
			:type="'text'"
			:name="'title'"
			:label="'Title'"
		/>
		<AppInput
			v-model="form.first_name"
			:type="'text'"
			:name="'first_name'"
			:label="'First Name'"
			:error="formError.find(item => item.field === 'first_name')"
			@blur="CheckEmptyField(form.first_name, 'first_name')"
		/>
		<AppInput
			v-model="form.last_name"
			:type="'text'"
			:name="'last_name'"
			:label="'Last Name'"
			:error="formError.find(item => item.field === 'last_name')"
			@blur="CheckEmptyField(form.last_name, 'last_name')"
		/>
		<AppInput
			v-model="form.suffix"
			:type="'text'"
			:name="'suffix'"
			:label="'Suffix'"
		/>

		<AppFilterSearch
			v-model="form.roles_id"
			:name="'roles_id'"
			:label="'Admin Role/s'"
			:placeholder="'Select...'"
			:error="formError.find(item => item.field === 'roles_id')"
			:items="adminRoles"
			@add="CheckEmptyField(form.roles_id, 'roles_id')"
			@remove="CheckEmptyField(form.roles_id, 'roles_id')"
		/>

		<AppButton :label="'Save Changes'" @click="updateForm(user.id, form)" />
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
	props: ["user", "adminRoles"],
	data() {
		return {
			form: {
				email: "",
				title: "",
				first_name: "",
				last_name: "",
				suffix: "",
				roles_id: []
			},
			formError: []
		};
	},
	created() {
		this.form.email = this.user.email;
		this.form.title = this.user.personal_detail.title;
		this.form.first_name = this.user.personal_detail.first_name;
		this.form.last_name = this.user.personal_detail.last_name;
		this.form.suffix = this.user.personal_detail.suffix;
		this.user.admin_detail.roles.forEach(item => {
			this.form.roles_id.push({
				id: item.id,
				label: item.name
			});
		});
	},
	methods: {
		getAdminUsers() {
			this.$store.dispatch("adminusers/fetchAdminUsers", {
				limit: 8
			});
		},
		updateForm(user_id, form) {
			this.formError = [];
			this.Validate(this.form, ["title", "suffix"]);
			if (!this.formError.length) {
				form.roles_id = form.roles_id.map(item => item.value);
				this.$axios
					.$put(`/api/v1/admin/admin-users/${user_id}`, form)
					.then(() => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: "Edit Admin User Success!"
						});
					})
					.catch(err => {
						console.log("edit admin user error!", err);
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "danger",
							text: err.response.data.message
						});
					});
				this.getAdminUsers();
			}
		}
	}
};
</script>
