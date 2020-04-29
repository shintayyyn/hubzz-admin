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
            :customWidth="200"
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

            <template v-slot:status_slot="slotProps">
              <div
                class="rounded-full text-center px-4 py-1 w-32"
                :class="statusStyle(slotProps.item.invoice_status)"
              >
                {{ slotProps.item.invoice_status }}
              </div>
            </template>
          </AppTable>
          <AppButton :label="'Confirm'" @click="emitChosenJobParts()" />
        </template>
        <template v-if="jobPartCount === 0">
          <p class="text-gray-500 py-2 text-center"> 
            No jobs to invoice found.
          </p>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import AppTable from "@/components/Base/AppTable"
import AppButton from "@/components/Base/AppButton"
export default {
	props: ["filter", "showDisputed"],
	components: {
		AppButton,
		AppTable
	},
	data () {
		return {
			// jobPartCount: 0,
			// jobParts: [],
			chosenJobParts: [],
			disputedJobParts: [],
			// for app table
			currentPage: 1,
			params: {
				...this.filter,
				limit: 10,
				offset: 0,
				order_by: ["date_end:asc"]
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
				// {
				// 	name: "£ Amount",
				// 	dataIndex: "total_amount",
				//   class: "text-center",
				//   slotName: "status_slot",
				// 	sortable: true
				// },
				{
					name: "Status",
					slot: true,
					dataIndex: "invoice_status",
					class: "text-center",
					slotName: "status_slot",
					sortable: true
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
				: "date_end:asc"
		let params = {
			...this.filter,
			limit,
			offset,
			order_by
		}
		console.log("filter", this.filter)
		console.log("params", params)
		if (this.showDisputed) {
			params = {
				completed_at_date_start: this.filter.approved_at_date_start,
				completed_at_date_end: this.filter.approved_at_date_end,
				invoice_status: ["Disputed", "Issued"],
				job_practice_id: this.filter.job_practice_id,
				limit,
				offset,
				order_by
			}
			console.log("disputed params", params)
		}
    let jobPartCount,jobParts = ""
    
		await this.$axios
			.$get(`/api/v1/admin/job-parts/count`, { params })
			.then(res => {
				jobPartCount = res.data.count
			})

		await this.$store.commit(
			"jobs/SET_HUBZZ_BILLING_SESSIONS_COUNT",
			jobPartCount
		)

		await this.$axios.$get(`/api/v1/admin/job-parts`, { params }).then(res => {
			console.log("res", res)
      jobParts = res.data.job_parts.map(item => {
        return {
          ...item,
          isGp: item.profession.name === "GP" ? "GP" : "Non-GP",
          tag_status: item.terminated ? "Terminated" : item.status,
          date_time_start: `${this.$moment(item.date_start)
            .format("DD-MM-YYYY")} | ${item.time_start}`,
          date_time_end: `${this.$moment(item.date_end)
            .format("DD-MM-YYYY")} | ${item.time_end}`
        }
      })
		})
    console.log('job parts',jobParts)
		await this.$store.commit("jobs/SET_HUBZZ_BILLING_SESSIONS", jobParts)

		await this.$store.commit("jobs/TOGGLE_LOADING", false)
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
		emitChosenJobParts (event) {
			if (this.showDisputed === false) {
				this.$emit("chosenJobParts", this.chosenJobParts, false)
			} else if (this.showDisputed === true) {
				this.$emit("chosenJobParts", this.chosenJobParts, true)
			}
    },
    
		getJobParts (params) {
      console.log('get job parts params', params)
      console.log('params being used', {
				...this.params,
				limit: this.params.limit,
				search: this.search,
				order_by: this.params.order_by,
				offset: params.offset,
				forBilling: true
			})
			this.$store.dispatch("jobs/fetchJobParts", {
				...this.params,
				limit: this.params.limit,
				search: this.search,
				order_by: this.params.order_by,
				offset: params.offset,
				forBilling: true
			})
		},

		pagechanged (page) {
			// const query = {
			// 	...this.$route.query,
			// 	page: page || 1
			// }
			this.params.offset = this.params.limit * (page - 1)
			this.currentPage = page
			this.getJobParts(this.params)
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
				case "Disputed":
					return "bg-red-500 text-white "
				case "Invoiced":
					return "bg-blue-500 text-white"
				case "To Be Invoiced":
					return "bg-indigo-600 text-white"
				default:
					return
			}
		}
	}
}
</script>

<style>
</style>