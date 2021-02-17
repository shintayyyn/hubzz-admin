<template>
  <section v-if="authAdminPermissions.includes('View Hubzz Invoices')">
    <template v-if="$route.name === 'index-billings-index-hubzz-billing'">
      <div class="flex flex-row justify-start">
        <div
          v-if="authAdminPermissions.includes('Create Hubzz Invoices') && !$route.path.includes('bulk-billing')" 
          class="flex justify-start items-center flex-wrap"
        >
          <AppButton
            class="mr-2 mt-1 font-bold"
            :label="$route.name.includes('bulk-billings') ? '+ Bill Individually' : ' + Bill by Bulk'"
            :customTheme="'bg-info text-white'"
            @click="goToTab()"
          />
        </div>

        <div v-if="!$route.path.includes('bulk-billing')" class="w-full text-white w-full md:w-1/2">
          <AppInputSmall
            v-model="search"
            :type="'text'"
            :name="'search'"
            :button="true"
            :buttonLabel="'Search'"
            :placeholder="'Search by Name'"
            @click="searchSubmit()"
          />
        </div>
      </div>
      <AppTableNew
        v-if="itemCount > 0 && !$route.path.includes('bulk-billing')"
        :total="itemCount"
        :items="getAllPractices"
        :currentPage="currentPage"
        :perPage="params.limit"
        :columns="columns"
        :loading="loadingPractices"
        :routerLink="`/billings/hubzz-billing`"
        :orderBy="params.order_by"
        @pagechanged="pagechanged"
        @sorted="sorted"
      >
        <template v-slot:status_slot="slotProps">
          <div
            class="text-xs"
            :class="
              `${
                slotProps.item.status === 'Active'
                  ? 'text-green-500' : 'text-gray-700'
              }`
            "
          >
            {{ slotProps.item.status }}
          </div>
        </template>
        <template v-slot:disputed_slot="slotProps">
          <div
            class="text-xs"
            :class="slotProps.item.practice_invoiceable_disputed_filtered_job_part_count > 0 ? 'text-red-500' : ''"
          >
            {{ slotProps.item.practice_invoiceable_disputed_filtered_job_part_count > 0 ? "Yes, " + slotProps.item.practice_invoiceable_disputed_filtered_job_part_count : "None" }}
          </div>
        </template>
        <template v-slot:type_slot="slotProps">
          <div
            class="text-xs"
            :class="typeStyle(slotProps.item.type)"
          >
            {{ slotProps.item.type }}
          </div>
        </template>
        <template v-slot:hub_type_slot="slotProps">
          <div
            class="text-xs"
            :class="hubTypeStyle(slotProps.item.hub_type)"
          >
            {{ slotProps.item.hub_type }}
          </div>
        </template>
      </AppTableNew>
      <div 
        v-else-if="itemCount <= 0 && !$route.path.includes('bulk-billing')" 
        class="mt-2 w-full text-center text-white"
      >
        There are no verified Practices billable.
      </div>
    </template>
		
    <nuxt-child />
  </section>
