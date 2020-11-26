<template>
	<div ref="modalContainer" class="role-modal">
		<div class="p-4 md:p-6 text-white">
			<div class="pb-4">
				<svgicon
					name="arrow-left-solid"
					height="32"
					widht="32"
					class="cursor-pointer text-white hover:text-sunglow fill-current"
					@click="goBack()"
				/>
			</div>
			<div class="flex flex-row items-start justify-between flex-wrap">
				<div class="flex items-center justify-between w-full leading-tight">
					<div class="text-2xl md:text-4xl font-bold md:font-normal">{{ role.name }}</div>
					<div class="flex py-1 text-sm md:text-base">
						<div
							v-if="
                editingPermissions == false &&
                  authAdminPermissions.includes('Edit Role')
              "
							@click="editingPermissions = true"
							class="flex items-center mr-1 md:mr-2 py-1 px-2 md:px-4 md:py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 cursor-pointer text-black"
						>
							<div class="mx-2 font-semibold">Edit</div>
							<div>
								<svgicon name="edit" width="21" height="21" color="black black" />
							</div>
						</div>
						<div
							v-if="
                editingPermissions == true &&
                  authAdminPermissions.includes('Edit Role')
              "
							@click="editingPermissions = false"
							class="flex items-center mr-1 md:mr-2 py-1 px-2 md:px-4 md:py-2 rounded-lg bg-yellow-500 hover:bg-yellow-400 cursor-pointer text-black"
						>
							<div class="mx-2 font-semibold">Cancel</div>
							<div>
								<svgicon name="times-solid" width="21" height="21" color="black black" />
							</div>
						</div>
						<div
							v-if="
                editingPermissions == true &&
                  authAdminPermissions.includes('Edit Role')
              "
							@click="save()"
							class="flex items-center ml-1 md:ml-2 py-1 px-2 md:px-4 md:py-2 rounded-lg bg-green-500 hover:bg-green-600 cursor-pointer"
						>
							<div class="mx-2 font-semibold">Save</div>
							<div>
								<svgicon name="circle-check" width="21" height="21" color="white white" />
							</div>
						</div>
					</div>
				</div>
				<div class="text-sm italic">{{ role.description }}</div>
			</div>
			<!-- SHOW ROLE PERMISSIONS -->
			<div class="my-2 md:my-4" v-if="editingPermissions == false">
				<div class="masorny-container three overflow-hidden">
					<div
						class="item pb-3 md:pt-1"
						v-if="rolePermissions.find(permission => permission.category === 'Locum')"
					>
						<div class="text-lg font-semibold">Locum Management</div>
						<div
							v-for="(permission, index) in rolePermissions"
							:key="`permission-${index}`"
							:class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
						>{{ permission.category === "Locum" ? permission.name : null }}</div>
					</div>
					<div
						class="item pb-3 md:pt-1"
						v-if="rolePermissions.find(permission => permission.category === 'Practice')"
					>
						<div class="text-lg font-semibold">Practice Management</div>
						<div
							v-for="(permission, index) in rolePermissions"
							:key="`permission-${index}`"
							:class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
						>{{ permission.category === "Practice" ? permission.name : null }}</div>
					</div>
					<div
						class="item pb-3 md:pt-1"
						v-if="rolePermissions.find(permission => permission.category === 'Billing')"
					>
						<div class="text-lg font-semibold">Billing and Reports Management</div>
						<div
							v-for="(permission, index) in rolePermissions"
							:key="`permission-${index}`"
							:class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
						>{{ permission.category === "Billing" ? permission.name : null }}</div>
					</div>
					<div
						class="item pb-3 md:pt-1"
						v-if="rolePermissions.find(permission => permission.category === 'Miscellaneous')"
					>
						<div class="text-lg font-semibold">Miscellaneous</div>
						<div
							v-for="(permission, index) in rolePermissions"
							:key="`permission-${index}`"
							:class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
						>{{ permission.category === "Miscellaneous" ? permission.name : null }}</div>
					</div>
					<div
						class="item pb-3 md:pt-1"
						v-if="rolePermissions.find(permission => permission.category === 'User')"
					>
						<div class="text-lg font-semibold">User Management</div>
						<div
							v-for="(permission, index) in rolePermissions"
							:key="`permission-${index}`"
							:class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
						>{{permission.category === "User" ? permission.name: null}}</div>
					</div>
					<div
						class="item pb-3 md:pt-1"
						v-if="rolePermissions.find(permission => permission.category === 'Change Email Requests')"
					>
						<div class="text-lg font-semibold">Change Email Requests Management</div>
						<div
							v-for="(permission, index) in rolePermissions"
							:key="`permission-${index}`"
							:class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
						>{{permission.category === "Change Email Requests" ? permission.name: null}}</div>
					</div>
					<div
						class="item pb-3 md:pt-1"
						v-if="rolePermissions.find(permission => permission.category === 'Reports')"
					>
						<div class="text-lg font-semibold">Reports Management</div>
						<div
							v-for="(permission, index) in rolePermissions"
							:key="`permission-${index}`"
							:class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
						>{{ permission.category === "Reports"? permission.name: null}}</div>
					</div>
					<div
						class="item pb-3 md:pt-1"
						v-if="rolePermissions.find(permission => permission.category === 'Standard Terms')"
					>
						<div class="text-lg font-semibold">Standard Terms Management</div>
						<div
							v-for="(permission, index) in rolePermissions"
							:key="`permission-${index}`"
							:class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
						>{{permission.category === "Standard Terms"? permission.name: null}}</div>
					</div>
					<div
						class="item pb-3 md:pt-1"
						v-if="rolePermissions.find(permission => permission.category === 'Referral Lottery')"
					>
						<div class="text-lg font-semibold">Referral Lottery Management</div>
						<div
							v-for="(permission, index) in rolePermissions"
							:key="`permission-${index}`"
							:class="permission.name.includes('View') ? 'text-sm mx-2' : 'text-sm mx-6'"
						>{{permission.category === "Referral Lottery"? permission.name: null}}</div>
					</div>
				</div>
			</div>
			<!-- EDIT ROLE PERMISSIONS -->
			<div class="flex flex-col mt-4" v-if="editingPermissions == true">
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
				<!-- <div class="flex flex-wrap justify-start">
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
				</div>-->
				<div class="masorny-container three">
					<div class="item p-2" v-for="(role, index) in permissions" :key="index">
						<div class="flex flex-col">
							<div class="w-full flex flex-row items-center pb-1">
								<input
									type="checkbox"
									:id="role.category"
									:checked="isChecked(role.permissions, role.category)"
									@change="checkAll(index, $event.target.checked)"
								/>

								<label
									class="font-bold md:text-xl pl-1 leading-none flex items-center"
									:for="role.category"
								>{{role.category}} Management</label>
							</div>

							<div v-for="(item, index) in hierarchyPermissions" :key="index">
								<!-- {{item.category}}
								{{item.permissions}}-->
								<template v-if="role.category === item.category">
									<div class="w-full p-2">
										<div class="flex flex-col w-full">
											<div class="pl-4 w-full">
												<div
													class="flex flex-col px-1 w-full"
													v-for="(permission, index) in item.permissions"
													:key="permission.id"
												>
													<input
														v-model="permission.done"
														type="checkbox"
														:id="permission.id"
														:checked="permission.done"
														@change="onChangeCategory(index, item.permissions, $event.target.checked, permission.name)"
													/>
													<label
														:for="permission.id"
														class="text-sm pl-1"
														:class="permission.name.includes('View') ? '' : item.permissions.length > 1 ? 'ml-8' : ''"
													>{{permission.name}}</label>
												</div>
											</div>
										</div>
									</div>
								</template>
							</div>
						</div>
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
		AppButton,
		AppInput
	},
	data() {
		return {
			role: "",
			rolePermissions: [],
			allPermissions: [],
			editingPermissions: false,
			motherPermissions: ["View Locums", "View Practices", ""],
			permissions: [],
			hierarchyPermissions: [],

			formError: [],
			form: {
				name: "",
				description: "",
				permission_id: []
			}
		};
	},

	created() {
		this.form.name = this.role.name;
		this.form.description = this.role.description;
		this.getPermissions();
	},

	computed: {
		authAdminPermissions() {
			return this.$store.getters["permissions"];
		}
	},

	async asyncData({ app, store, route }) {
		try {
			let response = await app.$axios.$get(
				`/api/v1/admin/admin-roles/${route.params.roleId}`
			);
			const role = response.data.role;
			let rolePermissions = response.data.role.permissions;
			let allPermissions = [];

			await app.$axios.$get(`/api/v1/admin/admin-permissions`).then(res => {
				res.data.permissions.forEach(permission => {
					let hasPermission = rolePermissions.find(
						item => item.id === permission.id
					);
					if (hasPermission) {
						allPermissions.push({ ...permission, done: true });
					} else {
						allPermissions.push({ ...permission, done: false });
					}
				});
			});
			let categories = [];
			allPermissions.forEach(permission => {
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
			allPermissions.forEach(permission => {
				let foundCategory = categories.find(
					item => item.category === permission.category
				);
				foundCategory.permissions.push(permission);
			});
			allPermissions = categories;
			return {
				role,
				rolePermissions,
				allPermissions
			};
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			});
			console.log("get users error", err);
		}
	},

	methods: {
		getRoles(roles) {
			this.$axios
				.$get(`/api/v1/admin/admin-roles/${this.$route.params.roleId}`)
				.then(res => {
					this.role = res.data.role;
					this.rolePermissions = res.data.role.permissions;
				});
		},
		goBack() {
			const query = {
				...this.$route.query
			};
			if (query.job_status) {
				delete query.job_status;
			}
			this.$router.push({
				path: "/user-management/roles-and-permissions",
				query
			});
		},
		getPermissions() {
			this.$axios.$get(`/api/v1/admin/admin-permissions`).then(res => {
				res.data.permissions.forEach(permission => {
					let hasPermission = this.role.permissions.find(
						item => item.id === permission.id
					);
					if (hasPermission) {
						this.permissions.push({ ...permission, done: true });
					} else {
						this.permissions.push({ ...permission, done: false });
					}
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
			this.setSubcategories(categories);
		},
		setSubcategories(permission) {
			let subCategories = [];
			permission.forEach(item => {
				item.permissions.forEach(item => {
					if (subCategories.length === 0) {
						subCategories.push({
							category: item.category,
							subcategory: item.subcategory,
							permissions: []
						});
					} else {
						let foundCategory = subCategories.find(
							categ => categ.subcategory === item.subcategory
						);
						if (!foundCategory) {
							subCategories.push({
								category: item.category,
								subcategory: item.subcategory,
								permissions: []
							});
						}
					}
				});
			});

			this.setHierarchy(subCategories);
		},
		async setHierarchy(subCategories) {
			console.log("set hierarchy subcategories", subCategories);
			await this.permissions.forEach(item => {
				item.permissions.forEach(permission => {
					let findSub = subCategories.find(
						sub =>
							sub.category === permission.category &&
							sub.subcategory === permission.subcategory
					);
					findSub.permissions.push(permission);
				});
			});

			this.hierarchyPermissions = await subCategories;
		},
		onChangeCategory(index, permissions, e, permission) {
			if (permission.includes("View") || index === 0) {
				permissions.forEach(item => {
					item.done = e;
				});
			} else {
				let findParent = permissions.find((item, index) => index === 0);
				let hasCheck = [];
				permissions.forEach((item, index) => {
					if (index > 0) hasCheck.push(item.done);
				});
				if (findParent && findParent.done === false) findParent.done = true;
			}
		},
		isChecked(permissions, category) {
			// console.log('hierarchy permissions', this.hierarchyPermissions)
			let checkedPermissions = [];
			checkedPermissions = permissions.filter(item => item.done === true);
			if (checkedPermissions.length > 0) {
				return true;
			} else {
				return false;
			}

			// return !permissions.map(item => item.done).includes(false);
			// let parents = [];
			// let filter = this.hierarchyPermissions.filter(
			// 	item => item.category === category
			// );
			// filter.forEach(item => {
			// 	parents.push(item.permissions.find((item, index) => index === 0));
			// });
			// return !parents.map(item => item.done).includes(false);
		},
		checkAll(index, checked) {
			this.permissions[index].permissions.forEach(item => {
				item.done = checked;
			});
		},

		save() {
			let ids = [];
			this.permissions.forEach(item => {
				item.permissions.forEach(permission => {
					if (permission.done) {
						ids.push(permission.id);
					}
				});
			});
			this.form.permission_id = ids;
			this.Validate(this.form);
			if (!this.formError.length) {
				this.$axios
					.$put(
						`/api/v1/admin/admin-roles/${this.$route.params.roleId}`,
						this.form
					)
					.then(res => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: "Role Updated Successfully"
						});
						this.getRoles(res.data.role);
						// this.$emit("updateRole", res.data.role);
						// this.role.name = res.data.role.name;
						// this.role.description = res.data.role.description;
						this.editingPermissions = false;
					});
			} else {
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "danger",
					text: "Something went wrong!"
				});
			}
		}
	}
};
</script>
<style>
.role-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
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
</style>
