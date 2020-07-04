<template>
  <div>
    <div class="flex items-center px-2 py-2">
      <AppLoading :loading="loadingBillablePractices" :message="'Loading Billable Practices'" />
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
          
          <AppButton
            class="whitespace-no-wrap"
            :disabled="invoiceableDateStart && invoiceableDateEnd ? false : true"
            :label="'Search for Practices'"
            :icon="'search'"
            @click="getBillablePractices()"
          />
        </div>
        <div
          class="flex text-white"
        >
          <div class="flex-wrap justify-start items-center w-full shadow-lg p-3 rounded-lg flex bg-waterloo my-2">
            <div class="md:px-1 w-full">
              <label class="text-md md:text-lg text-bold">Filters</label>
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
              <input id="standAloneOnly" v-model="showStandAloneOnly" type="checkbox" value="true">
              <label for="standAloneOnly">Show Stand Alone Practices Only</label>
            </div>
            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3 text-white">
              <input id="healthBoardsOnly" v-model="showHealthBoardsOnly" type="checkbox" value="true">
              <label for="healthBoardsOnly">Show Health Boards Only</label>
            </div>
            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3 text-white">
              <input id="completed" v-model="showCompleted" type="checkbox" value="true">
              <label for="completed">Include Completed Invoices</label>
            </div>
            <div class="md:px-1 w-full lg:w-1/4 md:w-1/3 text-white">
              <input id="disputed" v-model="showDisputed" type="checkbox" value="true">
              <label for="disputed">Include Disputed Invoices</label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~TABLE NEW STARTS HERE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~`` -->
    <div v-if="allBillablePractices.length === 0">
      <div
        class="mt-10 w-full text-center text-white"
      >
        No Billable Practices Found.
      </div>
    </div>
    <div v-else class="w-full overflow-x-auto">
      <!-- BODY -->
      <div
        v-for="(item, index) in allBillablePractices"
        :key="`item-${index}`"
        class="flex flex-col cursor-pointer md:flex-row px-4 md:px-0 py-2 my-2 rounded-lg border-l-4 border-yellow-500 md:border-l-0 text-white no-underline shadow-lg bg-waterloo"
        draggable="false"
      >
        <div class="flex flex-col md:justify-center sm:w-1/2 md:w-1/6 px-1 xl:px-2 py-2 align-middle">
          <strong class="block md:hidden text-sm uppercase">Practice Name</strong>
          <div>{{ item.name }}</div>
          <div
            class="rounded-full text-center px-4 py-1 w-32" 
            :class="typeStyle(item.type)"
          >
            {{ item.type }}
          </div>
          <div 
            v-if="item.type === 'Spoke'"
            class="text-blue-200"
          >
            {{ item.parent_practice.name }} (HUB)
          </div>
        </div>
        <div
          class="flex flex-col md:justify-center sm:w-1/2 md:w-5/6 px-1 xl:px-2 py-2 align-middle md:text-center"
        >
          <strong class="block md:hidden text-sm uppercase">Job Parts</strong>
          <!-- :nestedItem="item" -->
          <AppTable
            :total="item.practice_invoiceable_approved_filtered_job_parts.length"
            :items="item.practice_invoiceable_approved_filtered_job_parts"
            :currentPage="item.current_page"
            :perPage="10"
            :columns="jobPartsColumns"
            :customWidth="200"
            :disabledPagination="true"
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
            <template v-slot:invoice_status_slot="slotProps">
              <div
                class="rounded-full text-center px-4 py-1 w-32"
                :class="invoiceStatusStyle(slotProps.item.invoice_status)"
              >
                {{ slotProps.item.invoice_status }}
              </div>
            </template>
            <template v-slot:status_slot="slotProps">
              <div
                class="rounded-full text-center px-4 py-1 w-32"
                :class="invoiceStatusStyle(slotProps.item.status)"
              >
                {{ slotProps.item.status }}
              </div>
            </template>
          </AppTable>
        </div>
      </div>
    </div>
    <div>
      <AppPagination
        :total="total"
        :totalPages="totalPages"
        :currentPage="currentPage"
        :perPage="20"
        @pagechanged="pagechanged"
      />
    </div>
    <!--~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ TABLE NEW ENDS HERE~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->
    <div class="flex flex-row justify-end">
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
      <AppButton
        class="mx-2"
        :label="'Clear Selection'"
        :icon="'add-rectangle'"
        @click="reset()"
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
      chosenPractices:[],
      dueDate: '',

      // for bulk billing processing
      showCompleted: false,
      showDisputed: false,
      // after query filters
      showIndependentSpokesOnly:false,
      showDependentSpokesOnly: false,
      showStandAloneOnly:false,
      showHealthBoardsOnly:false,

      invoiceableDateStart: "",
      invoiceableDateEnd: "",
      chosenPracticeJobParts: [],

      chosenPracticesFinalization: [],
      practicesFinalizationPage: 1,
      practicesFinalizationPerPage: 10,

      practicesFilteredJobPartsPerPage: 10,

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
          dataIndex: "datetime_start_formatted",
					class: "text-center",
					sortable: false
        },
				{
          name: "Date End",
          dataIndex: "datetime_end_formatted",
					class: "text-center",
					sortable: false
        },
        {
          name: "Total",
          dataIndex: "total",
					class: "text-center currency",
					sortable: false
        },
        // {
				// 	name: "Invoice Status",
				// 	slot: true,
				// 	dataIndex: "invoice_status",
				// 	class: "text-center",
				// 	slotName: "invoice_status_slot",
				// 	sortable: true
				// },
        {
					name: "Status",
					slot: true,
					dataIndex: "status",
					class: "text-center",
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
    },
		search () {
			this.searchSubmit()
		},

		$route () {
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
    async processBulkBilling () {
      Promise.all([
        this.chosenPracticesFinalization =  this.chosenPractices
      ]).then(() => { 
        this.chosenPracticesFinalization = this.chosenPracticesFinalization.map( practice => {
          // Create a new variable
          let job_parts_for_invoicing = practice.practice_invoiceable_approved_filtered_job_parts
          job_parts_for_invoicing.forEach(jobPart => {
            this.chosenPracticeJobParts.push(jobPart)
          })
          if (this.showCompleted) {
            const completed_job_parts_for_invoicing = practice.practice_invoiceable_invoiced_filtered_job_parts
            completed_job_parts_for_invoicing.forEach(jobPart => {
              this.chosenPracticeJobParts.push(jobPart)
            })
            job_parts_for_invoicing = [
              ...job_parts_for_invoicing,
              ...completed_job_parts_for_invoicing,
            ]
          } 
          const practice_invoiceable_approved_filtered_job_parts_sliced = job_parts_for_invoicing.slice(
            (1 - 1)*this.practicesFilteredJobPartsPerPage,
            1 * this.practicesFilteredJobPartsPerPage
          )
          
          console.log('sliced',practice_invoiceable_approved_filtered_job_parts_sliced )
          return {
            ...practice,
            job_parts_for_invoicing,
            practice_invoiceable_approved_filtered_job_parts_sliced,
            current_page: 1,
          }
        })
      }).finally(() => {
        console.log('processed', this.chosenPracticesFinalization)
        console.log('chosen practice job parts', this.chosenPracticeJobParts)
        this.showSessionsModal = true
      })
    },

    async createBulkBillingChecked () {
      await this.$store.commit("billings/TOGGLE_LOADING_FOR_BILLABLE_PRACTICES", true)
      console.log('chosenPractices', this.chosenPractices)
      let practiceInvoiceDatas = await this.chosenPractices.map((practice) => {
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
          text: "Success"
        })
        this.practiceParams.practice_invoiceable_date_start =  null
        this.practiceParams.practice_invoiceable_date_end = null
        this.invoiceableDateStart = null
        this.invoiceableDateEnd = null
        this.search = ""
        this.chosenPractices = []
        this.chosenPracticeJobParts = []
        this.dueDate = ''
        this.$store.commit("billings/CLEAR_BILLABLE_PRACTICES_COUNT")
        this.$store.commit("billings/CLEAR_BILLABLE_PRACTICES")
        
      })
      .catch(err => {
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "danger",
          text: err.response.data.message
        })
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
    
    toggleCheck (item) {
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
      const index = this.chosenPractices.findIndex(practice => {
        return practice.id === item.id
      })
      if (index > -1) {
        this.chosenPractices.splice(index, 1)
      } else {
        this.chosenPractices.push(item)
      }

      console.log('chosenPractices', this.chosenPractices)

      // const practiceJobParts = this.chosenPracticeJobParts.filter(jobParts => {
      //   jobParts.practice_id === item.id
      // })

      // if (practiceJobParts > -1) {
      //   this.chosenPracticesFinalization.filter()
      // } else {
      //   this.chosenPracticesFinalization = {
      //     ...this.chosenPracticesFinalization,
      //     ...item.practice_invoiceable_approved_filtered_job_parts,
      //   }
      // }

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
      // await this.$store.commit("billings/TOGGLE_LOADING_FOR_BILLABLE_PRACTICES", true)
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
						verified: this.verified
					})
        })
      // await this.$store.commit("billings/TOGGLE_LOADING_FOR_BILLABLE_PRACTICES", false)
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
      const originalPractice = this.chosenPracticesFinalization.find(item => item.id === practiceItem.id)
      Promise.all([
        practiceItem.current_page = page,
        practiceItem.practice_invoiceable_approved_filtered_job_parts_sliced = 
          originalPractice.job_parts_for_invoicing.slice(
            (page - 1)*this.practicesFilteredJobPartsPerPage,
            page * this.practicesFilteredJobPartsPerPage
          ),
      ]).then(()=>{
        const index = this.chosenPracticesFinalization.findIndex(item => item.id === practiceItem.id)
        this.chosenPracticesFinalization[index] = practiceItem
      })
    },

    reset () {
      this.practiceParams.practice_invoiceable_date_start =  null
      this.practiceParams.practice_invoiceable_date_end = null
      this.invoiceableDateStart = null
      this.invoiceableDateEnd = null
      this.search = ""
      this.chosenPractices = []
      this.chosenPracticeJobParts = []
      this.dueDate = ''
      this.$store.commit("billings/CLEAR_BILLABLE_PRACTICES_COUNT")
      this.$store.commit("billings/CLEAR_BILLABLE_PRACTICES")
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
