<template>
  <div>
    <div class="flex items-center px-2 py-2">
      <div class="relative w-full">
        <div>
          <input
            v-model="search"
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Search Practice by Name"
          >
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
        <div class="flex items-center w-full">
          <AppDate
            v-model="practiceParams.practice_invoiceable_date_start"
            class="md:mx-2 text-white"
            :name="'practice_invoiceable_date_start'"
            :label="'From'"
          />
          <AppDate
            v-model="practiceParams.practice_invoiceable_date_end"
            class="md:mx-2 text-white"
            :name="'practice_invoiceable_date_end'"
            :label="'To'"
          />
          <div class="flex flex-col md:justify-center p-1 md:p-2 align-middle text-white leading-none">
            <input 
              id="disputed" 
              v-model="showDisputedJobParts" 
              type="checkbox" 
              value="true"
            >
            <label for="disputed">Show Disputed Invoices</label>
          </div>
          <!-- <AppInput
            v-model="showDisputedJobParts"
            :label="'Show Disputed Invoices'"
            :type="'single-checkbox'"
            class="text-white mx-2"
          />-->
          <AppButton
            class="whitespace-no-wrap"
            :disabled="practiceParams.practice_invoiceable_date_start && practiceParams.practice_invoiceable_date_end ? false : true"
            :label="'Search for Practices'"
            :icon="'search'"
            @click="getBillablePractices()"
          />
          <AppButton
            class="mx-2"
            :disabled="practiceParams.practice_invoiceable_date_start && practiceParams.practice_invoiceable_date_end ? false : true"
            :label="'Generate HUBZZ Invoices'"
            :icon="'add-rectangle'"
            @click="createBulkBilling()"
          />
        </div>
      </div>
    </div>
    <!-- :routerLink="`/billings`" -->
    <AppTable
      v-if="itemCount > 0"
      :total="itemCount"
      :items="getAllPractices"
      :currentPage="currentPage"
      :perPage="practiceParams.limit"
      :columns="columns"
      :loading="loadingPractices"
      :orderBy="practiceParams.order_by"
      :customWidth="200"
      @pagechanged="pagechanged"
      @checkClicked="toggleCheck"
      @sorted="sorted"
    >
      <template v-slot:checker="slotProps">
        <input 
          :id="slotProps.item" 
          v-model="chosenPractices" 
          type="checkbox" 
          :value="slotProps.item"
        >
        <label :for="slotProps.item" />
      </template>

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
        >
          {{ slotProps.item.status }}
        </div>
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
        >
          {{ slotProps.item.hub_type }}
        </div>
      </template>
    </AppTable>
    <template v-else>
      <div
        v-if="!jobPartsParams.approved_at_date_start || !jobPartsParams.approved_at_date_end"
        class="mt-2 w-full text-center text-white"
      >
        Input Job Part Approval / Disputed Dates to see Billable Practices
      </div>
      <div v-else class="mt-2 w-full text-center text-white">
        There are no verified Practices billable.
      </div>
    </template>
    <div
      v-if="
        $route.name.includes('index-billings-id') ||
          $route.name.includes('index-billings-addinvoice')
      "
      class="billing-shield"
      @click="$router.push(`/billings`)"
    />
    <nuxt-child />
  </div>
