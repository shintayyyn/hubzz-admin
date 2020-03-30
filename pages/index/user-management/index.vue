<template>
	<div class="flex-1 flex flex-col overflow-auto">
		<transition name="drop" mode="out-in">
			<AppConfirm
				v-if="showConfirmCancelModal === true"
				:message="'Are you sure you want to delete this user?'"
				@cancel="showConfirmCancelModal=false"
				@confirm="performAction()"
			/>
		</transition>
		<div class="flex items-center px-4 md:px-6 py-2 text-sm">
			<AppButton
				v-if="authAdminPermissions.includes('Create Admin Account')"
				:label="'Create Admin Account'"
				:icon="'add-user'"
				:iconSize="'16'"
				class="mr-2"
				@click="modal = true, deleteAdminUser = false"
			/>
			<template v-if="authAdminPermissions.includes('Delete Admin Account') && total > 0">
				<AppButton
					class="text-white"
					v-if="authAdminPermissions.includes('Delete Admin Account')"
					:label="deleteAdminUser ? 'Done' : 'Delete Admin User'"
					:icon="deleteAdminUser ? 'circle-check' : 'garbage'"
					:iconSize="deleteAdminUser ? '21' : '16'"
					:background="deleteAdminUser ? 'green' : 'red'"
					@click="deleteAdminUser = !deleteAdminUser"
				/>
			</template>
		</div>
		<div v-if="adminUsers.length > 0" class="w-full px-4 md:px-6">
			<div class="hidden md:flex items-center text-white justify-between font-semibold px-3 py-2">
				<div class="align-middle w-10" v-if="deleteAdminUser == true"></div>
				<div class="align-middle px-2 w-1/3">E-Mail</div>
				<div class="align-middle px-2 w-1/3">Roles</div>
				<div class="align-middle px-2 w-1/3">Name</div>
				<div class="align-middle px-2 w-1/3">Created At</div>
				<div class="align-middle px-2 w-1/3">Updated At</div>
			</div>
			<div v-for="(user, index) in adminUsers" :key="`user-${index}`" class="flex">
				<div
					class="flex justify-center items-center w-10 align-middle text-center"
					v-if="deleteAdminUser == true"
				>
					<svgicon
						v-if="$auth.user.id != user.id"
						@click.prevent="toDeleteAdminUser(user.id)"
						name="delete-user"
						width="21"
						height="21"
						class="fill-current text-red-600 hover:text-red-500 cursor-pointer mr-1"
					/>
					<span v-else class="text-sm text-gray-500">You</span>
				</div>
				<nuxt-link
					:to="{ path: `/user-management/${user.id}`, query: $route.query }"
					class="w-full flex flex-col md:flex-row justify-between px-2 md:px-4 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light transition-hover"
				>
					<div
						class="flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none text-white cursor-pointer md:w-1/3"
					>
						<strong class="block md:hidden text-xs uppercase">E-Mail</strong>
						<span class="break-word">{{ user && user.email ? user.email : null }}</span>
					</div>

					<div class="flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none text-white cursor-pointer md:w-1/3">
						<strong class="block md:hidden text-xs uppercase">Job Numbers</strong>
						<div v-if="user && user.admin_detail && user.admin_detail.roles">
							<div
								v-for="(role, index) in user.admin_detail.roles"
								:key="`role-${index}`"
								class
							>{{ role.name }}</div>
						</div>
					</div>
					<div class="flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none text-white cursor-pointer md:w-1/3">
						<strong class="block md:hidden text-xs uppercase">Name</strong>
						<span class="break-all">
							{{
                user && user.personal_detail
                ? `${user.personal_detail.first_name} ${user.personal_detail.last_name}`
                : null
							}}
						</span>
					</div>
					<div class="flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none text-white cursor-pointer md:w-1/3">
						<strong class="block md:hidden text-xs uppercase">Created At</strong>
						<span>
							{{$moment(user.created_at,'YYYY-MM-DD[T]').format('DD/MM/YYYY')}}
						</span>
					</div>
					<div class="flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none text-white cursor-pointer md:w-1/3">
						<strong class="block md:hidden text-xs uppercase">Updated At</strong>
						<span>
							{{$moment(user.updated_at,'YYYY-MM-DD[T]').format('DD/MM/YYYY')}}
						</span>
					</div>
				</nuxt-link>
			</div>
		</div>

		<AppPagination
			v-if="total > 0"
			class="px-4 md:px-6"
			:total="total"
			:totalPages="totalPages"
			:currentPage="currentPage"
			:perPage="itemsPerPage"
			@pagechanged="pagechanged"
		/>
		<p class="px-6 py-2 text-white" v-if="total === 0">No admin users.</p>

		<div class="new-user-shield" v-if="modal" @click="modal = false"></div>
		<transition name="slide" mode="out-in">
			<!-- <div class="new-user-modal" > -->
			<CreateUser v-if="modal" @close="modal = false" :registeeType="'admin'" />
			<!-- </div> -->
		</transition>

		<div
			class="new-user-shield"
			v-if="showConfirmCancelModal"
			@click="showConfirmCancelModal? (showConfirmCancelModal = false): $router.go(-1)"
			@close="showConfirmCancelModal = false"
		/>
	</div>
