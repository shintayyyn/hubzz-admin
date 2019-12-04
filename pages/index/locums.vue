<template>
	<div class="flex-1 flex flex-col py-2 px-4 md:px-6 overflow-y-auto">
		<div>
			<AppLoading :loading="loadingLocums" :message="'Loading Locums'" />
		</div>
		<div class="text-xl md:text-4xl text-white">Locums</div>
		<div class="flex flex-col md:flex-row justify-between">
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
				<!-- <button class="rounded-lg text-sm text-white p-2 mx-2 hover:text-black hover:bg-yellow-500 focus:outline-none" @click="searchSubmit(currentPage,order_by,filterCompliances)">Go</button> -->
			</div>
			<!-- FILTER SELECTS -->
			<div class="flex w-full justify-end">
				<div
					class="w-1/2 md:w-full relative flex flex-col md:flex-row justify-end md:items-center md:items-end py-2 pr-2 md:p-2 md:py-0"
				>
					<label class="text-sm text-white md:pr-2"
						>Filter by Compliance Status</label
					>
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
					class="w-1/2 relative md:hidden flex flex-col justify-end md:flex-row md:items-center md:items-end py-2  md:p-2 md:py-0"
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
			<!-- FILTER SELECTS END HERE -->
		</div>
		<div class="w-full" style="min-height: 70vh">
			<div
				class="hidden md:flex items-center text-white justify-around font-semibold"
			>
				<div
					class="align-middle px-2 w-1/6 cursor-pointer"
					@click="sortBy('name', currentPage, search, filterCompliances)"
				>
					Name
					<svgicon
						v-if="sortedBy != 'name'"
						class="inline align-baseline"
						name="sort"
						height="12"
						width="12"
						color="white black"
					/>
					<svgicon
						v-if="sortType == true && sortedBy == 'name'"
						class="inline align-baseline"
						name="sort-ascend"
						height="12"
						width="12"
						color="white"
					/>
					<svgicon
						v-if="sortType == false && sortedBy == 'name'"
						class="inline align-baseline"
						name="sort-descend"
						height="12"
						width="12"
						color="white"
					/>
				</div>
				<div
					class="align-middle px-2 text-center w-1/6 cursor-pointer"
					@click="sortBy('profession', currentPage, search, filterCompliances)"
				>
					Profession
					<svgicon
						v-if="sortedBy != 'profession'"
						class="inline align-baseline"
						name="sort"
						height="12"
						width="12"
						color="white black"
					/>
					<svgicon
						v-if="sortType == true && sortedBy == 'profession'"
						class="inline align-baseline"
						name="sort-ascend"
						height="12"
						width="12"
						color="white"
					/>
					<svgicon
						v-if="sortType == false && sortedBy == 'profession'"
						class="inline align-baseline"
						name="sort-descend"
						height="12"
						width="12"
						color="white"
					/>
				</div>
				<div
					class="align-middle px-2 text-center w-1/6 cursor-pointer"
					@click="sortBy('created_at', currentPage, search, filterCompliances)"
				>
					Date signed-up
					<svgicon
						v-if="sortedBy != 'created_at'"
						class="inline align-baseline"
						name="sort"
						height="12"
						width="12"
						color="white black"
					/>
					<svgicon
						v-if="sortType == true && sortedBy == 'created_at'"
						class="inline align-baseline"
						name="sort-ascend"
						height="12"
						width="12"
						color="white"
					/>
					<svgicon
						v-if="sortType == false && sortedBy == 'created_at'"
						class="inline align-baseline"
						name="sort-descend"
						height="12"
						width="12"
						color="white"
					/>
				</div>
				<div
					class="align-middle px-2 text-center w-1/6 cursor-pointer"
					@click="
						sortBy('email_verified_at', currentPage, search, filterCompliances)
					"
				>
					Sign-up verified
					<svgicon
						v-if="sortedBy != 'email_verified_at'"
						class="inline align-baseline"
						name="sort"
						height="12"
						width="12"
						color="white black"
					/>
					<svgicon
						v-if="sortType == true && sortedBy == 'email_verified_at'"
						class="inline align-baseline"
						name="sort-ascend"
						height="12"
						width="12"
						color="white"
					/>
					<svgicon
						v-if="sortType == false && sortedBy == 'email_verified_at'"
						class="inline align-baseline"
						name="sort-descend"
						height="12"
						width="12"
						color="white"
					/>
				</div>
				<div class="align-middle px-2 text-center w-1/6">Status</div>
				<div class="align-middle px-2 text-center w-1/6">Compliance Status</div>
			</div>
			<div
				v-if="locumUsers.length === 0"
				class="text-gray-500 leading-tight text-center py-4"
			>
				No results found for {{ search }}<br />Try another keyword
			</div>
			<nuxt-link
				v-for="(locumUser, index) in locumUsers"
				:key="`locumUser-${index}`"
				:to="{ path: `/locums/${locumUser.id}`, query: $route.query }"
				class="flex flex-col cursor-pointer md:flex-row px-2 md:px-0 py-2 my-2 rounded-lg border-l-8 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo hover:bg-waterloo-light transition-hover"
			>
				<div
					class="flex flex-col md:justify-center md:w-1/6 p-1 md:p-2 align-middle leading-none"
				>
					<strong class="block md:hidden text-xs uppercase">Name</strong>
					<span class="">{{
						locumUser.personal_detail ? locumUser.personal_detail.name : null
					}}</span>
				</div>
				<div
					class="flex flex-col md:justify-center md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center"
				>
					<strong class="block md:hidden text-xs uppercase">Profession</strong>
					<span class="">{{
						locumUser.locum_detail && locumUser.locum_detail.profession
							? locumUser.locum_detail.profession.name
							: null
					}}</span>
				</div>
				<div
					class="flex flex-col md:justify-center md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center"
				>
					<strong class="block md:hidden text-xs uppercase"
						>Date signed-up</strong
					>
					<span class="">{{
						$moment(locumUser.created_at).format("MMM D, YYYY")
					}}</span>
				</div>
				<div
					class="flex flex-col md:justify-center md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center"
				>
					<strong class="block md:hidden text-xs uppercase"
						>Sign-up verified</strong
					>
					<span class="">{{
						locumUser.email_verified_at
							? $moment(locumUser.email_verified_at).format("MMM D, YYYY")
							: "Not yet verified"
					}}</span>
				</div>
				<div
					class="flex flex-col md:justify-center md:items-center md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center"
				>
					<strong class="block md:hidden text-xs uppercase">Status</strong>
					<span
						class="inline-flex justify-center text-black text-sm py-2 p-3 md:mx-4 rounded-full shadow lg:px-8 sm:px-2 w-32 min-w-0 my-1"
						:class="statusStyle(locumUser.status)"
						>{{ locumUser.status }}</span
					>
				</div>
				<div
					class="flex flex-col md:justify-center md:items-center md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center"
				>
					<strong class="block md:hidden text-xs uppercase"
						>Compliance Status</strong
					>
					<span
						class="inline-flex justify-center text-black text-sm py-2 p-3 md:mx-4 rounded-full shadow lg:px-8 sm:px-2 w-32 min-w-0 my-1"
						:class="complianceStatusStyle(locumUser.compliance_status)"
						>{{ locumUser.compliance_status }}</span
					>
				</div>
			</nuxt-link>
		</div>
		<!-- PAGINATION -->
		<AppPagination
			:total="total"
			:totalPages="totalPages"
			:currentPage="currentPage"
			@pagechanged="pagechanged"
		/>
		<!-- <div
			class="flex justify-center items-center my-2"
		>
			<button
				class="relative p-4 md:py-2 mx-1 rounded-lg font-bold text-sm text-black hover:bg-waterloo-light focus:outline-none"
				@click="goToPage(currentPage - 1, search, order_by, filterCompliances)"
				:class="
					`${
						currentPage == totalPages
							? 'text-gray-500 page-button-disabled'
							: 'page-button'
					}`
				"
			>
				<span class="hidden md:block">Prev</span>
				<span class="md:hidden absolute mx-1 my-1 left-0 top-0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						class="fill-current"
					>
						<path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z" />
					</svg>
				</span>
			</button>

			<button
				class="page-button p-2 px-4 mx-1 rounded-lg font-bold text-sm text-black hover:bg-waterloo-light focus:outline-none"
				:class="`${currentPage === page ? 'text-black' : ''}`"
				v-for="page in totalPages"
				v-if="showPage(page)"
				:key="`page-${page}`"
				@click="goToPage(page, search, order_by, filterCompliances)"
			>
				{{ page }}
			</button>

			<button
				class="relative p-4 md:py-2 mx-1 rounded-lg font-bold text-sm hover:bg-waterloo-light focus:outline-none"
				@click="goToPage(currentPage + 1, search, order_by, filterCompliances)"
				:class="
					`${
						currentPage == totalPages
							? 'text-gray-500 page-button-disabled'
							: 'page-button'
					}`
				"
			>
				<span class="hidden md:block">Next</span>
				<span class="md:hidden absolute mx-1 my-1 left-0 top-0">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						class="fill-current"
					>
						<path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
					</svg>
				</span>
			</button>
		</div> -->
		<!-- PAGINATION ENDS HERE -->
		<div
			class="locum-shield"
			v-if="$route.name.includes('index-locums-id')"
			@click="$router.push('/locums')"
		></div>
		<nuxt-child />
	</div>
