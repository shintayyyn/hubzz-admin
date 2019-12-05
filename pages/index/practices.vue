<template>
	<div class="flex-1 flex flex-col py-2 px-4 md:px-6 overflow-y-auto">
		<!-- <AppLoading :loading="loadingPractices" :message="'Loading Practices'" /> -->
		<div class="text-xl md:text-4xl text-white">Practices</div>
		<div class="flex justify-between items-center flex-wrap">
			<div class="flex items-center py-2">
				<div class="relative">
					<input
						class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
						placeholder="Search Practice by Name"
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
				<!-- <button class="rounded-lg text-sm text-white p-2 mx-2 hover:text-black hover:bg-yellow-500 focus:outline-none" @click="searchSubmit">Go</button> -->
			</div>
			<div>
				<button
					v-if="
						authAdminPermissions.includes('Add Practice') &&
							authAdminPermissions.includes('Add Practice User')
					"
					@click="show()"
					class="inline-flex no-underline py-2 px-4 md:my-2 bg-sunglow text-sm font-semibold text-black rounded-lg shadow md:float-right"
				>
					Add Practice
				</button>
			</div>
			<div
				class="w-1/2 relative md:hidden flex flex-col justify-end md:items-end pb-2"
			>
				<label class="text-sm text-white md:pr-2">Sort by</label>
				<select
					v-model="sort"
					class="w-full md:w-auto outline-none rounded-lg border-2 border-transparent text-sm text-white p-1 pr-6 focus:hubzz-yellow bg-waterloo"
				>
					<option value selected>All</option>
					<option>Practice Name</option>
					<option>Practice Code</option>
					<option>Created</option>
					<option>Expires</option>
					<option>Status</option>
					<option>Type</option>
				</select>
			</div>
		</div>

		<AppTable
			v-if="itemCount > 0"
			:total="itemCount"
			:items="getAllPractices"
			:currentPage="currentPage"
			:perPage="itemsPerPage"
			:columns="columns"
			:loading="loadingPractices"
			:routerLink="`/practices`"
			:orderBy="paramSort.order_by"
			@pagechanged="pagechanged"
			@limitchanged="limitchanged"
			@sorted="sorted"
		>
			<template v-slot:status_slot="slotProps">
				<div
					class="px-4 py-1 rounded-full w-32 text-center"
					:class="
						`${
							slotProps.item.status === 'Active'
								? 'bg-green-500'
								: 'bg-gray-500 text-gray-700'
						}`
					"
				>
					{{ slotProps.item.status }}
				</div>
			</template>
			<template v-slot:type_slot="slotProps">
				<div
					class="rounded-full text-center"
					:class="typeStyle(slotProps.item.type)"
				>
					{{ slotProps.item.type }}
				</div>
			</template>
		</AppTable>
    <!-- <div class="flex flex-col md:justify-center md:items-center sm:w-1/2 md:w-1/6 p-1 md:p-2 align-middle leading-none md:text-center">
      <strong class="block md:hidden text-xs uppercase pb-1">Type</strong>
      <span class="inline-flex justify-center no-underline px-4 py-2 w-32 min-w-0 text-sm rounded-full shadow whitespace-no-wrap"
      :class="typeStyle(practice.type)">{{ !practice.hub_type || practice.hub_type !== 'Type 2' ? practice.type : 'Hub - Health Board'}}
      </span>
    </div> -->
		<template v-else>
			<div class="mt-2 w-full text-center text-white">
				There are no registered practices.
			</div>
		</template>

		<!-- END TABLE -->

		<div
			class="practice-shield"
			v-if="$route.name.includes('index-practices-id') || modal == true"
			@click="modal ? (modal = false) : $router.push('/practices')"
		></div>
		<transition name="slide" mode="out-in">
			<div class="practice-modal shadow-lg" v-if="modal">
				<AddPracticeSurgery @close="modal = false" />
			</div>
		</transition>
		<nuxt-child />
	</div>
</template>

