<template>
	<div class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-y-auto">
		<div class="px-2 text-xl md:text-4xl text-white">Locums</div>
		<div class="px-2 flex flex-col md:flex-row justify-between md:items-center">
			<div class="flex py-2">
				<div class="relative">
					<input
						class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
						placeholder="Search Locum by Name"
						v-model="search"
						@keyup.enter="searchSubmit"
					/>
					<button
						v-if="search"
						class="absolute top-0 right-0 bottom-0 mr-3 md:mr-1"
						@click="(search = ''), searchSubmit()"
					>
						<svgicon
							name="times-solid"
							height="12"
							width="12"
							class="text-white hover:text-yellow-500 fill-current -mx-2 md:-mx-6"
						/>
					</button>
				</div>
			</div>
			<div class="flex flex-col w-full justify-end">
				<div
					class="md:w-full relative flex flex-col md:flex-row justify-end md:items-center md:items-end md:py-2 py-0"
				>
					<label class="text-sm text-white md:pr-2">Filter by Compliance Status</label>
					<select
						v-model="filterCompliances"
						class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
						id="grid-state"
					>
						<option :value="null">All</option>
						<option>Empty</option>
						<option>Incomplete</option>
						<option>Pending</option>
						<option>Expiring</option>
						<option>Expired</option>
						<option>Rejected</option>
						<option>Compliant</option>
					</select>
				</div>
				<div
					class="relative md:hidden flex flex-col justify-end md:flex-row md:items-center md:items-end pt-2 md:p-2 md:py-0"
				>
					<label class="text-sm text-white md:pr-2">Sort by</label>
					<select
						v-model="sort"
						class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
					>
						<option value selected>Name</option>
						<option>Profession</option>
						<option>Date signed-up</option>
						<option>Sign-up verified</option>
					</select>
				</div>
			</div>
		</div>

		<AppTable
			v-if="itemCount > 0"
			:total="itemCount"
			:items="locumUsers"
			:currentPage="currentPage"
			:perPage="perPage"
			:columns="columns"
			:loading="loadingLocums"
			:routerLink="`/locums`"
			:orderBy="params.order_by"
			@pagechanged="pagechanged"
			@limitchanged="limitchanged"
			@sorted="sorted"
		>
			<template v-slot:status_slot="slotProps">
				<div
					class="px-4 py-1 rounded-full w-32 text-center mx-auto"
					:class="statusStyle(slotProps.item.status)"
				>{{ slotProps.item.status }}</div>
			</template>
			<template v-slot:compliance_slot="slotProps">
				<div
					class="px-4 py-1 rounded-full w-32 text-center mx-auto"
					:class="complianceStatusStyle(slotProps.item.compliance_status)"
				>{{ slotProps.item.compliance_status }}</div>
			</template>
		</AppTable>
		<div v-else class="mt-2 w-full text-center text-white">No registered locums.</div>
		<div
			class="locum-shield"
			v-if="$route.name.includes('index-locums-id')"
			@click="$router.push({ path: `/locums`, query: $route.query })"
		></div>
		<nuxt-child />
	</div>
</template>

<script>
import debounce from "lodash.debounce";
import AppLoading from "@/components/Base/AppLoading";
import AppPagination from "@/components/Base/AppPagination";
import AppTable from "@/components/Base/AppTable";