</template>
<script>
import debounce from "lodash.debounce"
import AppTableNew from '@/components/Base/AppTableNew'
import AppInputSmall from '@/components/Base/AppInputSmall'
import AppButton from "@/components/Base/AppButton"
export default {
	components: {
		AppButton,
		AppTableNew,
		AppInputSmall,
	},
	data () {
		return {
			// for app table
			currentPage: 1,
      search: "",
			params: {
				limit: 15,
				offset: 0,
        order_by: ["created_at:desc"],
        status: ["Active","Dormant","Account Suspension"],
        verified: true,
			},

			loading: false,
			columns: [
				{
					name: "Practice/Surgery",
					dataIndex: "name",
					sortable: true
				},
				{
					name: "Expires",
					dataIndex: "actived_until",
					class: "text-center localDate",
					sortable: true
        },
        {
          name: "Has Disputed",
          dataIndex: "locum_invoice_disputed_count",
          slotName: "disputed_slot",
          class: "text-center",
          sortable:false,
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
				},
				{
					name: "Sage Ref",
					slot: true,
					dataIndex: "sage_ref",
					class: "text-center"
				}
			]
		}
	},
	computed: {
		authAdminPermissions () {
			return this.$store.getters["permissions"]
    },
		loadingPractices () {
			return this.$store.state.practices.loading_practices
		},
		getAllPractices () {
			return this.$store.getters["practices/getAllPractices"]
		},
		itemCount () {
			return this.$store.state.practices.itemCount
		},
		pageCount () {
			return Math.ceil (this.itemCount / this.params.limit)
		},
		totalPages () {
			return Math.ceil (this.itemCount / this.params.limit)
		},
		total () {
			return this.getAllPractices.length
		}
	},
  
  watch: {
    search () {
			this.searchSubmit()
    },

    $route () {
			this.getPractices()
		},
  },
	async asyncData ({ app, route, store }) {
		try {
			await store.commit("practices/TOGGLE_LOADING", true)
			let { page = 1, search = "", order_by = [] } = route.query
			page = parseInt(page)
			const createdRoute = route.query
			const limit = 15
      const offset = page * limit - limit
			const status = ["Active","Dormant","Account Suspension"]
			// const has_sage_ref = true
			order_by =
				createdRoute && createdRoute.order_by
					? createdRoute.order_by
					: "created_at:desc"
			const params = { limit, offset, order_by, status, search }

			let response = await app.$axios.$get(`/api/v1/admin/practices/count`, { params })
			const itemCount = response.data.count

			await store.commit("practices/SET_PRACTICE_COUNT", itemCount)
			response = await app.$axios.$get(`/api/v1/admin/practices`, { params })
			const practices = response.data.practices
			await store.commit("practices/SET_PRACTICES", practices)

			await store.commit("practices/TOGGLE_LOADING", false)
		} catch (err) {
			// error({ statusCode: 404 })
			console.log("Get practices error!", err)
		}
  },

	methods: {
		goToPage (page) {
			if (page < 1) {
				return
			}

			if (page > this.pageCount) {
				return
			}

			const query = {
				...this.$router.query,
				page
			}

			if (page === 1) {
				delete query.page
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true
			}

			this.$router.push({ query })
		},

		searchSubmit: debounce (async function (page, order_by) {
      console.log('initiate search')
      let search = this.search
      
			let query = {
				...this.$router.query,
				search
			}
			if (page === 1) {
				delete query.page
			}
			if (page && page > 1) {
				query = {
					...this.$router.query,
					page,
					search
				}
			}
			if (order_by) {
				query = {
					...this.$router.query,
					search,
					order_by
				}
			}
			if (page && order_by) {
				query = {
					...this.$router.query,
					page,
					search,
					order_by
				}
			}

			if (this.search === "") {
				delete query.search
			}

			if (this.$router.resolve({ query }).href !== this.$route.fullPath) {
				this.loading = true
      }
      
      await this.$router.push({ query })
      
		}, 1000),

		async getPractices () {
      if(!this.$route.name.includes('bulk-billing')) {
        console.log('get practices')
        await this.$store.dispatch("practices/fetchPractices", {
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
          })
        })
      }
      
		},

		sortData: function (toSortBy) {
			if ((toSortBy = this.sortBy)) {
				this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc"
			}
			this.sortBy = toSortBy
		},

		typeStyle (status) {
			switch (status) {
				case "Hub":
					return "text-red-500"
				case "Spoke":
					return "text-blue-500"
				case "Stand Alone":
					return "text-indigo-600"
				default:
					return
			}
		},

		hubTypeStyle (hubType) {
			switch (hubType) {
				case "Type 1":
					return "text-red-500 "
				case "Type 2":
					return "text-purple-500"
				default:
					return
			}
		},

		pagechanged (page) {
			// const query = {
			// 	...this.$route.query,
			// 	page: page || 1
			// }
			this.params.offset = this.params.limit * (page - 1)
			this.currentPage = page
			this.getPractices()
    },
    
		sorted (order_by) {
			// go back to page 1
			this.currentPage = 1
			// let query = {
			// 	...this.$router.query,
			// 	order_by
			// }
			this.params.order_by = order_by
			this.getPractices()
    },
    
    goToTab () {
			console.log('route', this.$route.name)
			if (this.$route.name.includes('bulk-billings')) {
				this.$router.push(`/billings/hubzz-billing`)
			} else {
				this.$router.push(`/billings/hubzz-billing/bulk-billings`)
			}
		}
	}
}
</script>
<style>
.billing-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
	cursor: pointer;
}
.billing-modal {
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
	.billing-modal {
		width: 80%;
	}
}
.md\:table-cell:first-child {
	border-top-left-radius: 10px;
	border-bottom-left-radius: 10px;
}
.md\:table-cell:last-child {
	border-top-right-radius: 10px;
	border-bottom-right-radius: 10px;
}
</style>