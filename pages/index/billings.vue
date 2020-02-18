<template>
	<div class="flex-1 flex flex-col py-2 px-2 md:px-6 overflow-auto">
		<div class="px-2 text-2xl md:text-4xl text-white">Billing</div>

    <div class="flex items-center px-2 py-2">
			<div class="relative">
				<input
					class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
					placeholder="Search Practice by Name"
					v-model="search"
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
		<AppTable
			v-if="itemCount > 0"
			:total="itemCount"
			:items="getAllPractices"
			:currentPage="currentPage"
			:perPage="params.limit"
			:columns="columns"
			:loading="loadingPractices"
			:routerLink="`/billings`"
			:orderBy="params.order_by"
			:customWidth="200"
			@pagechanged="pagechanged"
			@sorted="sorted"
		>
			<template v-slot:status_slot="slotProps">
				<div
					class="px-4 py-1 rounded-full text-center w-32 md:mx-auto mt-1 md:mt-0"
					:class="
						`${
							slotProps.item.status === 'Active'
								? 'bg-green-500'
								: 'bg-gray-500 text-gray-700'
						}`
					"
				>{{ slotProps.item.status }}</div>
			</template>
			<template v-slot:type_slot="slotProps">
				<div
					class="px-4 py-1 rounded-full text-center w-32 md:mx-auto mt-1 md:mt-0"
					:class="typeStyle(slotProps.item.type)"
				>{{ slotProps.item.type }}</div>
			</template>
			<template v-slot:hub_type_slot="slotProps">
				<div
					class="px-4 py-1 rounded-full text-center w-32 md:mx-auto mt-1 md:mt-0"
					:class="hubTypeStyle(slotProps.item.hub_type)"
				>{{ slotProps.item.hub_type }}</div>
			</template>
		</AppTable>
    <template v-else>
				<div class="mt-2 w-full text-center text-white">There are no verified Practices billable.</div>
			</template>
		<div
			class="billing-shield"
			v-if="
				$route.name.includes('index-billings-id') ||
					$route.name.includes('index-billings-addinvoice')
			"
			@click="$router.push(`/billings`)"
		></div>
		<nuxt-child />
	</div>
</template>

<script>
import debounce from "lodash.debounce";
import AppTable from "@/components/Base/AppTable";
export default {
	components: {
		AppTable,
	},
	data() {
		return {
			// for app table
			currentPage: 1,
      search: "",
			params: {
				limit: 10,
				offset: 0,
        order_by: ["created_at:desc"],
        status: ["Active","Dormant","Suspended"],
        verified: true,
			},

			loading: false,
			columns: [
				{
					name: "Practice/Surgery",
					dataIndex: "practice_name",
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
					dataIndex: "type",
					class: "text-center",
					slotName: "type_slot",
					sortable: true
				},
				{
					name: "Hub Type",
					slot: true,
					dataIndex: "hub_type",
					slotName: "hub_type_slot",
					class: "text-center"
				}
			]
		};
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
			return Math.ceil(this.itemCount / this.params.limit);
		},
		totalPages() {
			return Math.ceil(this.itemCount / this.params.limit);
		},
		total() {
			return this.getAllPractices.length;
		}
	},
	async asyncData({ app, route, store }) {
		try {
			await store.commit("practices/TOGGLE_LOADING", true);
			let { page = 1, search = "", order_by = [] } = route.query;
			page = parseInt(page);
			const createdRoute = route.query;
			const limit = 10;
      const offset = page * limit - limit;
      const status = ["Active","Dormant","Suspended"]
			order_by =
				createdRoute && createdRoute.order_by
					? createdRoute.order_by
					: "created_at:desc";
			const params = { limit, offset, order_by, status };
			let response = await app.$axios.$get(`/api/v1/admin/practices/count`, { params });
			const itemCount = response.data.count;
			await store.commit("practices/SET_PRACTICE_COUNT", itemCount);

			response = await app.$axios.$get(`/api/v1/admin/practices`, { params });
			const practices = response.data.practices;
			await store.commit("practices/SET_PRACTICES", practices);
			await store.commit("practices/TOGGLE_LOADING", false);
			return {
				// itemCount,
				// practices
			};
		} catch (err) {
			// error({ statusCode: 404 });
			console.log("Get practices error!", err);
		}
  },
  
  watch: {
    search(value) {
			this.searchSubmit();
    },

    $route(to, from) {
			this.getPractices();
		},
  },

	methods: {
		goToPage(page) {
			if (page < 1) {
				return;
			}

			if (page > this.pageCount) {
				return;
			}

			const query = {
				...this.$router.query,
				page
			};

			if (page === 1) {
				delete query.page;
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true;
			}

			this.$router.push({ query });
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

      this.getPractices();
      
      this.$router.push({ query });
      
		}, 500),

		getPractices() {
      console.log('params', this.params)
      this.$store.dispatch("practices/fetchPractices", {
				limit: this.params.limit,
				search: this.search,
				order_by: this.params.order_by,
				offset: this.params.offset,
        status: this.params.status,
        verified: this.verified,
        countOnly: true
      }).then(() => {
        this.$store.dispatch("practices/fetchPractices", {
          limit: this.params.limit,
          search: this.search,
          order_by: this.params.order_by,
          offset: this.params.offset,
          status: this.params.status,
          verified: this.verified,
        });
      })
		},

		sortData: function(toSortBy) {
			if ((toSortBy = this.sortBy)) {
				this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
			}
			this.sortBy = toSortBy;
		},

		typeStyle(status) {
			switch (status) {
				case "Hub":
					return "bg-red-500 text-white ";
					break;
				case "Spoke":
					return "bg-blue-500 text-white";
					break;
				case "Stand Alone":
					return "bg-indigo-600 text-white";
					break;
				default:
					return;
			}
		},

		hubTypeStyle(hubType) {
			switch (hubType) {
				case "Type 1":
					return "bg-red-500 text-white px-4 py-1";
					break;
				case "Type 2":
					return "bg-purple-500 text-white px-4 py-1";
				default:
					return;
			}
		},

		statusStyle(status) {
			switch (status) {
				case "Active":
					return "bg-green text-white lg:px-10 sm:px-2";
					break;
				case "Inactive":
					return "bg-yellow text-black lg:px-10 sm:px-2";
					break;
				case "Deactivated":
					return "bg-gray text-black lg:px-10 sm:px-2";
					break;
				case "Suspended":
					return "bg-red text-white lg:px-8 sm:px-2";
					break;
				case "Dormant":
					return "bg-green-darker text-white lg:px-8 sm:px-2";
					break;
				default:
					return;
			}
		},

		pagechanged(page) {
			const query = {
				...this.$route.query,
				page: page || 1
			};
			this.params.offset = this.params.limit * (page - 1);
			this.currentPage = page;
			this.getPractices();
    },
    
		sorted(order_by) {
			// go back to page 1
			this.currentPage = 1;
			let query = {
				...this.$router.query,
				order_by
			};
			this.params.order_by = order_by;
			this.getPractices();
		}
	}
};
</script>

<style>
.md\:table-cell:first-child {
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
}
.md\:table-cell:last-child {
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
}
</style>
