<template>
  <div>
    <div class="choose-job-parts-modal shadow-lg">
      <div class="p-4 md:p-8">
        <div class="p-1">
          <svgicon
            @click="$emit('close')"
            name="arrow-left-solid"
            height="32"
            width="32"
            class="fill-current cursor-pointer text-white hover:text-sunglow"
          />
        </div>
        <template v-if="jobPartCount > 0">
          <AppTable
            :total="jobPartCount"
            :items="jobParts"
            :currentPage="currentPage"
            :perPage="params.limit"
            :columns="columns"
            :loading="loadingSessions"
            :orderBy="params.order_by"
            @checkClicked="toggleCheck"
            @pagechanged="pagechanged"
            @sorted="sorted"
          >
            <template v-slot:checker="slotProps">
              <input 
                :id="slotProps.item" 
                v-model="chosenJobParts" 
                type="checkbox" 
                :value="slotProps.item" 
              >
              <label :for="slotProps.item" />
            </template>

            <template v-slot:invoice_status_slot="slotProps">
              <div
                class="rounded-full text-center px-4 py-1 w-32"
                :class="statusStyle(slotProps.item.invoice_status)"
              >
                <!-- {{ slotProps.item.invoice_status && slotProps.item.invoice_status === "Invoiced" ? "Approved" : slotProps.item.invoice_status }} -->
                {{ slotProps.item.invoice_status }}
              </div>
            </template>
            <template v-slot:status_slot="slotProps">
              <div
                class="rounded-full text-center px-4 py-1 w-32"
                :class="statusStyle(slotProps.item.status)"
              >
                <!-- {{ slotProps.item.status && slotProps.item.status === "Invoiced" ? "Approved" : slotProps.item.status }} -->
                {{ slotProps.item.status }}
              </div>
            </template>
            <template v-slot:actions="slotProps">
              <div class="flex justify-center">
                <div
                  class="text-white ml-2 px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700"
                  @click.prevent.stop="viewJobPart(slotProps.item.id)"
                >
                  View
                </div>
              </div>
            </template>
          </AppTable>
          <AppButton 
            :label="'Confirm'"
            :disabled="(chosenJobParts.length) < 1 ? true : false " 
            @click="emitChosenJobParts()" 
          />
          <div class="text-white">
            <div>
              Chosen Job Parts / Invoices Count: {{ chosenJobParts.length }}
            </div>
          </div>
        </template>
        <template v-if="jobPartCount === 0">
          <p class="text-gray-500 py-2 text-center"> 
            No jobs to invoice found.
          </p>
        </template>
      </div>
      <div
        v-if="$route.name.includes('approvedJobPartId')"
        class="issue-hubzz-invoice-shield"
        @click="close()"
      />
    </div>
  </div>
