<template>
	<div class="flex-1 flex flex-col overflow-auto">
		<transition name="fade" mode="out-in">
			<div v-if="showConfirmCancelModal == true">
				<AppConfirmCancel
					@close="showConfirmCancelModal = false"
					:adminAccountId="adminAccountId"
				/>
			</div>
		</transition>
		<div class="flex items-center px-4 md:px-6 py-2 text-sm">
			<AppButton
				v-if="authAdminPermissions.includes('Create Admin Account')"
				:label="'Create Admin Account'"
				:icon="'add-user'"
				:iconSize="'16'"
				class="mr-2"
				@click="show()"
			/>
			<template v-if="authAdminPermissions.includes('Delete Admin Account')">
				<AppButton
					class="text-white"
					v-if="authAdminPermissions.includes('Add Role')"
					:label="deleteAdminUser ? 'Done' : 'Delete Admin User'"
					:icon="deleteAdminUser ? 'circle-check' : 'garbage'"
					:iconSize="deleteAdminUser ? '21' : '16'"
					:background="deleteAdminUser ? 'green' : 'red'"
					@click="deleteAdminUser = !deleteAdminUser"
				/>
			</template>
		</div>
		<!-- <AppTable
			:total="total"
			:items="adminUsers"
			:currentPage="currentPage"
			:perPage="itemsPerPage"
			:columns="columns"
			:loading="loadingAdminUsers"
			:loadingMessage="'Loading Surgeries'"
			:routerLink="`/user-management`"
			@pagechanged="pagechanged"
		>
			<template v-slot:delete="slotProps" v-if="deleteAdminUser == true">
				<div
					class="flex justify-center items-center w-10 align-middle text-center"
				>
					<svgicon
						v-if="
							$auth.user.id != slotProps.item.id &&
								slotProps.item.admin_detail &&
								slotProps.item.admin_detail.role &&
								!slotProps.item.admin_detail.role.name.includes('Super')
						"
						@click.prevent="toDeleteAdminUser(user.id)"
						name="delete-user"
						width="21"
						height="21"
						class="fill-current text-red-600 hover:text-red-500 cursor-pointer mr-1"
					/>
					<span
						v-else-if="$auth.user.id === slotProps.item.id"
						class="text-sm text-gray-500"
						>You</span
					>
					<span
						v-else-if="
							slotProps.item.admin_detail &&
								slotProps.item.admin_detail.roles &&
								slotProps.item.admin_detail.roles[0].name == 'Super Admin'
						"
						class="text-sm text-yellow-500"
						>God</span
					>
				</div>
			</template>
			<template v-slot:name="slotProps">
				<span>{{
					`${slotProps.item.personal_detail.first_name} ${slotProps.item.personal_detail.last_name}`
				}}</span>
			</template>
		</AppTable> -->
		<div v-if="adminUsers.length > 0" class="w-full px-4 md:px-6">
			<!-- HEADER -->
			<div
				class="hidden md:flex items-center text-white justify-between font-semibold "
			>
				<div class="align-middle w-10" v-if="deleteAdminUser == true"></div>
				<div class="align-middle px-2 w-1/3">E-Mail</div>
				<div class="align-middle px-2 text-center w-1/3">Role</div>
				<div class="align-middle px-2 text-center w-1/3">Name</div>
			</div>
			<!-- END HEADER -->
			<!-- BODY -->
			<div
				v-for="(user, index) in adminUsers"
				:key="`user-${index}`"
				class="flex"
			>
				<div
					class="flex justify-center items-center w-10 align-middle text-center"
					v-if="deleteAdminUser == true"
				>
					<svgicon
						v-if="
							$auth.user.id != user.id &&
								user.admin_detail &&
								user.admin_detail.role &&
								!user.admin_detail.role.name.includes('Super')
						"
						@click.prevent="toDeleteAdminUser(user.id)"
						name="delete-user"
						width="21"
						height="21"
						class="fill-current text-red-600 hover:text-red-500 cursor-pointer mr-1"
					/>
					<span
						v-else-if="$auth.user.id === user.id"
						class="text-sm text-gray-500"
						>You</span
					>
					<span
						v-else-if="
							user.admin_detail &&
								user.admin_detail.roles &&
								user.admin_detail.roles[0].name == 'Super Admin'
						"
						class="text-sm text-yellow-500"
						>God</span
					>
				</div>
				<nuxt-link
					:to="{ path: `/user-management/${user.id}`, query: $route.query }"
					class="w-full flex flex-col md:flex-row justify-between px-2 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light transition-hover"
				>
					<div
						class="flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none text-white cursor-pointer md:w-1/3"
					>
						<strong class="block md:hidden text-xs uppercase">E-Mail</strong>
						<span class="break-word"
							>{{ user && user.email ? user.email : null }}
						</span>
					</div>
					<div
						class="flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none md:text-center md:w-1/3"
					>
						<strong class="block md:hidden text-xs uppercase">Role</strong>
						<span class="break-all">{{
							user &&
							user.admin_detail &&
							user.admin_detail.role &&
							user.admin_detail.role.name
								? user.admin_detail.role.name
								: null
						}}</span>
					</div>
					<div
						class="flex flex-col md:justify-center p-1 md:p-2 align-middle leading-none md:text-center md:w-1/3"
					>
						<strong class="block md:hidden text-xs uppercase">Name</strong>
						<span class="break-all">{{
							user && user.personal_detail
								? `${user.personal_detail.first_name} ${user.personal_detail.last_name}`
								: null
						}}</span>
					</div>
				</nuxt-link>
			</div>
			<!-- END BODY -->
		</div>

		<!-- PAGINATION -->
		<AppPagination
			:total="total"
			:totalPages="totalPages"
			:currentPage="currentPage"
			@pagechanged="pagechanged"
		/>
		<!-- PAGINATION ENDS HERE -->

		<div class="new-user-shield" v-if="modal" @click="modal = false"></div>
		<transition name="slide" mode="out-in">
			<div class="new-user-modal" v-if="modal">
				<CreateUser @close="modal = false" :adminCreate="adminCreate" />
			</div>
		</transition>

		<div
			class="new-user-shield"
			v-if="showConfirmCancelModal"
			@click="
				showConfirmCancelModal
					? (showConfirmCancelModal = false)
					: $router.go(-1)
			"
		/>
	</div>
</template>
<script>
import CreateUser from "@/components/UserManagement/CreateUser";
import AppConfirmCancel from "@/components/AppConfirmCancel";
import AppPagination from "@/components/Base/AppPagination";
import AppButton from "@/components/Base/AppButton";
import AppTable from "@/components/Base/AppTable";
export default {
	components: {
		CreateUser,
		AppConfirmCancel,
		AppPagination,
		AppButton,
		AppTable
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
			return this.$store.getters["auth/permissions"];
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
		show() {
			this.modal = true;
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
.new-user-modal {
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
	.new-user-modal {
		width: 70%;
	}
}
</style>