</template>

<script>
import debounce from "lodash.debounce";
import AppLoading from "@/components/Base/AppLoading";
import AppPagination from "@/components/Base/AppPagination";

export default {
	components: {
		AppLoading,
		AppPagination
	},
	data() {
		return {
			itemsPerPage: 8,
			currentPage: 1,

			filterCompliances: "",
			search: "",
			paramSort: {
				order_by: ""
			},
			sort: "",
			sortedBy: "",
			sortType: "",
			order_by: "",
			name: true,
			profession: true,
			created_at: true,
			email_verified_at: true
		};
	},
	watchQuery: ["page", "search", "compliance_status"],
	async asyncData({ app, store, route, error }) {
		try {
			await store.commit("locums/TOGGLE_LOADING", true);
			let {
				page = 1,
				search = "",
				order_by = "",
				compliance_status = null
			} = route.query;

			if (!compliance_status) {
			}
			page = parseInt(page);
			const createdRoute = route.query;
			const limit = 8;
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
				{
					params
				}
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
				itemsPerPage: limit,
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
			return this.$store.state.locums.locumUsers;
		},
		itemCount() {
			return this.$store.state.locums.itemCount;
		},
		totalPages() {
			return Math.ceil(this.itemCount / this.itemsPerPage);
		},
		showPage() {
			return page => {
				if (page === 1) {
					return true;
				}

				if (page === this.totalPages) {
					return true;
				}

				if (page === this.currentPage) {
					return true;
				}

				if (page === this.currentPage + 1) {
					return true;
				}

				if (page === this.currentPage - 1) {
					return true;
				}

				if (this.currentPage === 1 && page < 5) {
					return true;
				}

				if (
					this.currentPage === this.totalPages &&
					page > this.totalPages - 4
				) {
					return true;
				}

				if (this.currentPage === 2 && page === 4) {
					return true;
				}

				if (
					this.currentPage === this.totalPages - 1 &&
					page === this.totalPages - 3
				) {
					return true;
				}

				return false;
			};
		},
		total() {
			return this.locumUsers.lengths;
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

			return;

			const params = {};

			if (this.search) {
				params.search = this.search;
			}

			if (this.filterCompliances) {
				params.compliance_status = this.filterCompliances;
			}

			this.paramSort.compliance_status = this.filterCompliances;

			this.getLocums(this.paramSort);
		},
		search(value) {
			this.searchSubmit();
			this.getLocums(this.paramSort);
		},
		sort(value) {
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
			const offset = parseInt(query.page) * 8 - 8;
			return offset;
		},
		getLocums(params) {
			this.$store.dispatch("locums/fetchLocums", {
				limit: 8,
				search: params.search,
				compliance_status: params.compliance_status,
				order_by: params.order_by,
				offset: this.getQuery()
			});
		},
		async sortBy(sortedBy, page, search, compliance_status) {
			if (this.sortedBy == sortedBy && this.sortType == true) {
				this.paramSort.order_by = "created_at:desc";
				this.sortedBy = "";
			} else {
				this.sortedBy = sortedBy;
				this.sortType = !this.sortType;
				this.paramSort.order_by = await `${sortedBy}:${
					this.sortType ? "asc" : "desc"
				}`;
			}
			let order_by = await this.paramSort.order_by;
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

			this.paramSort.search = search;
			this.paramSort.compliance_status = compliance_status;
			this.getLocums(this.paramSort);
		},
		goToPage(page, search, order_by, compliance_status) {
			if (page < 1) {
				return;
			}

			if (page > this.totalPages) {
				return;
			}

			let query = { ...this.$router.query, page };

			if (search) {
				query = { ...this.$router.query, page, search };
			}
			if (order_by) {
				query = { ...this.$router.query, page, order_by };
			}
			if (compliance_status) {
				query = { ...this.$router.query, page, compliance_status };
			}

			if (search && order_by) {
				query = { ...this.$router.query, page, search, order_by };
			}

			if (search && compliance_status) {
				query = { ...this.$router.query, page, search, compliance_status };
			}

			if (order_by && compliance_status) {
				query = { ...this.$router.query, page, order_by, compliance_status };
			}

			if (search && order_by && compliance_status) {
				query = {
					...this.$router.query,
					page,
					search,
					order_by,
					compliance_status
				};
			}

			if (page === 1) {
				delete query.page;
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true;
			}

			this.$router.push({ query });
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
		pagechanged(e) {
			const query = {
				...this.$route.query,
				page: e || 1
			};
			this.$router.push({ query });
			this.getLocums(this.paramSort);
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
