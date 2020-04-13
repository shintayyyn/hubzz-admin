<template>
  <div class="flex-1 flex flex-col overflow-auto">
    <div class="flex px-4 md:px-8 py-2 text-sm flex-wrap">
      <AppConfirm
        v-if="confirm"
        :message="'Are you sure you want to delete this role?'"
        @confirm="deleteRole(role_id)"
        @cancel="confirm=false"
      />
      <AppButton
        v-if="authAdminPermissions.includes('Create New Role')"
        :label="'Add New Role'"
        :icon="'add-rectangle'"
        class="my-1 mr-2"
        @click="$router.push('/user-management/roles-and-permissions/create')"
      />
      <template v-if="authAdminPermissions.includes('Delete Role')">
        <AppButton
          v-if="authAdminPermissions.includes('Create New Role')"
          class="my-1 text-white"
          :label="deletingAdminRole ? 'Done' : 'Delete Role'"
          :icon="deletingAdminRole ? 'circle-check' : 'garbage'"
          :iconSize="deletingAdminRole ? '21' : '16'"
          :background="deletingAdminRole ? 'green' : 'red'"
          @click="deletingAdminRole = !deletingAdminRole"
        />
      </template>
    </div>

    <!--  -->
    <!-- <div v-if="adminRoles.length" class="w-full px-4 md:px-8">
			<div class="hidden md:flex items-center text-white justify-around font-semibold">
				<div class="pr-3 md:px-4" v-if="deletingAdminRole == true"></div>
				<div class="align-middle px-2 w-1/3">Role Name</div>
				<div class="align-middle px-2 w-1/3">Date Created</div>
				<div class="align-middle px-2 w-1/3">Description</div>
			</div>
			<div v-for="(role, index) in adminRoles" :key="`role-${index}`" class="flex">
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
					<div class="flex flex-col md:justify-center md:w-1/3 p-1 md:p-2 align-middle leading-none">
						<strong class="block md:hidden text-xs uppercase">Role Name</strong>
						<span>{{ role.name }}</span>
					</div>
					<div class="flex flex-col md:justify-center md:w-1/3 p-1 md:p-2 align-middle leading-none">
						<strong class="block md:hidden text-xs uppercase">Date Created</strong>
						<span>{{ $moment(role.created_at).format("MMM D, YYYY") }}</span>
					</div>
					<div class="flex flex-col md:justify-center md:w-1/3 p-1 md:p-2 align-middle leading-none">
						<strong class="block md:hidden text-xs uppercase">Description</strong>
						<span
							style="display:-webkit-box;webkit-line-clamp:2;-webkit-box-orient: vertical;overflow: hidden; text-overflow: ellipsis;"
						>{{ role.description }}</span>
					</div>
				</nuxt-link>
			</div>
		</div>
		<div v-else class="text-center text-gray-400 py-4">No admin roles</div>-->

    <!-- <div>
			<AppPagination
				class="px-4 md:px-8"
				:total="total"
				:totalPages="totalPages"
				:currentPage="currentPage"
				:perPage="perPage"
				@pagechanged="pagechanged"
			/>
		</div>-->
    <div class="m-2">
      <AppTable
        v-if="total > 0"
        :total="total"
        :items="adminRoles"
        :currentPage="currentPage"
        :perPage="perPage"
        :columns="columns"
        :loading="loading"
        :routerLink="`/user-management/roles-and-permissions`"
        @pagechanged="pagechanged"
      >
        <template v-if="authAdminPermissions.includes('Delete Role')" v-slot:actions="slotProps">
          <div class="flex justify-center">
            <div
              class="text-white ml-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700"
              @click.prevent.stop="toDeleteAdminRole(slotProps.item.id)"
            >
              Delete
            </div>
          </div>
        </template>
      </AppTable>
    </div>

    <div
      v-if="modal == true"
      class="role-shield"
      @click="
        modal
          ? (modal = false)
          : $router.push('/user-management/roles-and-permissions')
      "
    />
  </div>
