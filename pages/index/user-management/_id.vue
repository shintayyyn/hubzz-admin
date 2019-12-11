<template>
	<div class="admin-user-modal p-4 md:p-8 shadow-lg text-white flex flex-col">
		<div @click="goBack()" class="cursor-pointer">
			<svgicon
				name="arrow-left-solid"
				height="32"
				widht="32"
				class="text-white hover:text-sunglow fill-current"
			/>
		</div>
		<div class="my-4">
			<nuxt-link
				:to="`/user-management/${$route.params.id}`"
				class="rounded-lg font-bold"
				:class="
					$route.path == `/user-management/${$route.params.id}`
						? 'bg-sunglow hover:bg-sunglow-dark px-4 py-2'
						: 'px-4 py-2 text-white hover:bg-waterloo'
				"
				>User Info</nuxt-link
			>
			<nuxt-link
				v-if="authAdminPermissions.includes('Edit Admin Account')"
				:to="`/user-management/${$route.params.id}/edit`"
				class="rounded-lg font-bold"
				:class="
					$route.path == `/user-management/${$route.params.id}/edit`
						? 'bg-sunglow hover:bg-sunglow-dark px-4 py-2'
						: 'px-4 py-2 text-white hover:bg-waterloo'
				"
				>Edit Info</nuxt-link
			>
			<nuxt-link
				v-if="authAdminPermissions.includes('Edit Admin Account')"
				:to="`/user-management/${$route.params.id}/change-password`"
				class="rounded-lg font-bold"
				:class="
					$route.path == `/user-management/${$route.params.id}/change-password`
						? 'bg-sunglow hover:bg-sunglow-dark px-4 py-2'
						: 'px-4 py-2 text-white hover:bg-waterloo'
				"
				>Change Password</nuxt-link
			>
		</div>
		<nuxt-child :user="user" :adminRoles="adminRoles" />
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
			user: "",
			adminRoles: []
		};
	},

	async asyncData({ app, store, route }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/admin-users/${route.params.id}`
			);
			const user = response.data.user;
			// response = await app.$axios.$get(`/api/v1/admin/admin-roles`)
			// const adminRoles = response.data.roles
			return {
				user
			};
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			});
			console.log("get admin user error!!!", err);
		}
	},
	async created() {
		await this.$axios.$get(`/api/v1/admin/admin-roles`).then(res => {
			res.data.roles.forEach(item => {
				this.adminRoles.push({ value: item.id, label: item.name });
			});
			let default_role = res.data.roles.find((item, index) => index === 0);
		});
	},
	computed: {
		authAdminPermissions() {
			return this.$store.getters["auth/permissions"];
		}
	},
	methods: {
		getAdminUsers() {
			// this.$store.dispatch("adminusers/fetchAdminUsers", {});
			this.$store.dispatch("adminusers/fetchAdminUsers", {
				limit: 8
			});
		},
		goBack() {
			const query = {
				...this.$route.query
			};
			this.$router.push({ path: "/user-management", query });
		},
		processForm(userInfo) {
			if (!userInfo.first_name) {
				this.formError.fnameError = "Please Input your First Name";
			}
			if (!userInfo.last_name) {
				this.formError.lnameError = "Please input your Last Name";
			}
		},
		processEmail(inputEmail) {
			this.formError = {
				emailError: ""
			};
			if (!inputEmail) {
				this.formError.emailError = "Required";
			} else if (!this.validEmail(inputEmail)) {
				this.formError.emailError = "Please input a Valid E-Mail Address";
			}
		},

		errorMessage(field, message) {
			if (this.formError.find(error => error.field === field.toString())) {
				let error = this.formError.find(
					error => error.field === field.toString()
				);
				return message ? message : error.message;
			}
			return;
		},

		checkForm(uID, userInfo) {
			this.formError = [];
			this.Validate(this.toPutAdminUser, [
				"title",
				"suffix",
				"password",
				"password_confirmation"
			]);

			if (!this.formError.length) {
				this.toPutAdminUserInfo(uID, userInfo);
			}
		},

		validEmail(email) {
			var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		},

		changePassword(old_password, new_password, password_confirmation) {
			let form = { old_password, new_password, password_confirmation };
			this.formError = [];
			this.Validate(form);

			console.log(this.user);

			return;
			if (!this.formError) {
				this.$axios
					.$put(`/api/v1/admin/admin-users/${user_id}`, form)
					.then(res => {});
			}
			// /api/v1/admin/users/{user_id}/change-password
		},

		async toPutAdminUserInfo(user_id, toPutUserInfo) {
			console.log("to admin user", toPutUserInfo);
			toPutUserInfo.roles_id = toPutUserInfo.roles_id.map(item => item.value);
			await this.$axios
				.$put(`/api/v1/admin/admin-users/${user_id}`, toPutUserInfo)
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
			await this.getAdminUsers();
			this.$router.push("/user-management");
		}
	}
};
</script>
<style>
.admin-user-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.admin-user-modal {
	position: fixed;
	top: 0;
	right: 0;
	margin-right: 0%;
	width: 100%;
	height: 100%;
	overflow: auto;
	border-left: solid 2px yellow;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 1200px) {
	.admin-user-modal {
		width: 80%;
	}
}
</style>
