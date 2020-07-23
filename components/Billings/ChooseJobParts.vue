<template>
  <div>
    <div class="choose-job-parts-modal shadow-lg">
      <div class="p-4 md:p-8">
        <div class="p-1">
          <svgicon
            name="arrow-left-solid"
            height="32"
            width="32"
            class="fill-current cursor-pointer text-white hover:text-sunglow"
            @click="$emit('close')"
          />
        </div>
        <template v-if="jobPartCount > 0">
          <AppTable
            :router-link="`/billings/hubzz-billing/${$route.params.id}/practice-hubzz-invoices/issue-hubzz-invoice`"
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
	props: {
		filter: {
			type: Object,
			default: () => null
		},
		showDisputed: {
			type: Boolean,
			default: false,
		},
		showCompleted: {
			type: Boolean,
			default: false,
		},
		showCancelled: {
			type: Boolean,
			default: false,
		},
		showInvoiced: {
			type: Boolean,
			default: false,
		},
	},
	data () {
		return {
			chosenJobParts: [],
			currentPage: 1,
			params: {
				
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
				: ["status:asc"]
		console.log("filter", this.filter)
		this.params = {
			job_practice_id: this.filter.job_practice_id,
			practice_billable_date_start: this.filter.practice_billable_date_start,
			practice_billable_date_end: this.filter.practice_billable_date_end,
			practice_invoiceable_status:  ["Approved"],
			limit,
			offset,
			order_by,
		}
		if (this.showDisputed) {
			this.params.practice_invoiceable_status.push("Disputed")
		}
		if (this.showCompleted) {
			this.params.practice_invoiceable_status.push("Completed")
		}
		if (this.showCancelled) {
			this.params.practice_invoiceable_status.push("Cancelled")
		}
		if (this.showInvoiced) {
			this.params.practice_invoiceable_status.push("Invoiced")
		}
		await this.getJobParts()
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
			this.params.offset = this.params.limit * (page - 1)
			this.currentPage = page
			this.getJobParts()
		},

		sorted (order_by) {
			this.currentPage = 1
			this.params.order_by = order_by
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