</template>
<script>
import AppTable from "@/components/Base/AppTable"
import AppButton from "@/components/Base/AppButton"
export default {
	components: {
		AppButton,
		AppTable
	},
	props: ["filter", "showDisputed", "showCompleted"],
	data () {
		return {
			// jobPartCount: 0,
			// jobParts: [],
			chosenJobParts: [],
			// for app table
			currentPage: 1,
			params: {
				...this.filter,
				limit: 10,
				offset: 0,
				order_by: ["id:asc"]
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
					name: "Practice Name",
					dataIndex: "practice_name",
					sortable: true
				},
        {
					name: "Invoice Number",
					dataIndex: "locum_invoice_item.locum_invoice.invoice_number",
					sortable: true
				},
				{
					name: "Job Part Number",
					dataIndex: "job_part_number",
					sortable: true
				},
				{
					name: "Approved At",
					dataIndex: "approved_at",
					class: "text-center localDate",
					sortable: true
				},
				{
          name: "From",
          dataIndex: "date_time_start",
					class: "text-center",
					sortable: true
				},
				{
          name: "To",
          dataIndex: "date_time_end",
					class: "text-center",
					sortable: true
				},
				{
					name: "Invoice Status",
					slot: true,
					dataIndex: "invoice_status",
					class: "text-center",
					slotName: "invoice_status_slot",
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
          name: "Actions",
          slot: true,
          slotName: "actions",
          dataIndex: "",
          class: "text-center"
        }
			]
		}
	},
	async created () {
		await this.$store.commit("jobs/TOGGLE_LOADING", true)
		let { page = 1, order_by = [] } = this.$route.query
		page = parseInt(page)
		const createdRoute = this.$route.query
		const limit = 10
		const offset = page * limit - limit
		order_by =
			createdRoute && createdRoute.order_by
				? createdRoute.order_by
				: ["id:asc"]
		let params = {
			...this.filter,
			limit,
			offset,
			order_by
		}
		console.log("filter", this.filter)
		console.log("params", params)
		if (this.showDisputed && this.showCompleted) {
			params = {
				job_practice_id: this.filter.job_practice_id,
				practice_billable_date_start: this.filter.practice_billable_date_start,
				practice_billable_date_end: this.filter.practice_billable_date_end,
				practice_invoiceable_status:  ["Approved", "Disputed","Invoiced"],
				limit,
				offset,
				order_by,
      }
      
      this.params = await params
			console.log("completed disputed params", params)
		} else	if (this.showDisputed) {
			params = {
				job_practice_id: this.filter.job_practice_id,
				practice_billable_date_start: this.filter.practice_billable_date_start,
				practice_billable_date_end: this.filter.practice_billable_date_end,
				practice_invoiceable_status: ["Approved", "Disputed"],
				limit,
				offset,
				order_by,
      }
      
      this.params = await params
			console.log("disputed params", params)
		} else if (this.showCompleted) {
			params = {
				job_practice_id: this.filter.job_practice_id,
				practice_billable_date_start: this.filter.practice_billable_date_start,
				practice_billable_date_end: this.filter.practice_billable_date_end,
				practice_invoiceable_status:["Approved", "Invoiced"],
				limit,
				offset,
				order_by,
      }
      
      this.params = await params
			console.log("completed params", params)
    }
		await this.getJobParts()
    
		// let jobPartCount = 0
		// let jobParts = ""
    
		// await this.$axios
		// 	.$get(`/api/v1/admin/job-parts/count`, { params })
		// 	.then(res => {
		// 		jobPartCount = res.data.count
    //   })
    
    // console.log('job part count', jobPartCount)

		// await this.$store.commit(
		// 	"jobs/SET_HUBZZ_BILLING_SESSIONS_COUNT",
		// 	jobPartCount
		// )

		// await this.$axios.$get(`/api/v1/admin/job-parts`, { params }).then(res => {
		// 	console.log("res", res)
    //   jobParts = res.data.job_parts.map(item => {
    //     return {
    //       ...item,
    //       isGp: item.profession.name === "GP" ? "GP" : "Non-GP",
    //       tag_status: item.terminated ? "Terminated" : item.status,
    //       date_time_start: `${this.$moment(item.date_start)
    //         .format("DD/MM/YYYY")} | ${item.time_start}`,
    //       date_time_end: `${this.$moment(item.date_end)
    //         .format("DD/MM/YYYY")} | ${item.time_end}`
    //     }
    //   })
		// })
    // console.log('job parts',jobParts)
		// await this.$store.commit("jobs/SET_HUBZZ_BILLING_SESSIONS", jobParts)

		// await this.$store.commit("jobs/TOGGLE_LOADING", false)
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
		}
	},
	methods: {
    viewJobPart (jobPartId) {
      this.$router.push(`/billings/hubzz-billing/${this.$route.params.id}/practice-hubzz-invoices/issue-hubzz-invoice/${jobPartId}`)
    },

		toggleCheck (item) {
			const index = this.chosenJobParts.findIndex(jobPart => {
				return jobPart.id === item.id
			})

			if (index > -1) {
				this.chosenJobParts.splice(index, 1)
			} else {
				this.chosenJobParts.push(item)
			}
    },
    
		emitChosenJobParts () {
			if (this.showDisputed === false) {
				this.$emit("chosenJobParts", this.chosenJobParts, false)
			} else if (this.showDisputed === true) {
				this.$emit("chosenJobParts", this.chosenJobParts, true)
			}
    },

    close () {
      this.$router.push(`/billings/hubzz-billing/${this.$route.params.id}/practice-hubzz-invoices/issue-hubzz-invoice`)
    },
    
		getJobParts () {
      console.log('get job parts params', this.params)
			this.$store.dispatch("jobs/fetchJobParts", {
				...this.params,
				order_by: this.params.order_by,
				offset: this.params.offset,
				forBilling: true,
				countOnly: true,
			}).then(()=> {
				this.$store.dispatch("jobs/fetchJobParts", {
					...this.params,
					limit: this.params.limit,
					order_by: this.params.order_by,
					offset: this.params.offset,
					forBilling: true
				})
			})
			
		},

		pagechanged (page) {
			// const query = {
			// 	...this.$route.query,
			// 	page: page || 1
			// }
			this.params.offset = this.params.limit * (page - 1)
			this.currentPage = page
			this.getJobParts()
		},

		sorted (order_by) {
			// go back to page 1
			this.currentPage = 1
			// let query = {
			// 	...this.$router.query,
			// 	order_by
			// }
			this.params.order_by = order_by
			console.log("sort params", this.params)
			this.getJobParts(this.params)
		},

		statusStyle (status) {
			switch (status) {
				case "Cancelled":
					return "bg-red-500 text-white "
				case "Disputed":
					return "bg-red-600 text-white "
				case "Invoiced":
          return "bg-blue-500 text-white"
				case "To Be Invoiced":
					return "bg-indigo-600 text-white"
				case "Completed":
					return "bg-green-600 text-white"
				case "Approved":
					return "bg-blue-600 text-white"
				default:
					return
			}
		}
	}
}
</script>

<style>
</style>