</template>
<script>
import AppTable from "@/components/Base/AppTable"
import AppButton from "@/components/Base/AppButton"
import AppConfirm from "@/components/Base/AppConfirm"
export default {
	components: {
		AppButton,
		AppConfirm,
		AppTable
	},
	data () {
		return {
			// adminRoles:[],
			modal: false,
			deletingAdminRole: false,
			currentPage: 1,
			perPage: 10,
			// totalPages: 0,
			confirm: false,
			role_id: 0,
			defaultColumns: [
				{
					name: "Role Name",
					dataIndex: "name",
					class: "text-center font-bold md:font-normal"
				},
				{
					name: "Role Description",
					dataIndex: "description",
					class: "md:text-center"
				},
				{
					name: "Created At",
					dataIndex: "created_at",
					class: "localDate text-center"
				},
				{
					name: "Updated At",
					dataIndex: "updated_at",
					class: "localDate text-center"
				}
			],
			columns: []
		}
	},
	computed: {
		loading () {
			return this.$store.state.adminusers.loading_admin_users
		},
		total () {
			return this.$store.state.adminusers.adminRolesCount
		},
		totalPages () {
			return Math.ceil(this.total / this.perPage)
		},
		adminRoles () {
			return this.$store.state.adminusers.adminRoles
		},
		authAdminPermissions () {
			return this.$store.getters["permissions"]
		}
	},
	watch: {
		$route (to) {
			this.currentPage = parseInt(to.query.admin_role_page)
			this.getAdminRoles()
		},
		deletingAdminRole (newValue) {
			if (newValue === true) {
				this.columns = [
					...this.defaultColumns,
					{
						name: "Actions",
						slot: true,
						slotName: "actions",
						dataIndex: "",
						class: "text-center"
					}
				]
			} else {
				this.columns = [...this.defaultColumns]
			}
		}
	},
	beforeDestroy () {
		let query = Object.assign({}, this.$route.query)
		delete query.admin_role_page
		this.$router.push({ query })
	},
	async created () {
		this.columns = [...this.defaultColumns]
		await this.getAdminRoles()
	},

	methods: {
		async getAdminRoles () {
			await this.$store.commit("adminusers/TOGGLE_LOADING", true)
			let limit = 10
			let offset = 0
			offset = this.perPage * (parseInt(this.$route.query.admin_role_page) - 1)
			let params = { limit, offset }
			await this.$axios
				.$get(`/api/v1/admin/admin-roles/count`)
				.then(res => {
					this.$store.commit(
						"adminusers/SET_ADMIN_ROLES_COUNT",
						res.data.count
					)
					this.perPage = 10
					this.totalPages = Math.ceil(this.total / this.perPage)
				})
				.catch(err => {
					console.log("get roles error!", err)
					this.$store.commit("adminusers/TOGGLE_LOADING", false)
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					})
				})
			await this.$axios
				.$get(`/api/v1/admin/admin-roles/`, { params })
				.then(res => {
					this.$store.commit("adminusers/SET_ADMIN_ROLES", res.data.roles)
				})
				.catch(err => {
					console.log("get roles error!", err)
					this.$store.commit("adminusers/TOGGLE_LOADING", false)
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					})
				})
			await this.$store.commit("adminusers/TOGGLE_LOADING", false)
		},

		toDeleteAdminRole (roleId) {
			console.log(roleId)
			this.role_id = roleId
			this.confirm = true
		},

		async deleteRole (roleId) {
			await this.$axios
				.delete(`/api/v1/admin/admin-roles/${roleId}`)
				.then(() => {
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "success",
						text: "Admin Role Successfully Deleted"
					})
					this.$store.dispatch("adminusers/fetchAdminRoles", {
						limit: 10
					})
					this.$store.dispatch("adminusers/fetchAdminRolesCount", {
						countOnly: true
					})
					this.confirm = false
				})
				.catch(err => {
					console.log("delete admin role error!!", err)
					this.$store.commit("SET_NOTIFICATION", {
						enabled: true,
						status: "danger",
						text: err.response.data.message
					})
				})
		},
		updateList () {},
		pagechanged (e) {
			const query = {
				...this.$route.query,
				admin_role_page: e || 1
			}
			this.$router.push({ query })
			this.getAdminRoles()
		}
	}
}
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

.multiline-truncate {
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}
</style>