<script>
import debounce from "lodash.debounce";
import AddPracticeSurgery from "@/components/Practices/AddPracticeSurgery";
import AppLoading from "@/components/Base/AppLoading";
import AppPagination from "@/components/Base/AppPagination";
import AppTable from "@/components/Base/AppTable";
export default {
	components: {
		AddPracticeSurgery,
		AppLoading,
		AppPagination,
		AppTable
	},
	data() {
		return {
			loading: false,
			itemsPerPage: 10,
			// itemCount: 0,
			currentPage: 1,
			// practices: [],

			search: "",
			paramSort: {
				order_by: []
			},
			sort: "",
			sortedBy: "",
			sortType: "",
			order_by: "",
			practice_name: true,
			created_at: true,
			actived_until: true,
			status: true,
			modal: false,

			//app table columns
			columns: [
				{
					name: "Practice Name",
					dataIndex: "practice_name",
					sortable: true
				},
				{
					name: "Practice Code",
					dataIndex: "practice_code",
					class: "text-center",
					sortable: true
				},
				{
					name: "Created",
					dataIndex: "created_at",
					class: "text-center localDate",
					sortable: true
				},
				{
					name: "Expires",
					dataIndex: "actived_until",
					class: "text-center localDate",
					sortable: true
				},
				{
					name: "Status",
					slot: true,
					dataIndex: "status",
					class: "text-center",
					slotName: "status_slot",
					sortable: true
				},
				{
					name: "Type",
					slot: true,
					dataIndex: "practice_type",
					class: "text-center",
					slotName: "type_slot",
					sortable: true
				}
			]
		};
	},

	watchQuery: ["page", "search"],

	async asyncData({ app, store, route }) {
		try {
			await store.commit("practices/TOGGLE_LOADING", true);
			let { page = 1, search = "", order_by = "" } = route.query;
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

			const getPracticesCountPromise = app.$axios.$get(
				`/api/v1/admin/practices/count`,
				{ params }
			);
			const getPracticesPromise = app.$axios.$get(`/api/v1/admin/practices`, {
				params
			});

			let response = null;

			response = await getPracticesCountPromise;
			const itemCount = response.data.count;

			response = await getPracticesPromise;
			const practices = response.data.practices;

			await store.commit("practices/SET_PRACTICE_COUNT", itemCount);
			await store.commit("practices/SET_PRACTICES", practices);
			await store.commit("practices/TOGGLE_LOADING", false);
			return {
				loading: false,
				itemsPerPage: limit,
				// itemCount,
				currentPage: page,
				// practices,
				search,
				order_by
			};
		} catch (err) {
			store.commit("SET_NOTIFICATION", {
				enabled: true,
				status: "danger",
				text: "Something went wrong!"
			});
			console.log("Get practices error!", err);
		}
	},

	computed: {
		loadingPractices() {
			return this.$store.state.practices.loading_practices;
		},
		getAllPractices() {
			return this.$store.getters["practices/getAllPractices"];
		},
		itemCount() {
			return this.$store.state.practices.itemCount;
		},
		pageCount() {
			return Math.ceil(this.itemCount / this.itemsPerPage);
		},
		authAdminPermissions() {
			return this.$store.getters["auth/permissions"];
		},
		totalPages() {
			return Math.ceil(this.itemCount / this.itemsPerPage);
		},
		total() {
			return this.getAllPractices.length;
		}
	},

	watch: {
		$route(to, from) {
			this.currentPage = parseInt(to.query.page);
			this.getPractices();
		},
		search(value) {
			this.searchSubmit();
		},
		sort(value) {
			if (value === "Practice Name") {
				this.sortBy("practice_name", this.currentPage, this.search);
			}
			if (value === "Practice Code") {
				this.sortBy("practice_code", this.currentPage, this.search);
			}
			if (value === "Created") {
				this.sortBy("created_at", this.currentPage, this.search);
			}
			if (value === "Expires") {
				this.sortBy("actived_until", this.currentPage, this.search);
			}
			if (value === "Status") {
				this.sortBy("status", this.currentPage, this.search);
			}
			if (value === "Type") {
				this.sortBy("practice_type", this.currentPage, this.search);
			}
		}
	},

	methods: {
		show() {
			this.modal = true;
		},

		getQuery() {
			const query = {
				...this.$route.query
			};
			const offset =
				parseInt(query.page) * this.itemsPerPage - this.itemsPerPage;
			return offset;
		},

		getPractices() {
			this.$store.dispatch("practices/fetchPractices", {
				limit: this.itemsPerPage,
				search: this.search,
				order_by: this.paramSort.order_by,
				offset: this.getQuery()
			});
		},

		async sortBy(sortedBy, page, search) {
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
			let query = {
				...this.$router.query,
				order_by
			};
			if (page === 1) {
				delete query.page;
			}
			if (page) {
				query = {
					...this.$router.query,
					page,
					order_by
				};
			}
			if (search) {
				query = {
					...this.$router.query,
					search,
					order_by
				};
			}
			if (page & search) {
				query = {
					...this.$router.query,
					page,
					search,
					order_by
				};
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true;
			}
			this.$router.push({ query });
			this.getPractices();
		},
		searchSubmit: debounce(function(page, order_by) {
			let search = this.search;
			let query = {
				...this.$router.query,
				search
			};
			if (page === 1) {
				delete query.page;
			}
			if (page && page > 1) {
				query = {
					...this.$router.query,
					page,
					search
				};
			}
			if (order_by) {
				query = {
					...this.$router.query,
					search,
					order_by
				};
			}
			if (page && order_by) {
				query = {
					...this.$router.query,
					page,
					search,
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

		typeStyle(status) {
			switch (status) {
				case "Hub":
					return "bg-red-500 text-white px-4 py-1 w-32";
					break;
				case "Spoke":
					return "bg-blue-500 text-white px-4 py-1 w-32";
					break;
				case "Stand Alone":
					return "bg-indigo-600 text-white px-6 md:px-5 py-1";
					break;
				default:
					return;
			}
		},
		pagechanged(e) {
			const query = {
				...this.$route.query,
				page: e || 1
			};
			this.$router.push({ query });
			this.getPractices(this.paramSort);
		},
		async limitchanged(limit) {
			this.currentPage = 1;
			this.itemsPerPage = limit;
			await this.getPractices(this.paramSort);
		},
		sorted(order_by) {
			this.currentPage = 1;
			this.paramSort.order_by = order_by;
			this.getPractices(this.paramSort);
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
.card {
	min-width: 100px;
	height: 250px;
	box-sizing: content-box;
}
.practice-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
.practice-modal {
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
	.practice-modal {
		width: 80%;
	}
}
</style>
