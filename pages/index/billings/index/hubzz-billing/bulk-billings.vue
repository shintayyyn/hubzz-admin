<template>
  <div>
    <div class="flex items-center px-2 py-2">
      <div class="relative w-full">
        <div class="flex items-center w-full">
          <AppDate
            v-model="invoiceableDateStart"
            class="md:mx-2 text-white"
            :name="'practice_invoiceable_date_start'"
            :label="'From'"
          />
          <AppDate
            v-model="invoiceableDateEnd"
            class="md:mx-2 text-white"
            :name="'practice_invoiceable_date_end'"
            :label="'To'"
            :isAfterDate="invoiceableDateStart"
          />
          
          <!-- <div class="flex flex-col md:justify-center p-1 md:p-2 align-middle text-white leading-none">
            <input 
              id="disputed" 
              v-model="showDisputedJobParts" 
              type="checkbox" 
              value="true"
            >
            <label for="disputed">Show Disputed Invoices</label>
          </div> -->
          <!-- <AppInput
            v-model="showDisputedJobParts"
            :label="'Show Disputed Invoices'"
            :type="'single-checkbox'"
            class="text-white mx-2"
          />-->
          <AppButton
            class="whitespace-no-wrap"
            :disabled="invoiceableDateStart && invoiceableDateEnd ? false : true"
            :label="'Search for Practices'"
            :icon="'search'"
            @click="getBillablePractices()"
          />
          <!-- <AppButton
            class="mx-2"
            :disabled="practiceParams.practice_invoiceable_date_start 
              && practiceParams.practice_invoiceable_date_end
              && chosenPractices.length > 0  
              ? false : true"
            :label="'Generate HUBZZ Invoices'"
            :icon="'add-rectangle'"
            @click="showPaidModal = true"
          /> -->
          <AppButton
            class="mx-2"
            :disabled="practiceParams.practice_invoiceable_date_start 
              && practiceParams.practice_invoiceable_date_end
              && chosenPractices.length > 0  
              ? false : true"
            :label="'Generate HUBZZ Invoices'"
            :icon="'add-rectangle'"
            @click="processBulkBilling()"
          />
        </div>
        <div
          v-if="practiceParams.practice_invoiceable_date_start && practiceParams.practice_invoiceable_date_end" 
          class="flex text-white"
        >
          <AppInput
            v-model="search"
            :name="'search'"
            :type="'text'"
            :label="'Filter Invoiceable Practices by Name'"
          />
          <!-- <input
            v-model="search"
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Search Practice by Name"
          > -->
          <!-- <button
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
          </button> -->
        </div>
      </div>
    </div>
    <!-- :routerLink="`/billings`" -->
    <AppTable
      v-if="itemCount > 0"
      :total="itemCount"
      :items="allPractices"
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
        >
          {{ slotProps.item.type }}
        </div>
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
        v-if="!practiceParams.practice_invoiceable_date_start && !practiceParams.practice_invoiceable_date_end"
        class="mt-2 w-full text-center text-white"
      >
        Input Job Part Approval / Disputed Dates to see Billable Practices
      </div>
      <div 
        v-else-if="practiceParams.practice_invoiceable_date_start && practiceParams.practice_invoiceable_date_end && itemCount === 0 "
        class="mt-2 w-full text-center text-white">
        {{ searchMessage }}
      </div>
    </template>
    
    <!-- TO PAID CONFIRM CANCEL -->
    <transition name="fade" mode="out-in">
      <div v-if="showPaidModal == true" class="mark-paid-modal overflow-hidden">
        <transition name="drop" mode="out-in">
          <AppDateToggled 
            v-model="dueDate" 
            class="m-4 text-white" 
            :name="'due_date'" 
            :label="'Due Date'" 
            is-after 
          />
        </transition>
        <div class="flex flex-col w-full text-white px-8 justify-between">
          <div class="flex flex-row mb-4">
            <div
              class="p-2 px-4 my-2 mr-2 rounded-lg bg-green-500 hover:bg-green-600 cursor-pointer"
              @click="createBulkBilling()"
            >
              Confirm
            </div>
            <div
              class="p-2 px-4 my-2 mr-2 rounded-lg bg-red-500 hover:bg-red-600 cursor-pointer"
              @click="showPaidModal = false"
            >
              Cancel
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- TO PAID CONFIRM CANCEL ENDS HERE -->

    <!-- TO SESSIONS MODAL -->
    <transition name="fade" mode="out-in">
      <div v-if="showSessionsModal == true" class="sessions-modal overflow-hidden">
        <div class="m-4 border-b-4 border-double border-white">
          <div 
            v-for="(item, index) in chosenPracticesFinalization"
            :key="`item-${index}`"
            class="text-white"
          >
            <div class="flex flex-row m-2">
              <div
                class="text-sm mt-2 m-2"
              >{{ item.name }}</div>

              <div>
                <AppButton
                  class="text-white"
                  :background="'red'"
                  :disabled="chosenPracticeJobParts.filter(jobPart => jobPart.practice_id === item.id).length < item.practice_invoiceable_approved_filtered_job_parts.length ? false : true"
                  :label="'Remove'"
                  :icon="'garbage'"
                  @click="toggleCheckChosenPractices(item)"
                />
              </div>

              <!-- <div @click="toggleCheckChosenPractices(item)">
                <input
                  :id="item" 
                  v-model="chosenPracticesFinalization" 
                  type="checkbox" 
                  :value="item"
                >
                <label
                  :for="item"
                  class="text-sm pl-1"
                >{{ item.name }}</label>
              </div> -->
            </div>
            <AppTable
              :nestedItem="item"
              :total="item.practice_invoiceable_approved_job_part_count"
              :items="item.practice_invoiceable_approved_filtered_job_parts_sliced"
              :currentPage="item.current_page"
              :perPage="10"
              :columns="jobPartsColumns"
              :customWidth="200"
              @checkClicked="toggleCheckJobParts"
              @pagechanged="pageChangedJobPart"
              @sorted="sorted"
            >
              <template v-slot:checker="slotProps">
                <input 
                  :id="slotProps.item" 
                  v-model="chosenPracticeJobParts" 
                  type="checkbox" 
                  :value="slotProps.item" 
                >
                <label :for="slotProps.item" />
              </template>

              <template v-slot:status_slot="slotProps">
                <div
                  class="rounded-full text-center px-4 py-1 w-32"
                  :class="statusStyle(slotProps.item.invoice_status)"
                >
                  {{ slotProps.item.invoice_status && slotProps.item.invoice_status === "Invoiced" ? "Approved" : slotProps.item.invoice_status }}
                </div>
              </template>
            </AppTable>
          </div>
        </div>
        <div class="m-4">
          <div class="m-2 text-white">
            Pagination for Chosen Practices
          </div>
          <AppPagination
            :total="chosenPractices.length"
            :totalPages="Math.ceil(chosenPractices.length / practicesFinalizationPerPage)"
            :currentPage="practicesFinalizationPage"
            :perPage="practicesFinalizationPerPage"
            @pagechanged="pageChangedPracticesFinalization"
          />
        </div>
        
        <transition name="drop" mode="out-in">
          <AppDate 
            v-model="dueDate" 
            class="m-4 text-white" 
            :name="'due_date'" 
            :label="'Due Date'" 
            is-after 
          />
        </transition>
        <div class="flex flex-col w-full text-white px-8 justify-between">
          <div class="flex flex-row mb-4">
            <div
              class="p-2 px-4 my-2 mr-2 rounded-lg bg-green-500 hover:bg-green-600 cursor-pointer"
              @click="createBulkBillingChecked()"
            >
              Confirm
            </div>
            <div
              class="p-2 px-4 my-2 mr-2 rounded-lg bg-red-500 hover:bg-red-600 cursor-pointer"
              @click="clearInvoiceableJobParts()"
            >
              Cancel
            </div>
          </div>
        </div>
      </div>
    </transition>
    <!-- TO SESSIONS MODAL ENDS HERE -->

    <div
      v-if="
        $route.name.includes('index-billings-id') ||
          $route.name.includes('index-billings-addinvoice')
      "
      class="billing-shield"
      @click="$router.push(`/billings`)"
    />
    <div
      v-if="
        showPaidModal === true || showSessionsModal === true
      "
      class="billing-shield"
      
      @click="clearInvoiceableJobParts()"
    />
    <nuxt-child />
  </div>
