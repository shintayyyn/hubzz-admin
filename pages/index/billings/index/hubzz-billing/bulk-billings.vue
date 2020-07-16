<template>
  <div>
    <AppLoading :loading="loadingBillablePractices" :message="'Loading Billable Practices'" />
    <div class="flex items-center px-2 py-2">
      <div class="relative w-full">
        <div class="flex flex-col text-white">
          <!-- Upper Filter (Job parts, Required fields) -->
          <div class="flex flex-row items-center w-full">
            <!-- Job part filters -->
            <div class="flex flex-col p-3">
              <div class="px-1">
                <div class="text-lg text-white font-semibold">
                  Filter Job Parts
                </div>
                <div class="flex items-center">
                  <AppDate
                    v-model="invoiceableDateEnd"
                    class="md:mx-2 text-white"
                    :name="'practice_invoiceable_date_end'"
                    :label="'Select Date Range'"
                    :isBefore="true"
                  />
                  <div class="flex flex-col">
                    <div class="w-full text-white">
                      <input id="completed" v-model="showCompleted" type="checkbox" value="true">
                      <label for="completed">Include Completed Invoices</label>
                    </div>
                    <div class="w-full text-white">
                      <input id="disputed" v-model="showDisputed" type="checkbox" value="true">
                      <label for="disputed">Include Disputed Invoices</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Required Fields -->
            <div class="text-white p-3 rounded-lg border-solid border-2 border-gray-200 ">
              <div class="text-lg font-semibold">
                Billing Period (Required Fields)
              </div>
              <div class="flex">
                <AppDate
                  v-model="billingPeriodDateStart"
                  class="md:mx-2 text-white"
                  :name="'billing_period_date_start'"
                  :label="'Billing Date From(Required)'"
                />
                <AppDate
                  v-model="billingPeriodDateEnd"
                  class="md:mx-2 text-white"
                  :name="'billing_period_date_end'"
                  :label="'Billing Date To(Required)'"
                  :isAfterDate="billingPeriodDateStart"
                />
                <AppDate
                  v-model="dueDate"
                  class="md:mx-2 text-white"
                  :name="'due_date'"
                  :label="'Due Date(Required)'"
                  :isAfter="true"
                />
              </div>
            </div>
          </div>
          <!-- Lower Filter (Practice filters) -->
          <div class="flex flex-wrap justify-start items-center w-full p-3">
            <div class="md:px-1 w-full mb-4">
              <label class="text-md md:text-lg font-bold ">Filter Practices</label>
            </div>
            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3 text-white">
              <input id="orderAlphabticalAsc" v-model="orderAlphabeticalAsc" type="checkbox" value="true">
              <label for="orderAlphabticalAsc">Sort Practice Alphabetically ↑</label>
            </div>
            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3 text-white">
              <input id="standAloneOnly" v-model="showStandAloneOnly" type="checkbox" value="true">
              <label for="standAloneOnly">Show Stand Alone Practices Only</label>
            </div>
            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3 text-white">
              <input id="independentSpokesOnly" v-model="showIndependentSpokesOnly" type="checkbox" value="true">
              <label for="independentSpokesOnly">Show Billable Spokes Only</label>
            </div>
            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3 text-white">
              <input id="dependentSpokesOnly" v-model="showDependentSpokesOnly" type="checkbox" value="true">
              <label for="dependentSpokesOnly">Show Spokes(grouped by Hubs)</label>
            </div>
            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3 text-white">
              <input id="orderAlphabeticalDesc" v-model="orderAlphabeticalDesc" type="checkbox" value="true">
              <label for="orderAlphabeticalDesc">Sort Practice Alphabetically ↓</label>
            </div>
            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3 text-white">
              <input id="healthBoardsOnly" v-model="showHealthBoardsOnly" type="checkbox" value="true">
              <label for="healthBoardsOnly">Show Health Boards Only</label>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TABLE NEW STARTS HERE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`` -->
    <div v-if="itemCount === 0">
      <div
        class="mt-10 w-full text-center text-white"
      >
        No Billable Practices Found.
      </div>
    </div>
    <div v-else class="border-b-2 border-white mt-2">
      <div class="hidden md:flex pb-3 items-center text-sm text-white justify-around font-semibold">
        <div class="align-middle text-center w-1/6">
          Practice / Surgery
        </div>
        <div class="align-middle text-center w-1/6">
          Check
        </div>
        <div class="align-middle text-center w-1/6">
          Job Part Number
        </div>
        <div class="align-middle text-center w-1/6">
          Approved at / Completed At
        </div>
        <div class="align-middle text-center w-1/6">
          Total
        </div>
        <!-- <div class="align-middle text-center w-1/6">
          Invoice Status
        </div> -->
        <div class="align-middle text-center w-1/6 align-right">
          Status
        </div>
      </div>
      <div class="w-full h-160 overflow-y-auto bg-charade rounded-lg">
        <!-- BODY -->
        <div class="p-2 overflow-x-hidden">
          <AppTable
            :total="itemCount"
            :items="allBillablePractices"
            :currentPage="currentPage"
            :perPage="practiceParams.limit"
            :columns="practiceColumns"
            :orderBy="practiceParams.order_by"
            :disabledHeadings="true"
            :disabledPagination="true"
            :itemsOnTop="true"
            @pagechanged="pagechanged"
            @checkClicked="toggleCheckPracticeCheckAll"
            @sorted="sorted"
          >
            <template v-slot:checker="slotProps">
              <div class="flex flex-col items-center m-1">
                <div>{{ slotProps.item.name }}</div>
                <div
                  class="m-1 rounded-full text-center px-4 py-1 w-32" 
                  :class="typeStyle(slotProps.item.type)"
                >
                  {{ slotProps.item.type }}
                </div>
                <div 
                  v-if="slotProps.item.type === 'Spoke'"
                  class="text-blue-200 m-1"
                >
                  {{ slotProps.item.parent_practice.name }} (HUB)
                </div>
                <div class="m-1">
                  <input 
                    :id="slotProps.item" 
                    v-model="chosenPractices" 
                    type="checkbox" 
                    :value="slotProps.item" 
                  >
                  <label :for="slotProps.item">
                    Select All
                  </label>
                </div>
              </div>
            </template>
            
            <template v-slot:invoiceable_job_parts="slotProps">
              <div class="md:justify-center sm:w-1/2 md:w-full px-1 xl:px-2 align-middle md:text-center overflow-x-hidden">
                <div>
                  <AppTable
                    :total="slotProps.item.practice_invoiceable_job_parts.length"
                    :items="slotProps.item.practice_invoiceable_job_parts"
                    :columns="jobPartsColumns"
                    :disabledPagination="true"
                    :disabledHeadings="true"
                    @checkClicked="toggleCheckJobParts"
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
                    <template v-slot:approved_completed_at="slotProps">
                      <div>
                        {{ slotProps.item.approved_at ? slotProps.item.approved_at : slotProps.item.completed_at }}
                      </div>
                    </template>
                    <template v-slot:status_slot="slotProps">
                      <div
                        class="rounded-full text-center px-4 py-1 w-32"
                        :class="invoiceStatusStyle(slotProps.item.invoice_status === 'Disputed' ? 'Disputed' : slotProps.item.status)"
                      >
                        {{ slotProps.item.invoice_status === 'Disputed' ? 'Disputed' : slotProps.item.status }}
                      </div>
                    </template>
                  </AppTable>
                </div>
              </div>
            </template>
          </AppTable>
        </div>
      </div>
      <AppPagination
        :total="itemCount"
        :totalPages="totalPages"
        :currentPage="currentPage"
        :perPage="practiceParams.limit"
        @pagechanged="pagechanged"
      />
    </div>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TABLE NEW ENDS HERE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <div class="flex flex-row justify-end mt-4">
      <AppButton
        class="mx-2"
        :label="'Clear Selection'"
        :icon="'add-rectangle'"
        @click="reset()"
      />
      <AppButton
        class="mx-2"
        :label="'Generate HUBZZ Invoices'"
        :icon="'add-rectangle'"
        :disabled="billingPeriodDateStart 
          && billingPeriodDateEnd
          && chosenPracticeJobParts.length > 0  
          ? false : true"
        @click="createBulkBillingChecked()"
      />
    </div>
    
    <div
      v-if="
        $route.name.includes('index-billings-id') ||
          $route.name.includes('index-billings-addinvoice')
      "
      class="billing-shield"
      @click="$router.push(`/billings`)"
    />
    <div
      v-if="showSessionsModal === true"
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
import AppButton from "@/components/Base/AppButton"
import AppLoading from "@/components/Base/AppLoading"
import AppPagination from "@/components/Base/AppPagination"
export default {
	components: {
		AppTable,
    AppDate,
    AppButton,
    AppLoading,
    AppPagination,
  },
  
	data () {
		return {
      searchMessage: "",
      showSessionsModal: false,

			// for app table
			currentPage: 1,
			search: "",
      dueDate: '',

      // for bulk billing processing
      showCompleted: false,
      showDisputed: false,
      // query filters
      invoiceableDateEnd: "",
      orderAlphabeticalAsc: false,
      orderAlphabeticalDesc: false,
      showIndependentSpokesOnly:false,
      showDependentSpokesOnly: false,
      showStandAloneOnly:false,
      showHealthBoardsOnly:false,

      // billing period filters
      billingPeriodDateStart: "",
      billingPeriodDateEnd: "",
      
      chosenPractices:[],
      chosenPracticeJobParts: [],

			practiceParams: {
				id: [],
				limit: 20,
				offset: 0,
				order_by: ["created_at:desc"],
				status: ["Active", "Dormant", "Suspended"],
        type: [],
        hub_type: [],
        billable_spoke: null,
        verified: true,
        practice_invoiceable_date_start: null,
        practice_invoiceable_date_end: null,
        practice_invoiceable: true,
      },
      
      loading: false,
      practiceColumns: [
        {
          name:"Practice",
          dataIndex:"checker",
          class:"text-left mt-4",
          slotName:"checker",
          eventName: "checkClicked"
        },
        {
          name:"Job Parts",
          dataIndex:"invoiceable_job_parts",
          class:"w-full",
          slotName:"invoiceable_job_parts",
        },

      ],
      jobPartsColumns: [
				{
					name: "Check",
					dataIndex: "checker",
					class: "text-center ",
					slotName: "checker",
					eventName: "checkClicked"
        },
				{
					name: "Job Part Number",
          dataIndex: "job_part_number",
          class: "text-center",
					sortable: false
				},
        {
          name: "Approved At / Completed At",
          slot: true,
          dataIndex: "approved_at",
          class: "text-center localDate",
          slotName: "approved_completed_at"
        },
        {
          name: "Total",
          dataIndex: "total",
					class: "text-center currency",
					sortable: false
        },
        {
					name: "Status",
					slot: true,
					dataIndex: "status",
					class:"flex-auto",
					slotName: "status_slot",
					sortable: true
        },
			]
		}
  },
  
	computed: {
    loadingBillablePractices () {
      return this.$store.state.billings.loading_billable_practices
    },
    allBillablePractices () {
      return this.$store.state.billings.billable_practices
    },
		itemCount () {
			return this.$store.state.billings.billable_practices_count
		},
		pageCount () {
			return Math.ceil(this.itemCount / this.practiceParams.limit)
		},
		totalPages () {
			return Math.ceil(this.itemCount / this.practiceParams.limit)
		},
		total () {
			return this.allBillablePractices.length
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
      this.getBillablePractices()
    },

		search () {
			this.searchSubmit()
		},

		$route () {
			this.getBillablePractices()
    },

    orderAlphabeticalAsc: function (value) {
      if (value === true) {
        this.practiceParams.order_by = "practice_name:asc"
        this.orderAlphabeticalDesc = false
      } else {
        this.practiceParams.order_by = "created_at:desc"
      }
      
      this.getBillablePractices()
    },

    orderAlphabeticalDesc: function (value) {
      if (value === true) {
        this.practiceParams.order_by = "practice_name:desc"
        this.orderAlphabeticalAsc = false
      } else {
        this.practiceParams.order_by = "created_at:desc"
      }
      
      this.getBillablePractices()
    },

    showIndependentSpokesOnly: function (value) {
      if (value === true) {
        this.practiceParams.billable_spoke = true
      } else {
        this.practiceParams.billable_spoke = null
      }

      this.getBillablePractices()
    },

    showDependentSpokesOnly: function (value) {
      if (value === true) {
        this.practiceParams.billable_spoke = false
      } else {
        this.practiceParams.billable_spoke = null
      }

      this.getBillablePractices()
    },

    showStandAloneOnly: function (value) {
      if(value === true) {
        this.practiceParams.type.push('Stand Alone')
      } else {
        const index = this.practiceParams.type.findIndex(type => {
          return type === 'Stand Alone'
        })
        if (index > -1) {
          this.practiceParams.type.splice(index, 1)
        }
      }
      
      this.getBillablePractices()
    },

    showHealthBoardsOnly: function (value) {
      if (value === true) {

        this.practiceParams.hub_type.push('Type 2')
      } else {
        const index = this.practiceParams.hub_type.findIndex(hub_type => {
          return hub_type === 'Type 2'
        })
        if (index > -1) {
          this.practiceParams.hub_type.splice(index, 1)
        }
      }
      this.getBillablePractices()
    },

    showCompleted () {
      this.getBillablePractices()
    },

    showDisputed () {
      this.getBillablePractices()
    }

  },

  created () {
    console.log('store set 0')
    this.$store.commit("practices/CLEAR_PRACTICES_COUNT")
    this.$store.commit("practices/CLEAR_PRACTICES")
    this.$store.commit("billings/CLEAR_BILLABLE_PRACTICES_COUNT")
    this.$store.commit("billings/CLEAR_BILLABLE_PRACTICES")
    this.getBillablePractices()
  },
	methods: {
    toggleCheckPracticeCheckAll (item) {
			const index = this.chosenPractices.findIndex(practice => {
				return practice.id === item.id
			})

			if (index > -1) {
        this.chosenPractices.splice(index, 1)
        this.removeAll(item)
			} else {
        this.chosenPractices.push(item)
        this.addAll(item.practice_invoiceable_job_parts)
      }
    },
    removeAll (practice) {
      this.chosenPracticeJobParts = this.chosenPracticeJobParts.filter(jobPart => jobPart.practice_id !== practice.id)
      console.log('chosenJobParts', this.chosenPracticeJobParts)
    },
    addAll (jobParts) {
      jobParts.forEach(item => {
        const index = this.chosenPracticeJobParts.findIndex(jobPart => {
          return jobPart.id === item.id
        })
        
        if (!(index > -1)) {
          this.chosenPracticeJobParts.push(item)
        } 
      })

      console.log('chosenJobParts', this.chosenPracticeJobParts)
    },  
    async createBulkBillingChecked () {
      await this.$store.commit("billings/TOGGLE_LOADING_FOR_BILLABLE_PRACTICES", true)
      let chosenPracticeIds = await this.chosenPracticeJobParts.map(item => {
        return item.practice_id
      })
      chosenPracticeIds = [...new Set(chosenPracticeIds)]
      console.log('chosenPracticeIds', chosenPracticeIds)
      let practiceInvoiceDatas = await chosenPracticeIds.map((practiceId) => {
        const chosenJobParts = this.chosenPracticeJobParts.filter(jobPart => jobPart.practice_id === practiceId)
        console.log('chosenjobparts', chosenJobParts)

        const items = chosenJobParts.map((jobPart) => {
          return {
            type: 'Job Part - Invoiced',
            job_part_id: jobPart.id,
            description:
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
          practice_id: practiceId,
          items,
          date_start: this.billingPeriodDateStart,
          date_end: this.billingPeriodDateEnd,
          total_amount,
          due_date: this.dueDate
        }
      })

      practiceInvoiceDatas = await practiceInvoiceDatas.filter(practice => practice.items.length > 0)
      console.log('practiceInvoiceDatas', practiceInvoiceDatas)

      await this.$axios.post(`/api/v1/admin/practice-invoices/create-bulk`, {
        practice_invoice_datas: practiceInvoiceDatas,
      })
      .then(res => {
        console.log('res',res)
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: "Invoices Successfully Generated"
        })
        this.reset()
      })
      .catch(err => {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: err.response.data.message
        })
        this.$store.commit("billings/TOGGLE_LOADING_FOR_BILLABLE_PRACTICES", false)
      })
      .finally(() => {
        this.showSessionsModal = false
        this.$store.commit("billings/TOGGLE_LOADING_FOR_BILLABLE_PRACTICES", false)
      })  
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

			this.getBillablePractices()

			this.$router.push({ query })
    }, 500),

    toggleCheckChosenPractices (item) {
      const index = this.chosenPractices.findIndex(practice => {
        return practice.id === item.id
      })
      if (index > -1) {
        this.chosenPractices.splice(index, 1)
      } else {
        this.chosenPractices.push(item)
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

		async getBillablePractices () {
      console.log('params get billable practices', this.practiceParams)
			await this.$store
				.dispatch("billings/fetchBillablePractices", {
					id: this.practiceParams.id,
					limit: this.practiceParams.limit,
					search: this.search,
					order_by: this.practiceParams.order_by,
					offset: this.practiceParams.offset,
          status: this.practiceParams.status,
          type: this.practiceParams.type,
          hub_type: this.practiceParams.hub_type,
          billable_spoke: this.practiceParams.billable_spoke,
          practice_invoiceable_date_start: this.practiceParams.practice_invoiceable_date_start, 
          practice_invoiceable_date_end: this.practiceParams.practice_invoiceable_date_end, 
          practice_invoiceable: this.practiceParams.practice_invoiceable,
          show_completed: this.showCompleted,
          show_disputed: this.showDisputed,
					verified: this.verified,
					countOnly: true
				})
				.then(() => {
					this.$store.dispatch("billings/fetchBillablePractices", {
						id: this.practiceParams.id,
						limit: this.practiceParams.limit,
						search: this.search,
						order_by: this.practiceParams.order_by,
						offset: this.practiceParams.offset,
            status: this.practiceParams.status,
            type: this.practiceParams.type,
            hub_type: this.practiceParams.hub_type,
            billable_spoke: this.practiceParams.billable_spoke,
            practice_invoiceable_date_start: this.practiceParams.practice_invoiceable_date_start, 
            practice_invoiceable_date_end: this.practiceParams.practice_invoiceable_date_end, 
            practice_invoiceable: this.practiceParams.practice_invoiceable,
            show_completed: this.showCompleted,
            show_disputed: this.showDisputed,
						verified: this.verified
          })
          .then(()=> {
            console.log('billable practices', this.allBillablePractices)
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
			this.getBillablePractices()
    },

    reset () {
      this.invoiceableDateEnd = null
      this.practiceParams.practice_invoiceable_date_start =  null
      this.practiceParams.practice_invoiceable_date_end = null
      this.practiceParams.type = [],
      this.practiceParams.hub_type = [],
      this.practiceParams.billable_spoke = null,
      this.practiceParams.verified = true,
      this.billingPeriodDateStart = null
      this.billingPeriodDateEnd = null
      this.search = ""
      this.chosenPracticeJobParts = []
      this.dueDate = ''
      this.showCompleted = false
      this.showDisputed = false
      this.showIndependentSpokesOnly = false
      this.showDependentSpokesOnly = false
      this.showStandAloneOnly = false
      this.showHealthBoardsOnly = false
      this.$store.commit("billings/CLEAR_BILLABLE_PRACTICES_COUNT")
      this.$store.commit("billings/CLEAR_BILLABLE_PRACTICES")
      this.getBillablePractices()
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
			this.getBillablePractices()
    },

    invoiceStatusStyle (status) {
			switch (status) {
				case "Disputed":
					return "bg-red-500 text-white "
				case "Invoiced":
          return "bg-blue-500 text-white"
				case "To Be Invoiced":
					return "bg-indigo-600 text-white"
				case "Completed":
					return "bg-green-600 text-white"
				case "Approved":
          return "bg-blue-600 text-white"
        case "Cancelled":
					return "bg-red-600 text-white"
				default:
					return
			}
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
	width: 1300px;
	max-width: 95%;
	max-height: 90%;
	overflow: auto;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 768px) {
	.sessions-modal {
		max-height: 90%;
	}
}
</style>