</template>
<script>
import debounce from "lodash.debounce"
import AppTable from "@/components/Base/AppTable"
import AppDate from "@/components/Base/AppDate"
import AppButton from "@/components/Base/AppButton"
import AppInput from "@/components/Base/AppInput"
export default {
	components: {
		AppTable,
		AppDate,
		AppButton,
		AppInput,
	},
	data () {
		return {
			// for app table
			currentPage: 1,
			search: "",
      showDisputedJobParts: false,
      chosenPractices:[],
			jobPartsParams: {
				approved_at_date_start: null,
				approved_at_date_end: null,
				status: null,
				invoice_status: null,
				locum_invoiceable: null,
        practice_invoiced: false,
        
			},

			practiceParams: {
				id: [],
				limit: 10,
				offset: 0,
				order_by: ["created_at:desc"],
				status: ["Active", "Dormant", "Suspended"],
        verified: true,
        practice_invoiceable_date_start: null,
        practice_invoiceable_date_end: null,
        practice_invoiceable: true,
			},
			loading: false,
			columns: [
				{
					name: "Check",
					dataIndex: "checker",
					class: "text-center",
					slotName: "checker",
					eventName: "checkClicked"
				},
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
		}
	},
	computed: {
		loadingSessions () {
			return this.$store.state.jobs.loading_jobs
		},
		jobParts () {
			return this.$store.state.jobs.practice_billing_sessions
		},
		jobPartCount () {
			return this.$store.state.jobs.practice_billing_sessions_count
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
			return Math.ceil(this.itemCount / this.practiceParams.limit)
		},
		totalPages () {
			return Math.ceil(this.itemCount / this.practiceParams.limit)
		},
		total () {
			return this.getAllPractices.length
		}
	},

	watch: {
		search (value) {
      console.log('search for', value)
			this.searchSubmit()
		},

		$route (to, from) {
			// this.getPractices()
		}
	},
	async created (){
			await this.$store.commit("practices/SET_PRACTICE_COUNT", 0)
			await this.$store.commit("practices/SET_PRACTICES", [])
	},
	// async asyncData ({ app, route, store }) {
	// 	try {
		
	// 		return {
	// 			// itemCount,
	// 			// practices
	// 		}
	// 	} catch (err) {
	// 		// error({ statusCode: 404 })
	// 		console.log("Get practices error!", err)
	// 	}
	// },

	methods: {
		async getJobParts () {
			await this.$store.commit("jobs/TOGGLE_LOADING", true)
			if (this.showDisputedJobParts) {
				this.jobPartsParams.status = ""
				this.jobPartsParams.invoice_status = "Disputed"
				this.jobPartsParams.locum_invoiceable = null
			} else {
				this.jobPartsParams.status = "Approved"
				this.jobPartsParams.invoice_status = null
				this.jobPartsParams.locum_invoiceable = true
			}
			let { page = 1, order_by = [] } = this.$route.query

			page = parseInt(page)

			const createdRoute = this.$route.query
			const limit = 10
			const offset = page * limit - limit
			order_by =
				createdRoute && createdRoute.order_by
					? createdRoute.order_by
					: "date_end:asc"
			let params = {
				...this.filter,
				limit,
				offset,
				order_by
			}

			if (this.showDisputedJobParts) {
				params = {
					completed_at_date_start: this.jobPartsParams.approved_at_date_start,
					completed_at_date_end: this.jobPartsParams.approved_at_date_end,
					invoice_status: ["Disputed", "Issued"],
					limit,
					offset,
					order_by
				}
				console.log("disputed params", params)
			}

			let jobPartCount,
				jobParts = ""

			await this.$axios
				.$get(`/api/v1/admin/job-parts/count`, { params })
				.then(res => {
					jobPartCount = res.data.count
				})

			await this.$store.commit(
				"jobs/SET_HUBZZ_BILLING_SESSIONS_COUNT",
				jobPartCount
			)

			await this.$axios
				.$get(`/api/v1/admin/job-parts`, { params })
				.then(res => {
					console.log("res", res)
					jobParts = res.data.job_parts.map(item => {
						return {
							...item,
							isGp: item.profession.name === "GP" ? "GP" : "Non-GP",
							tag_status: item.terminated ? "Terminated" : item.status,
							date_time_start: `${this.$moment(item.date_start).format(
								"DD-MM-YYYY"
							)} | ${item.time_start}`,
							date_time_end: `${this.$moment(item.date_end).format(
								"DD-MM-YYYY"
							)} | ${item.time_end}`
						}
					})
				})

			console.log("job parts", jobParts)

			// practiceIds = await jobParts.map(jobPart => {
			// 	return jobPart.practice_id
			// })

			this.practiceParams.id = await jobParts.reduce((accumulator, item) => {
        console.log('practice ids', item.practice_id)
				return accumulator.includes(item.practice_id)
					? accumulator
					: [...accumulator, item.practice_id]
			}, [])

			await this.$store.commit("jobs/SET_HUBZZ_BILLING_SESSIONS", jobParts)

			await this.$store.commit("jobs/TOGGLE_LOADING", false)

			await this.getBillablePractices()
		},

		async getBillablePractices () {
			await this.$store.commit("practices/TOGGLE_LOADING", true)
			let { page = 1, search = "", order_by = [] } = this.$route.query
			page = parseInt(page)
			const createdRoute = this.$route.query
			const limit = 10
			const offset = page * limit - limit
			const status = ["Active", "Dormant", "Suspended"]
      // const id = this.practiceParams.id
      const practice_invoiceable_date_start = this.practiceParams.practice_invoiceable_date_start
      const practice_invoiceable_date_end = this.practiceParams.practice_invoiceable_date_end
      const practice_invoiceable = this.practiceParams.practice_invoiceable
			order_by =
				createdRoute && createdRoute.order_by
					? createdRoute.order_by
					: "created_at:desc"
			const params = {
        search, 
        limit, 
        offset, 
        order_by, 
        status, 
        practice_invoiceable_date_start, 
        practice_invoiceable_date_end, 
        practice_invoiceable 
      }
      console.log('params', params)

			let response = await this.$axios.$get(`/api/v1/admin/practices/count`, {
				params
			})
			const itemCount = response.data.count
			await this.$store.commit("practices/SET_PRACTICE_COUNT", itemCount)

			response = await this.$axios.$get(`/api/v1/admin/practices`, { params })
			const practices = response.data.practices
			await this.$store.commit("practices/SET_PRACTICES", practices)
			await this.$store.commit("practices/TOGGLE_LOADING", false)
    },
    
    async createBulkBilling () {
      await this.$store.commit("practices/TOGGLE_LOADING", true)
      const practiceInvoiceDatas = await this.chosenPractices.map((practice) => {
        const items = practice.practice_invoiceable_approved_filtered_job_parts.map((jobPart) => {
          return {
            type: 'Job Part - Invoiced',
            job_part_id: jobPart.id,
            description:
              "Job Number " +
              jobPart.job_part_number +
              " for £" +
              jobPart.practice_rate +
              " from " +
              this.$moment(jobPart.date_start).format('DD/MM/YYYY') +
              " to " +
              this.$moment(jobPart.date_end).format('DD/MM/YYYY'),
            total: jobPart.total,
          }
        })

        const total_amount = items.reduce((total_amount, item) => total_amount + item.total, 0)

        return {
          practice_id: practice.id,
          items,
          date_start: this.practiceParams.practice_invoiceable_date_start,
          date_end: this.practiceParams.practice_invoiceable_date_end,
          total_amount,
        }
      })
      
      await this.$axios.post(`/api/v1/admin/practice-invoices/create-bulk`, {
        practice_invoice_datas: practiceInvoiceDatas
        })
        .then(res => {
          console.log('res',res)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: "Success"
          })
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: err.response.data.message
          })
        })

      console.log('practice invoice datas', practiceInvoiceDatas)
      await this.$store.commit("practices/TOGGLE_LOADING", false)
    },

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

		searchSubmit: debounce(function (page, order_by) {
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

			this.getPractices()

			this.$router.push({ query })
    }, 500),
    
    toggleCheck (item) {
			const index = this.chosenPractices.findIndex(practice => {
				return practice.id === item.id
			})

			if (index > -1) {
				this.chosenPractices.splice(index, 1)
			} else {
				this.chosenPractices.push(item)
      }
      
      console.log('chosen practices', this.chosenPractices)
		},

		getPractices () {
      console.log('params get practices', this.practiceParams)
			this.$store
				.dispatch("practices/fetchPractices", {
					id: this.practiceParams.id,
					limit: this.practiceParams.limit,
					search: this.search,
					order_by: this.practiceParams.order_by,
					offset: this.practiceParams.offset,
          status: this.practiceParams.status,
          practice_invoiceable_date_start: this.practiceParams.practice_invoiceable_date_start, 
          practice_invoiceable_date_end: this.practiceParams.practice_invoiceable_date_end, 
          practice_invoiceable: this.practiceParams.practice_invoiceable,
					verified: this.verified,
					countOnly: true
				})
				.then(() => {
					this.$store.dispatch("practices/fetchPractices", {
						id: this.practiceParams.id,
						limit: this.practiceParams.limit,
						search: this.search,
						order_by: this.practiceParams.order_by,
						offset: this.practiceParams.offset,
            status: this.practiceParams.status,
            practice_invoiceable_date_start: this.practiceParams.practice_invoiceable_date_start, 
            practice_invoiceable_date_end: this.practiceParams.practice_invoiceable_date_end, 
            practice_invoiceable: this.practiceParams.practice_invoiceable,
						verified: this.verified
					})
				})
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
					return "bg-red-500 text-white "
				case "Spoke":
					return "bg-blue-500 text-white"
				case "Stand Alone":
					return "bg-indigo-600 text-white"
				default:
					return
			}
		},

		hubTypeStyle (hubType) {
			switch (hubType) {
				case "Type 1":
					return "bg-red-500 text-white px-4 py-1"
				case "Type 2":
					return "bg-purple-500 text-white px-4 py-1"
				default:
					return
			}
		},

		statusStyle (status) {
			switch (status) {
				case "Active":
					return "bg-green text-white lg:px-10 sm:px-2"
				case "Inactive":
					return "bg-yellow text-black lg:px-10 sm:px-2"
				case "Deactivated":
					return "bg-gray text-black lg:px-10 sm:px-2"
				case "Suspended":
					return "bg-red text-white lg:px-8 sm:px-2"
				case "Dormant":
					return "bg-green-darker text-white lg:px-8 sm:px-2"
				default:
					return
			}
		},

		pagechanged (page) {
			const query = {
				...this.$route.query,
				page: page || 1
			}
			this.practiceParams.offset = this.practiceParams.limit * (page - 1)
			this.currentPage = page
			this.getPractices()
		},

		sorted (order_by) {
			// go back to page 1
			this.currentPage = 1
			let query = {
				...this.$router.query,
				order_by
      }
      console.log('order_by', order_by)
			this.practiceParams.order_by = order_by
			this.getPractices()
		}
	}
}
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