</template>
<script>
import debounce from "lodash.debounce"
import AppTable from "@/components/Base/AppTable"
import AppDate from "@/components/Base/AppDate"
import AppDateToggled from "@/components/Base/AppDateToggled"
import AppButton from "@/components/Base/AppButton"
import AppInput from "@/components/Base/AppInput"
import AppPagination from "@/components/Base/AppPagination"
export default {
	components: {
		AppTable,
    AppDate,
    AppDateToggled,
    AppButton,
    AppInput,
    AppPagination,
  },
  
	data () {
		return {
      searchMessage: "",
      showPaidModal: false,
      showSessionsModal: false,

			// for app table
			currentPage: 1,
			search: "",
      chosenPractices:[],
      dueDate: '',

      // for bulk billing processing
      invoiceableDateStart: "",
      invoiceableDateEnd: "",
      chosenPracticeJobParts: [],

      chosenPracticesFinalization: [],
      practicesFinalizationPage: 1,
      practicesFinalizationPerPage: 10,

      practicesFilteredJobPartsPerPage: 10,

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
      ],
      jobPartsColumns: [
				{
					name: "Check",
					dataIndex: "checker",
					class: "text-center",
					slotName: "checker",
					eventName: "checkClicked"
        },
				{
					name: "Job Part Number",
					dataIndex: "job_part_number",
					sortable: false
				},
				{
          name: "Date Start",
          dataIndex: "date_start",
					class: "text-center localDate",
					sortable: false
				},
				{
          name: "Date End",
          dataIndex: "date_end",
					class: "text-center localDate",
					sortable: false
        },
        {
          name: "Total",
          dataIndex: "total",
					class: "text-center currency",
					sortable: false
				},
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
    allPractices () {
      return this.$store.state.practices.allPractices
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
			return this.$store.state.itemCount
		}
	},

	watch: {
    invoiceableDateStart: function (value) {
      if (value > this.invoiceableDateEnd) { 
        this.invoiceableDateEnd = ""
      }
      this.practiceParams.practice_invoiceable_date_start = value
    },
    invoiceableDateEnd: function (value) {
      this.practiceParams.practice_invoiceable_date_end = value
    },
		search (value) {
      console.log('search for', value)
			this.searchSubmit()
		},

		$route () {
			// this.getPractices()
		}
  },
  created () {
    console.log('store set 0')
    this.$store.commit("practices/CLEAR_PRACTICES_COUNT")
    this.$store.commit("practices/CLEAR_PRACTICES")
  },

  // async asyncData ({ error, store}) {
  //   try{
  //     await store.commit("practices/SET_PRACTICE_COUNT", 0)
  //     await store.commit("practices/SET_PRACTICES", [])
  //   }catch(err) {
  //     if (err.response && err.response.status === 401) {
  //       console.log("something went wrong")
  //       error(err.response.data)
  //       return
  //     }
	// 		throw err
  //   }
  // },
  
	methods: {
		async getBillablePractices () {
      console.log('get billable practices start')
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

      if (itemCount > 0) {
        this.searchMessage = ""
      } else {
        this.searchMessage = "No practice to invoice found"
      }

			await this.$store.commit("practices/SET_PRACTICE_COUNT", itemCount)

			response = await this.$axios.$get(`/api/v1/admin/practices`, { params })
			const practices = response.data.practices
			await this.$store.commit("practices/SET_PRACTICES", practices)
			await this.$store.commit("practices/TOGGLE_LOADING", false)
    },
    
    async createBulkBilling () {
      await this.$store.commit("practices/TOGGLE_LOADING", true)
      console.log('create')
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
          due_date: this.dueDate
        }
      })
      
      await this.$axios.post(`/api/v1/admin/practice-invoices/create-bulk`, {
          practice_invoice_datas: practiceInvoiceDatas,
        })
        .then(res => {
          console.log('res',res)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: "Success"
          })
          this.chosenPractices = []
          this.getPractices()
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: err.response.data.message
          })
        })

      
      this.practiceParams.practice_invoiceable_date_start =  null
      this.practiceParams.practice_invoiceable_date_end = null
      this.search = ""
      this.chosenPractices = []
      this.dueDate = ''
      this.showPaidModal = false,
      this.$store.dispatch('practices/clearPractices')
      await this.$store.commit("practices/TOGGLE_LOADING", false)
    },

    async processBulkBilling () {
      Promise.all([
        this.chosenPracticesFinalization =  this.chosenPractices
        // this.chosenPractices = this.chosenPractices.map(practice => {
        //   practice.practice_invoiceable_approved_filtered_job_parts.forEach(jobPart => {
        //     this.chosenPracticeJobParts.push(jobPart)
        //   })
        //   const practice_invoiceable_approved_filtered_job_parts_sliced = practice.practice_invoiceable_approved_filtered_job_parts.slice(
        //     (1 - 1)*this.practicesFilteredJobPartsPerPage,
        //     1 * this.practicesFilteredJobPartsPerPage
        //   )
        //   console.log('inside original chosen practice', practice)
        //   return {
        //     ...practice,
        //     practice_invoiceable_approved_filtered_job_parts_sliced,
        //     current_page: 1,
        //   }
        // }),
        
      ]).then(() => { 
        this.chosenPracticesFinalization = this.chosenPracticesFinalization.map(practice => {
          practice.practice_invoiceable_approved_filtered_job_parts.forEach(jobPart => {
            this.chosenPracticeJobParts.push(jobPart)
          })
          const practice_invoiceable_approved_filtered_job_parts_sliced = practice.practice_invoiceable_approved_filtered_job_parts.slice(
            (1 - 1)*this.practicesFilteredJobPartsPerPage,
            1 * this.practicesFilteredJobPartsPerPage
          )
          return {
            ...practice,
            practice_invoiceable_approved_filtered_job_parts_sliced,
            current_page: 1,
          }
        })
        // const practiceInvoiceDatas = this.chosenPractices.map((practice) => {
        //   const items = practice.practice_invoiceable_approved_filtered_job_parts.map((jobPart) => {
        //     return {
        //       type: 'Job Part - Invoiced',
        //       job_part_id: jobPart.id,
        //       description:
        //         "Job Number " +
        //         jobPart.job_part_number +
        //         " for £" +
        //         jobPart.practice_rate +
        //         " from " +
        //         this.$moment(jobPart.date_start).format('DD/MM/YYYY') +
        //         " to " +
        //         this.$moment(jobPart.date_end).format('DD/MM/YYYY'),
        //       total: jobPart.total,
        //     }
        //   })

        //   const total_amount = items.reduce((total_amount, item) => total_amount + item.total, 0)

        //   return {
        //     practice_id: practice.id,
        //     items,
        //     date_start: this.practiceParams.practice_invoiceable_date_start,
        //     date_end: this.practiceParams.practice_invoiceable_date_end,
        //     total_amount,
        //     due_date: this.dueDate
        //   }
        // })
        // this.chosenPracticesInvoiceable = practiceInvoiceDatas
      }).finally(() => {
        this.showSessionsModal = true
      })
    },

    async createBulkBillingChecked () {
      await this.$store.commit("practices/TOGGLE_LOADING", true)
      const practiceInvoiceDatas = await this.chosenPractices.map((practice) => {
        const chosenJobParts = this.chosenPracticeJobParts.filter(jobPart => jobPart.practice_id === practice.id)
        console.log('chosenjobparts', chosenJobParts)

        const items = chosenJobParts.map((jobPart) => {
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
          due_date: this.dueDate
        }
      })

      console.log('practice invoice datas to invoice', practiceInvoiceDatas)
      
      await this.$axios.post(`/api/v1/admin/practice-invoices/create-bulk`, {
          practice_invoice_datas: practiceInvoiceDatas,
        })
        .then(res => {
          console.log('res',res)
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: "Success"
          })
          this.chosenPractices = []
          this.getPractices()
        })
        .catch(err => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: err.response.data.message
          })
        })

      
      this.practiceParams.practice_invoiceable_date_start =  null
      this.practiceParams.practice_invoiceable_date_end = null
      this.search = ""
      this.chosenPractices = []
      this.chosenPracticeJobParts = []
      this.dueDate = ''
      this.showPaidModal = false,
      this.showSessionsModal = false,
      await this.$store.commit("practices/SET_PRACTICES", [])
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
      this.chosenPractices = []
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
      console.log('togglecheck', this.chosenPractices)
			const index = this.chosenPractices.findIndex(practice => {
				return practice.id === item.id
			})

			if (index > -1) {
				this.chosenPractices.splice(index, 1)
			} else {
				this.chosenPractices.push(item)
      }
    },

    toggleCheckChosenPractices (item) {
      const index = this.chosenPracticesFinalization.findIndex(practice => {
        return practice.id === item.id
      })

      if (index > -1) {
        this.chosenPracticesFinalization.splice(index, 1)
      }

    },

    toggleCheckJobParts (item) {
      const index = this.chosenPracticeJobParts.findIndex(jobPart => {
        return jobPart.id === item.id
      })
      
      if (index > -1) {
        this.chosenPracticeJobParts.splice(index, 1)
      } else {
        this.chosenPracticeJobParts.push(item)
      }

      console.log('chosen job parts checker', this.chosenPracticeJobParts)
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
			this.practiceParams.offset = this.practiceParams.limit * (page - 1)
			this.currentPage = page
			this.getPractices()
    },
    
    async pageChangedPracticesFinalization (page) {
      this.practicesFinalizationPage = page
      this.chosenPracticesFinalization = await this.chosenPractices.slice(
        (page - 1)*this.practicesFinalizationPerPage,
         page * this.practicesFinalizationPerPage
      )
      this.chosenPracticesFinalization = await this.chosenPracticesFinalization.map(practice => {
        const practice_invoiceable_approved_filtered_job_parts_sliced = practice.practice_invoiceable_approved_filtered_job_parts.slice(
          (1 - 1)*this.practicesFilteredJobPartsPerPage,
          1 * this.practicesFilteredJobPartsPerPage
        )
        console.log('inside original chosen practice', practice)
        return {
          ...practice,
          practice_invoiceable_approved_filtered_job_parts_sliced,
          current_page: 1,
        }
      })
    },

    async pageChangedJobPart (page, practiceItem) {
      console.log('page', page)
      console.log('practice item before mod', practiceItem)
      const originalPractice = this.chosenPractices.find(item => item.id === practiceItem.id)
      console.log('originalPractice', this.chosenPractices)

      Promise.all([
        practiceItem.current_page = page,
        practiceItem.practice_invoiceable_approved_filtered_job_parts_sliced = 
          originalPractice.practice_invoiceable_approved_filtered_job_parts.slice(
            (page - 1)*this.practicesFilteredJobPartsPerPage,
            page * this.practicesFilteredJobPartsPerPage
          ),
      ]).then(()=>{
        console.log('practice item', practiceItem)
        const index = this.chosenPracticesFinalization.findIndex(item => item.id === practiceItem.id)

        this.chosenPracticesFinalization[index] = practiceItem
      })
      // let params = {
      //   job_practice_id: practiceItem.id,
      //   approved_at_date_start: this.practiceParams.practice_invoiceable_date_start,
      //   approved_at_date_end: this.practiceParams.practice_invoiceable_date_end,
      //   status: 'Approved',
      //   locum_invoiceable: true,
      //   practice_invoiced: false,
      // }

			// this.params.offset = this.params.limit * (page - 1)
			// this.currentPage = page
			// this.getJobParts(params)
    },
    
    clearInvoiceableJobParts () {
      this.chosenPracticeJobParts = []
      this.chosenPracticesFinalization = []
      this.showSessionsModal = false
    },

		sorted (order_by) {
			// go back to page 1
			this.currentPage = 1
			// let query = {
			// 	...this.$router.query,
			// 	order_by
      // }
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
.sessions-modal {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	border-radius: 25px;
	min-width: 900px;
	min-height: 750px;
	max-width: 100%;
	max-height: 90%;
	overflow: auto;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
.mark-paid-modal {
	position: fixed;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	border-radius: 25px;
	min-width: 600px;
	min-height: 450px;
	max-width: 95%;
	max-height: 80%;
	overflow: auto;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
</style>
