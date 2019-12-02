<template>
	<div class="flex-1 flex flex-col overflow-auto">
		<div class="flex md:flex-row pt-1 md:py-1 flex-wrap px-4">
			<button
				v-if="authAdminPermissions.includes('Add Role')"
				class="inline-flex items-center no-underline my-1 md:my-2 mr-1 py-2 px-4 bg-sunglow hover:bg-sunglow-dark text-sm font-semibold text-black rounded-lg shadow"
				@click="modal = true"
			>
				Add New Role
				<svgicon
					name="add-rectangle"
					width="21"
					height="21"
					color="black black"
					class="mx-1 -my-1"
				/>
			</button>
			<button
				v-if="
					deletingAdminRole == false &&
						authAdminPermissions.includes('Delete Role')
				"
				class="inline-flex items-center no-underline my-1 md:my-2 ml-1 py-2 px-4 bg-red-500 hover:bg-red-600 text-sm font-semibold text-white rounded-lg shadow"
				@click="deletingAdminRole = true"
			>
				Delete Role
				<svgicon
					name="garbage"
					width="21"
					height="21"
					color="white white"
					class="mx-1 -my-1"
				/>
			</button>
			<button
				v-if="
					deletingAdminRole == true &&
						authAdminPermissions.includes('Delete Role')
				"
				@click="deletingAdminRole = false"
				class="inline-flex items-center no-underline my-1 md:my-2 ml-1 py-2 px-4 bg-green-500 hover:bg-green-600 text-sm font-semibold text-white rounded-lg shadow"
			>
				Done
				<svgicon
					name="circle-check"
					width="21"
					height="21"
					color="white white"
					class="mx-1 -my-1"
				/>
			</button>
		</div>
		<div v-if="adminRoles.length" class="w-full px-4">
			<!-- HEADER -->
			<div
				class="hidden md:flex items-center text-white justify-around font-semibold"
			>
				<div class="pr-3 md:px-4" v-if="deletingAdminRole == true"></div>
				<div class="align-middle px-2 w-1/3">Role Name</div>
				<div class="align-middle px-2 w-1/3">Date Created</div>
				<div class="align-middle px-2 w-1/3">Description</div>
			</div>
			<!-- END HEADER -->
			<!-- BODY -->
			<div
				v-for="(role, index) in adminRoles"
				:key="`role-${index}`"
				class="flex"
			>
				<div
					@click="toDeleteAdminRole(role.id)"
					v-if="deletingAdminRole == true"
					class="flex items-center pr-3 cursor-pointer text-red-600 hover:text-red-700"
				>
					<svgicon name="garbage" width="22" height="22" class="fill-current" />
				</div>
				<nuxt-link
					:to="{ path: `/user-management/roles-and-permissions/${role.id}` }"
					class="w-full flex flex-col md:flex-row px-2 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light transition-hover"
				>
					<div
						class="flex flex-col md:justify-center md:w-1/3 p-1 md:p-2 align-middle leading-none"
					>
						<strong class="block md:hidden text-xs uppercase">Role Name</strong>
						<span>{{ role.name }}</span>
					</div>
					<div
						class="flex flex-col md:justify-center md:w-1/3 p-1 md:p-2 align-middle leading-none"
					>
						<strong class="block md:hidden text-xs uppercase"
							>Date Created</strong
						>
						<span>{{ $moment(role.created_at).format("MMM D, YYYY") }}</span>
					</div>
					<div
						class="flex flex-col md:justify-center md:w-1/3 p-1 md:p-2 align-middle leading-none"
					>
						<strong class="block md:hidden text-xs uppercase"
							>Description</strong
						>
						<span
							style="display:-webkit-box;webkit-line-clamp:2;-webkit-box-orient: vertical;overflow: hidden; text-overflow: ellipsis;"
							>{{ role.description }}</span
						>
					</div>
				</nuxt-link>
			</div>
		</div>
		<div v-else class="text-center text-gray-400 py-4">No admin roles</div>
		<div v-if="!adminRoles.length == 0">
			<AppPagination
				:total="total"
				:totalPages="totalPages"
				:currentPage="currentPage"
				@pagechanged="pagechanged"
			/>
		</div>
		<div
			class="role-shield"
			v-if="modal == true"
			@click="
				modal
					? (modal = false)
					: $router.push('/user-management/roles-and-permissions')
			"
		></div>
		<transition name="slide" mode="out-in">
			<div class="role-modal shadow-lg" v-if="modal">
				<CreateAdminRole @close="modal = false" />
			</div>
		</transition>
	</div>
</template>
<script>
import CreateAdminRole from "@/components/UserManagement/CreateAdminRole";
import AppPagination from "@/components/Base/AppPagination";
export default {
	components: {
		CreateAdminRole,
		AppPagination
	},
	data() {
		return {
			// adminRoles:[],
			modal: false,
			deletingAdminRole: false,
			currentPage: 1,
			perPage: 0,
			totalPages: 0
		};
	},
	beforeDestroy() {
		let query = Object.assign({}, this.$route.query);
		delete query.admin_role_page;
		this.$router.push({ query });
	},
	watch: {
		$route(to, from) {
			this.currentPage = parseInt(to.query.admin_role_page);
			this.getAdminRoles();
		}
	},
	computed: {
		total() {
			return this.$store.state.adminusers.adminRolesCount;
		},
		adminRoles() {
			return this.$store.state.adminusers.adminRoles;
		},
		authAdminPermissions() {
			return this.$store.getters["auth/permissions"];
		}
	},
	async created() {
		const query = {
			...this.$route.query,
			admin_role_page: this.$route.query.admin_role_page || 1
		};
		try {
			await this.$axios.$get(`/api/v1/admin/admin-roles/count`).then(res => {
				this.$store.commit("adminusers/SET_ADMIN_ROLES_COUNT", res.data.count);
				this.perPage = 10;
				this.totalPages = Math.ceil(this.total / this.perPage);
				this.getAdminRoles();
			});
		} catch (err) {
			console.log("get roles count error", err);
		}
  },
  
	methods: {
		async getAdminRoles() {
			let limit = 10;
			let offset = 0;
			offset = this.perPage * (parseInt(this.$route.query.admin_role_page) - 1);
			let params = { limit, offset };

			await this.$axios
				.$get(`/api/v1/admin/admin-roles/`, { params })
				.then(res => {
					this.$store.commit("adminusers/SET_ADMIN_ROLES", res.data.roles);
				})
				.catch(err => {
					console.log("get roles error!", err);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Something went wrong!"
					});
				});
		},

		async toDeleteAdminRole(roleId) {
			await this.$axios
				.delete(`/api/v1/admin/admin-roles/${roleId}`)
				.then(res => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Admin Role Successfully Deleted"
					});
					this.$store.dispatch("adminusers/fetchAdminRoles", {
						limit: 10
					});
				})
				.catch(err => {
					console.log("delete admin role error!!", err);
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: "Something Went Wrong!"
					});
				});
		},
		updateList() {},
		pagechanged(e) {
			const query = {
				...this.$route.query,
				admin_role_page: e || 1
			};
			this.$router.push({ query });
			this.getAdminRoles();
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
	border-left: solid 2px yellow;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}

@media screen and (min-width: 1200px) {
	.role-modal {
		width: 80%;
	}
}

.multiline-truncate {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