export default {
	components: {
		AppLoading,
		AppPagination,
		AppTable
	},
	data() {
		return {
			currentPage: 1,

			filterCompliances: "",
			search: "",
			params: {
				limit: 10,
				offset: 0,
				order_by: ["created_at:desc"]
			},
			perPage: 0,
			sort: "",
			sortedBy: "",
			sortType: "",
			order_by: "",
			name: true,
			profession: true,
			created_at: true,
			email_verified_at: true,

			columns: [
				{
					name: "User ID",
					dataIndex: "id",
					class: "text-center",
					sortable: false
				},
				{
					name: "Name",
					dataIndex: "personal_detail_name",
					sortable: true
				},
				{
					name: "Profession",
					dataIndex: "profession_name",
					class: "text-center",
					sortable: true
				},
				{
					name: "Date Signed-up",
					dataIndex: "created_at",
					class: "localDate text-center",
					sortable: true
				},
				{
					name: "Sign-up verified",
					dataIndex: "email_verified_at",
					class: "localDate text-center",
					sortable: true
				},
				{
					name: "Status",
					dataIndex: "status",
					class: "text-center",
					slot: true,
					slotName: "status_slot"
				},
				{
					name: "Compliance Status",
					dataIndex: "compliance_status",
					class: "text-center",
					slot: true,
					slotName: "compliance_slot"
				}
			]
		};
	},
	watchQuery: ["page", "search", "compliance_status"],
	async asyncData({ app, store, route, error }) {
		try {
			await store.commit("locums/TOGGLE_LOADING", true);
			let {
				page = 1,
				search = "",
				order_by = [],
				compliance_status = null
			} = route.query;

			if (!compliance_status) {
			}
			page = parseInt(page);
			const createdRoute = route.query;
			const limit = 10;
			const offset = page * limit - limit;
			order_by =
				createdRoute && createdRoute.order_by
					? createdRoute.order_by
					: "created_at:desc";
			const params = { limit, offset, order_by };

			if (search) {
				params.search = search;
			}
			params.compliance_status = compliance_status;
			const getLocumUsersCountPromise = app.$axios.$get(
				`/api/v1/admin/locum-users/count`,
				{ params }
			);
			const getLocumUsersPromise = app.$axios.$get(
				`/api/v1/admin/locum-users`,
				{ params }
			);

			let response = await getLocumUsersCountPromise;
			const itemCount = response.data.count;
			await store.commit("locums/SET_LOCUM_COUNT", itemCount); // put the obtained data from the database to the state

			response = await getLocumUsersPromise;
			const locumUsers = response.data.users;

			await store.commit("locums/SET_LOCUM_USERS", locumUsers); // 'SET_DATA_PROPERTY denotes a mutation

			await store.commit("locums/TOGGLE_LOADING", false);
			return {
				filterCompliances: compliance_status,
				perPage: limit,
				currentPage: page,
				search,
				order_by
			};
		} catch (err) {
			error({ statusCode: 404 });
			// store.commit('SET_NOTIFICATION',{ enabled: true, status:'danger', text:'Something went wrong!'})
			console.log("Get locums error!", err);
		}
	},

	computed: {
		loadingLocums() {
			return this.$store.state.locums.loading_locums;
		},
		locumUsers() {
			// return this.$store.state.locums.locumUsers;
			return this.$store.getters["locums/getLocumUsers"];
		},
		itemCount() {
			return this.$store.state.locums.itemCount;
		},
		totalPages() {
			return Math.ceil(this.itemCount / this.params.limit);
		},
		total() {
			return this.locumUsers.length;
		}
	},
	watch: {
		async filterCompliances() {
			const query = {
				...this.$router.query
			};

			query.compliance_status = this.filterCompliances;

			if (this.filterCompliances === "") {
				delete query.compliance_status;
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true;
			}

			this.$router.push({ query });

			const params = {};

			if (this.search) {
				params.search = this.search;
			}

			if (this.filterCompliances) {
				params.compliance_status = this.filterCompliances;
			}

			this.params.compliance_status = this.filterCompliances;

			console.log("qwe", this.params.compliance_status);

			this.getLocums(this.params);
		},
		search(value) {
			this.searchSubmit();
			this.getLocums(this.params);
		},
		sort(value) {
			// for mobile responsive filter
			if (value === "Name") {
				this.sortBy(
					"name",
					this.currentPage,
					this.search,
					this.filterCompliances
				);
			}
			if (value === "Profession") {
				this.sortBy(
					"profession",
					this.currentPage,
					this.search,
					this.filterCompliances
				);
			}
			if (value === "Date signed-up") {
				this.sortBy(
					"created_at",
					this.currentPage,
					this.search,
					this.filterCompliances
				);
			}
			if (value === "Sign-up verified") {
				this.sortBy(
					"email_verified_at",
					this.currentPage,
					this.search,
					this.filterCompliances
				);
			}
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
		getLocums(params) {
			this.$store.dispatch("locums/fetchLocums", {
				limit: this.params.limit,
				search: params.search,
				compliance_status: params.compliance_status,
				order_by: params.order_by,
				offset: params.offset
			});
		},
		async sortBy(sortedBy, page, search, compliance_status) {
			if (this.sortedBy == sortedBy && this.sortType == true) {
				this.params.order_by = "created_at:desc";
				this.sortedBy = "";
			} else {
				this.sortedBy = sortedBy;
				this.sortType = !this.sortType;
				this.params.order_by = await `${sortedBy}:${
					this.sortType ? "asc" : "desc"
				}`;
			}
			let order_by = await this.params.order_by;
			// console.log(order_by);
			let query = {
				...this.$router.query,
				order_by
			};
			if (page === 1) {
				delete query.page;
			}
			if (page) {
				query = { ...this.$router.query, page, order_by };
			}
			if (search) {
				query = { ...this.$router.query, search, order_by };
			}
			if (compliance_status) {
				query = { ...this.$route.query, compliance_status, order_by };
			}
			if (page && search) {
				query = { ...this.$router.query, page, search, order_by };
			}
			if (page && compliance_status) {
				query = { ...this.$router.query, page, compliance_status, order_by };
			}
			if (search && compliance_status) {
				query = { ...this.$router.query, search, compliance_status, order_by };
			}
			if (page && search && compliance_status) {
				query = { ...this.$router.query, page, search, compliance_status };
			}
			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true;
			}
			this.$router.push({ query });

			this.params.search = search;
			this.params.compliance_status = compliance_status;
			this.getLocums(this.params);
		},

		searchSubmit: debounce(function(page, order_by, compliance_status) {
			let search = this.search;

			let query = { ...this.$router.query, search };

			if (page === 1) {
				delete query.page;
			}

			if (page) {
				query = { ...this.$router.query, page, search };
			}
			if (order_by) {
				query = { ...this.$router.query, search, order_by };
			}
			if (compliance_status) {
				query = { ...this.$router.query, search, compliance_status };
			}
			if (page && order_by) {
				query = { ...this.$router.query, page, search, order_by };
			}
			if (page && compliance_status) {
				query = { ...this.$router.query, page, search, compliance_status };
			}
			if (compliance_status && order_by) {
				query = { ...this.$router.query, search, compliance_status, order_by };
			}
			if (page && compliance_status && order_by) {
				query = {
					...this.$router.query,
					page,
					search,
					compliance_status,
					order_by
				};
			}
			if (this.search === "") {
				delete query.search;
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true;
			}

			this.$router.push({ query });
		}, 500),

		statusStyle(status) {
			switch (status) {
				case "Active":
					return "bg-green-500 text-white";
					break;
				case "Inactive":
					return "bg-gray-500 text-gray-700";
					break;
				case "Deactivated":
					return "bg-red-800 text-red-400";
					break;
				case "Suspended":
					return "bg-red-600 text-white";
					break;
				case "Dormant":
					return "bg-orange-500 text-white";
					break;
				default:
					return;
			}
		},

		complianceStatusStyle(status) {
			switch (status) {
				case "Empty":
					return "border border-white text-white";
					break;
				case "Incomplete":
					return "bg-orange-600 text-white";
					break;
				case "Pending":
					return "bg-gray-500 text-gray-800";
					break;
				case "Expiring":
					return "bg-red-400 text-white";
					break;
				case "Expired":
					return "bg-red-800 text-red-400";
					break;
				case "Rejected":
					return "bg-red-600 text-white";
					break;
				case "Compliant":
					return "bg-green-500 text-white";
					break;
				default:
					return;
			}
		},
		usersDeletedHandler(userId) {
			console.log("usersDeletedHandler", userId);
		},
		pagechanged(page) {
			const query = {
				...this.$route.query,
				page: page || 1
			};
			this.params.offset = this.params.limit * (page - 1);
			this.currentPage = page;
			this.getLocums(this.params);
		},
		async limitchanged(limit) {
			this.current_page = 1;
			this.params.limit = limit;
			await this.getLocums(this.params);
		},
		async sorted(order_by) {
			this.current_page = 1;
			this.params.order_by = order_by;
			this.getLocums(this.params);
		}
	}
};
</script>
<style>
.page-button {
	background: linear-gradient(to top, #f2d024, #efde86);
}

.page-button-disabled {
	background: linear-gradient(to top, #6b717e, #6b7386);
	cursor: not-allowed;
}

.page-button:active {
	transform: translate(2px, 2px);
}
</style>
