<template>
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
				/>
				<AppInput
					v-model="form.description"
					:type="'textarea'"
					:name="'description'"
					:label="'Description'"
					:error="formError.find(item => item.field === 'description')"
					:resize="false"
					:rows="3"
				/>
				<div class="flex flex-wrap justify-start">
					<div
						class="w-full md:w-1/2 lg:w-1/3 pb-3 px-1"
						v-for="(role, index) in permissions"
						:key="index"
					>
						<div class="flex flex-col">
							<div class="customized-select w-full flex flex-row items-center">
								<input
									type="checkbox"
									:id="role.permissions"
									:checked="isChecked(role.permissions)"
									@change="checkAll(index, $event.target.checked)"
								/>
								<label class="font-bold text-xl pl-1" :for="role.permissions"
									>{{ role.category }} Management</label
								>
							</div>
							<div class="flex flex-col px-1">
								<div
									class="customized-select w-full flex flex-row items-center"
									v-for="permission in role.permissions"
									:key="permission.id"
								>
									<input
										v-model="permission.done"
										type="checkbox"
										:id="permission.id"
										:checked="permission.done"
									/>
									<label :for="permission.id" class="text-sm pl-1">{{
										permission.name
									}}</label>
								</div>
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
	// watch: {
	// 	"form.name"(value) {
	// 		if (!value) {
	// 			this.formError.push({
	// 				field: "name",
	// 				message: "Role Name is Required"
	// 			});
	// 		}
	// 	}
	// },
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
					this.permissions.push({ ...permission, done: false });
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
		validate() {
			if (!this.form.name) {
				this.formError.push({
					field: "name",
					message: "Role Name is Required"
				});
			}
			if (!this.form.description) {
				this.formError.push({
					field: "description",
					message: "Role Description is Required"
				});
			}
		},
		async create() {
			this.formError = [];
			// this.validate();
			this.Validate(this.form, ["permission_id"]);
			console.log(this.formError, this.form);
			if (!this.formError.length) {
				let ids = [];
				this.permissions.forEach(item => {
					item.permissions.forEach(permission => {
						if (permission.done) {
							ids.push(permission.id);
						}
					});
				});
				this.form.permission_id = ids;
				this.$axios.$post(`/api/v1/admin/admin-roles`, this.form).then(res => {
					this.$emit("addRole", res.data.role),
						this.$router.push(`/user-management/roles-and-permissions`),
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: "Role Created Successfully"
						}),
						this.getAdminRoles();
				});
				this.$emit("close");
			}
		}
	}
};
</script>
<style scoped>
.modal-container {
	z-index: 510;
}
/* @media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%
  }
} */
</style>
