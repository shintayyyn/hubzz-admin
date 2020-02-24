<template>
	<div class="role-modal shadow-lg" ref="modalContainer">
		<div class="modal-container max-w-2xl text-white">
			<div class="p-4 md:p-8">
				<svgicon
					name="arrow-left-solid"
					height="32"
					width="32"
					class="cursor-pointer text-white hover:text-sunglow fill-current"
					@click="$emit('close')"
				/>
				<div class="flex flex-col mt-4">
					<AppInput
						v-model="form.name"
						:type="'text'"
						:name="'name'"
						:label="'Role Name'"
						:error="formError.find(item => item.field === 'name')"
						required
					/>
					<AppInput
						v-model="form.description"
						:type="'textarea'"
						:name="'description'"
						:label="'Description'"
						:error="formError.find(item => item.field === 'description')"
						:resize="false"
						:rows="3"
						required
					/>

					<p class="text-xs sm:text-sm py-1 pr-2 font-bold">
						Permissions
						<span class="text-red-500">*</span>
						<span
							class="mx-2 bg-red-300 text-red-700 py-1 px-2 text-xs"
							v-if="formError.find(item => item.field === 'permission_id')"
						>{{formError.find(item => item.field === 'permission_id').message}}</span>
					</p>
					<div class="flex flex-wrap justify-start">
						<div
							class="w-full md:w-1/2 lg:w-1/3 pb-3 px-1"
							v-for="(role, index) in permissions"
							:key="index"
						>
							<div class="flex flex-col">
								<div class="w-full flex flex-row items-center">
									<input
										type="checkbox"
										:id="role.category"
										:checked="isChecked(role.permissions)"
										@change="checkAll(index, $event.target.checked)"
									/>
									<label class="font-bold text-xl pl-1" :for="role.category">{{ role.category }} Management</label>
								</div>
								<div
									class="w-full flex flex-row justify-start items-center mb-1"
									v-for="permission in role.permissions"
									:key="permission.id"
								>
									<input
										v-model="permission.done"
										type="checkbox"
										:id="permission.id"
										:checked="permission.done"
									/>
									<label
										:for="permission.id"
										class="text-xs sm:text-sm flex items-center"
									>{{ permission.name }}</label>
								</div>
							</div>
						</div>
					</div>
					<div class="my-4 text-black">
						<AppButton :label="'Create'" @click="create" />
					</div>
				</div>
			</div>
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
			permissions: [],
			form: {
				name: "",
				description: "",
				permission_id: []
			},
			formError: []
		};
	},
	async asyncData({ app, error }) {
		try {
		} catch (err) {
			if (err.response && err.response.status === 401) {
				error(err.response.data);
				return;
			}
			throw err;
		}
	},
	mounted() {
		this.getPermissions();
	},
	watch: {
		"form.permission_id"(value) {
			console.log("value", value);
		}
	},
	methods: {
		async getAdminRoles() {
			this.$store.dispatch("adminusers/fetchAdminRoles", {
				limit: 10
			});
			this.$store.commit("adminusers/ADD_ADMIN_USER", this.form);
		},
		getPermissions() {
			this.$axios.$get(`/api/v1/admin/admin-permissions`).then(res => {
				res.data.permissions.forEach(permission => {
					this.permissions.push({
						...permission,
						label: permission.name,
						done: false
					});
				});
				this.setCategory();
			});
		},
		setCategory() {
			let categories = [];
			this.permissions.forEach(permission => {
				if (categories.length === 0) {
					categories.push({
						category: permission.category,
						permissions: []
					});
				} else {
					let hasSameCategory = categories.find(
						item => item.category === permission.category
					);
					if (!hasSameCategory) {
						categories.push({
							category: permission.category,
							permissions: []
						});
					}
				}
			});
			console.log("asd", categories);
			this.setPermissions(categories);
		},
		setPermissions(categories) {
			this.permissions.forEach(permission => {
				let foundCategory = categories.find(
					item => item.category === permission.category
				);
				foundCategory.permissions.push(permission);
			});
			this.permissions = categories;
		},
		isChecked(permissions) {
			return !permissions.map(item => item.done).includes(false);
		},
		checkAll(index, checked) {
			this.permissions[index].permissions.forEach(item => {
				item.done = checked;
			});
		},
		async create() {
			this.formError = [];
			let ids = [];
			this.permissions.forEach(item => {
				item.permissions.forEach(permission => {
					if (permission.done) {
						ids.push(permission.id);
					}
				});
			});
			console.log("ids", ids);
			this.form.permission_id = ids;
			this.Validate(this.form);
			if (!this.formError.length) {
				this.$axios
					.$post(`/api/v1/admin/admin-roles`, this.form)
					.then(res => {
						this.$emit("addRole", res.data.role),
							this.$router.push(`/user-management/roles-and-permissions`),
							this.$store.commit("SET_NOTIFICATION", {
								enabled: true,
								status: "success",
								text: "Role Created Successfully"
							}),
							// this.getAdminRoles();
							this.$router.push("/user-management/roles-and-permissions");
					})
					.catch(err => {
						console.log(err.response.data.message);
						this.$nextTick(() => {
							this.$refs.modalContainer.scrollTop = 0;
						});
					});
				this.$emit("close");
			} else {
				this.$nextTick(() => {
					this.$refs.modalContainer.scrollTop = 0;
				});
			}
		}
	}
};
</script>
<style scoped>
.modal-container {
	z-index: 510;
}

.role-modal {
	position: fixed;
	top: 0;
	right: 0;
	margin-right: 0%;
	width: 100%;
	height: 100%;
	overflow: auto;
	border-left: solid 2px #ffc72c;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}

@media screen and (min-width: 1200px) {
	.role-modal {
		width: 80%;
	}
}
/* @media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%
  }
} */
</style>