</template>
<script>
import CreateUser from "@/components/UserManagement/CreateUser";
import AppConfirm from "@/components/Base/AppConfirm";
import AppPagination from "@/components/Base/AppPagination";
import AppButton from "@/components/Base/AppButton";
import AppTable from "@/components/Base/AppTable";
export default {
	components: {
		CreateUser,
		AppConfirm,
		AppPagination,
		AppButton
	},
	data() {
		return {
			itemsPerPage: 10,
			currentPage: 1,
			params: {},
			search: "",

			// itemCount:'',
			// adminUsers:{},
			adminCreate: true,
			adminAccountId: "",
			modal: false,
			confirmCancel: false,
			adminId: "",
			deleteAdminUser: false,
			showConfirmCancelModal: false,
			columns: [
				{
					name: "",
					slot: true,
					slotName: "delete",
					dataIndex: "",
					class: "text-center"
				},
				{
					name: "E-mail",
					dataIndex: "email",
					class: "text-center"
				},
				{
					name: "Name",
					slot: true,
					slotName: "name",
					dataIndex: "",
					class: "text-center"
				},
				{
					name: "Role",
					dataIndex: "admin_detail.role.name",
					class: "text-center"
				}
			]
		};
	},
	created() {
		console.log("admin users", this.adminUsers);
	},
	watchQuery: ["page", "search"],
	async asyncData({ app, store, route }) {
		try {
			await store.commit("adminusers/TOGGLE_LOADING", true);
			let { page = 1, search = "" } = route.query;

			page = parseInt(page);
			const limit = 10;
			const offset = page * limit - limit;
			const params = { limit, offset };

			if (search) {
				params.search = search;
			}
			const getAdminUsersCount = await app.$axios.$get(
				`/api/v1/admin/admin-users/count`,
				{ params }
			);
			const getAdminUsers = await app.$axios.$get(`/api/v1/admin/admin-users`, {
				params
			});

			let response = await getAdminUsersCount;
			const itemCount = response.data.count;

			response = await getAdminUsers;
			const adminUsers = response.data.users;

			//store users and count here
			await store.commit("adminusers/SET_ADMIN_COUNT", itemCount);
			await store.commit("adminusers/SET_ADMIN_USERS", adminUsers);
			await store.commit("adminusers/TOGGLE_LOADING", false);
			return {
				itemsPerPage: limit,
				currentPage: page,
				search
				//itemCount, //store
				//adminUsers //store
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
	computed: {
		socketId() {
			return this.$store.state.socket_id;
		},
		loadingAdminUsers() {
			return this.$store.state.adminusers.loading_admin_users;
		},
		adminUsers() {
			return this.$store.getters["adminusers/getAdminUsers"];
		},
		authAdminPermissions() {
			return this.$store.getters["permissions"];
		},
		itemCount() {
			return this.$store.state.adminusers.itemCount;
		},
		totalPages() {
			return Math.ceil(this.itemCount / this.itemsPerPage);
		},
		total() {
			return this.adminUsers.length;
		}
	},
	methods: {
		getQuery() {
			const query = {
				...this.$route.query
			};
			const offset = parseInt(query.page) * 10 - 10;
			return offset;
		},
		getAdmins(params) {
			this.$store.dispatch("adminusers/fetchAdminUsers", {
				limit: 10,
				search: params.search,
				offset: this.getQuery()
			});
		},
		toDeleteAdminUser(userId) {
			this.adminAccountId = userId;
			this.showConfirmCancelModal = true;
		},
		async performAction() {
			if (this.adminAccountId) {
				await this.$axios
					.$delete(`/api/v1/admin/admin-users/${this.adminAccountId}`)
					.then(res => {
						console.log(res);
						this.$store.getters["adminusers/getAdminUsers"];
						this.$emit("close");
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: "Admin Account Successfully Deleted"
						});
					})
					.catch(err => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "danger",
							text: err.response.data.message
						});
					});
			}
			this.showConfirmCancelModal = false;
		},
		pagechanged(e) {
			const query = {
				...this.$route.query,
				page: e || 1
			};
			this.$router.push({ query });
			this.getAdmins(this.params);
		}
	}
};
</script>
<style>
.new-user-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
/* .new-user-modal {
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
	.new-user-modal {
		width: 70%;
	}
} */
</style>
