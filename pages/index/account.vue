<template>
	<div class="flex-1 flex flex-col py-2 px-4 md:px-6 overflow-y-auto">
		<div class="text-xl md:text-4xl text-white">Account</div>
		<div class="flex flex-col rounded-lg">
			<div class="w-full overflow-hidden">
				<div class="flex flex-wrap -mx-1 overflow-hidden">
					<div class="my-1 px-1 overflow-hidden">
						<button
							class="rounded-lg py-3 px-4 text-black text-sm transition-hover"
							:class="
								tab1 === true ? 'bg-sunglow hover:bg-yellow-500' : 'text-white'
							"
							@click="(tab1 = true), (tab2 = false), (formError = [])"
						>
							<strong>General</strong>
						</button>
					</div>
					<div class="my-1 px-1 overflow-hidden">
						<button
							class="rounded-lg py-3 px-4 text-black text-sm transition-hover"
							:class="
								tab2 === true ? 'bg-sunglow hover:bg-yellow-500' : 'text-white'
							"
							@click="(tab2 = true), (tab1 = false)"
						>
							<strong>Change Password</strong>
						</button>
					</div>
				</div>
			</div>
		</div>
		<div class="flex ">
			<div
				class="w-full p-4 my-2 text-white max-w-lg bg-waterloo rounded-lg transition-hover"
				v-if="tab1"
			>
				<div class="font-semibold">Name</div>
				<div class="text-sm mx-2 pb-2">{{ user.personal_detail.name }}</div>

				<div class="font-semibold">E-Mail Address</div>
				<div class="text-sm mx-2 pb-2">{{ user.email }}</div>

				<!-- <div class="font-semibold">Role</div>
                    <div class="text-sm mx-2 pb-2">{{user.admin_detail.role.name}}</div>
                    
                    <div class="font-semibold">Permissions</div>
                    <div class="flex flex-col md:flex-row text-sm">
                        <div class="w-full md:w-1/3 px-2">
                            <p class="font-bold">Practice Management</p>
                            <div v-for="item in user.admin_detail.role.permissions.filter(item => item.category === 'Practice')" :key="item.id" class="px-2">
                                <span>{{item.name}}</span>
                            </div>
                        </div>
                        <div class="w-full md:w-1/3 pt-2 md:pt-0 px-2">
                            <p class="font-bold">Misc Management</p>
                            <div v-for="item in user.admin_detail.role.permissions.filter(item => item.category === 'Misc')" :key="item.id" class="px-2">
                                <span>{{item.name}}</span>
                            </div>
                        </div>
                        <div class="w-full md:w-1/3 pt-2 md:pt-0 px-2">
                            <p class="font-bold">User Management</p>
                            <div v-for="item in user.admin_detail.role.permissions.filter(item => item.category === 'User Management')" :key="item.id" class="px-2">
                                <span>{{item.name}}</span>
                            </div>
                        </div>
                    </div> -->
			</div>
			<div
				v-if="tab2"
				class="w-full flex text-sm max-w-lg bg-waterloo-dark my-2 py-2 px-3 shadow rounded-lg transition-hover"
			>
				<div class="w-full overflow-hidden text-gray-300 text-sm p-2">
					<AppInput
						v-model="toChangePassword.password"
						:type="'password'"
						:label="'New Password'"
						:error="formError.find(item => item.field === 'password')"
						@blur="CheckEmptyField(toChangePassword.password, 'password')"
					/>
					<AppInput
						v-model="toChangePassword.password_confirmation"
						:type="'password'"
						:label="'Confirm New Password'"
						:error="
							formError.find(item => item.field === 'password_confirmation')
						"
						@blur="
							CheckEmptyField(
								toChangePassword.password_confirmation,
								'password_confirmation'
							)
						"
					/>
					<button
						class="inline-flex no-underline py-2 px-4 my-2 bg-sunglow text-sm text-black rounded-lg shadow float-left"
						@click.prevent="checkPasswordInfo(user.id, toChangePassword)"
					>
						Save Changes
					</button>
				</div>
			</div>
		</div>
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
export default {
	components: {
		AppInput
	},
	data() {
		return {
			user: "",
			tab1: true,
			tab2: false,
			errors: [],
			errorPass: [],
			toChangePassword: {
				password: "",
				password_confirmation: ""
			},
			formError: []
		};
	},
	async asyncData({ app, route }) {
		try {
			let response = await app.$axios.$get(`/api/v1/admin/me`);
			const user = response.data.user;
			console.log(user);
			return {
				user
			};
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			});
			console.log("get user error", err);
		}
	},
	watch: {
		"toChangePassword.password"(value) {
			if (value && value.length < 6) {
				this.formError.push({
					field: "password",
					message: "Password Must Be Atleast 6 Characters"
				});
			} else {
				let index = this.formError.findIndex(
					item => item.message === "Password Must Be Atleast 6 Characters"
				);
				let error = this.formError.filter(
					item => item.message === "Password Must Be Atleast 6 Characters"
				);
				if (index >= 0) {
					this.formError.splice(index, error.length);
				}
			}
		},
		"toChangePassword.password_confirmation"(value) {
			const error = this.ValidateSamePassword(
				this.toChangePassword.password,
				value
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
	methods: {
		errorMessage(field, message) {
			if (this.formError.find(error => error.field === field.toString())) {
				let error = this.formError.find(
					error => error.field === field.toString()
				);
				return message ? message : error.message;
			}
			return;
		},
		checkPasswordInfo: function(uID, changePass) {
			this.formError = [];

			this.Validate(this.toChangePassword);

			// if (!changePass.newPassword) {
			// 	changePass.newPassword = "";
			// 	this.errorPass.push("Please type your new password.");
			// }
			// if (!changePass.password_confirmation) {
			// 	changePass.password_confirmation = "";
			// 	this.errorPass.push("Please type again your new password.");
			// }
			// if (changePass.password_confirmation !== changePass.newPassword) {
			// 	this.errorPass.push("Please ensure that inputted passwords match.");
			// }
			// if (
			// 	changePass.newPassword.length < 6 ||
			// 	changePass.password_confirmation < 6
			// ) {
			// 	this.errorPass.push("Password must be at least 6 characters");
			// }
			if (!this.formError.length) {
				this.toChangeUserPassword(uID, changePass);
			}
		},
		async toChangeUserPassword(userID, toChangePassword) {
			try {
				await this.$axios.put(`/api/v1/admin/users/${userID}/change-password`, {
					password: toChangePassword.password,
					password_confirmation: toChangePassword.password_confirmation
				});
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "alert",
					text: "Password Succesfully Changed"
				});
			} catch (err) {
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "danger",
					text: err.response.data.message
				});
				console.log("change password error", err);
			}
		}
	}
};
</script>
<style></style>
