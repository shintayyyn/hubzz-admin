<template>
  <div class="flex-1 flex flex-col overflow-auto">
    <div class="flex flex-wrap">
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
        class="my-1 mt-3 mr-2"
        @click="$router.push('/user-management/roles-and-permissions/create')"
      />
      <template v-if="authAdminPermissions.includes('Delete Role')">
        <AppButton
          v-if="authAdminPermissions.includes('Create New Role')"
          class="my-1 mt-3 text-white"
					:customTheme="deletingAdminRole ? 'bg-green-600' : 'bg-red-600'"
          :label="deletingAdminRole ? 'Done' : 'Delete Role'"
          :icon="deletingAdminRole ? 'circle-check' : 'garbage'"
          :iconSize="deletingAdminRole ? '21' : '16'"
          :background="deletingAdminRole ? 'green' : 'red'"
          @click="deletingAdminRole = !deletingAdminRole"
        />
      </template>
    </div>
    <div class="m-2">
      <AppTableNew
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
        <template v-slot:updated_at="slotProps">
          <div>
            {{ slotProps.item.created_at_in_gb_formatted === slotProps.item.updated_at_in_gb_formatted ? '(none)' : slotProps.item.updated_at_in_gb_formatted }}
          </div>
        </template>
        <template v-if="authAdminPermissions.includes('Delete Role')" v-slot:actions="slotProps">
          <div class="flex justify-center">
						<AppButton
							v-if="authAdminPermissions.includes('Delete Role')"
							:label="'Delete'"
							:icon="'garbage'"
              :iconSize="'16'"
							:customTheme="'bg-red-600 text-white'"
							@click="toDeleteAdminRole(slotProps.item.id)"
						/>
          </div>
        </template>
      </AppTableNew>
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
import AppTableNew from "@/components/Base/AppTableNew"
import AppButton from "@/components/Base/AppButton"
import AppConfirm from "@/components/Base/AppConfirm"
export default {
	components: {
		AppButton,
		AppConfirm,
		AppTableNew
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
					dataIndex: "created_at_in_gb_formatted",
					class: "text-center"
				},
				{
					name: "Updated At",
					dataIndex: "",
					slot: true,
					slotName: 'updated_at',
					class: "text-center"
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
						{
						name: "Actions",
						slot: true,
						slotName: "actions",
						dataIndex: "",
						class: "text-center"
					},
					...this.defaultColumns,
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
					// this.totalPages = Math.ceil(this.total / this.perPage)
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
